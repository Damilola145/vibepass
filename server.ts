import express from 'express';
console.log('Starting server.ts...');
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios from 'axios';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { getDB } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Data Directory (Use env var or default to current directory)
const DATA_DIR = process.env.DATA_DIR || __dirname;

// Ensure uploads directory exists (for local fallback)
const uploadDir = path.join(DATA_DIR, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
app.set('trust proxy', 1);
const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'vibe-pass-secret-key';
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
const EMAIL_FROM = process.env.EMAIL_FROM || 'vibepass@example.com';

// Configure Storage (Cloudinary or Local)
let storage;

if (process.env.CLOUDINARY_URL) {
  console.log('Using Cloudinary for storage');
  cloudinary.config({
    secure: true
  });
  
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'vibepass',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    } as any,
  });
} else {
  console.log('Using Local Disk for storage');
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({ storage: storage });

// Database Setup
const db = getDB();

// Migrations / Schema Update
async function runMigrations() {
  try {
    // Check if table exists first before altering
    const tableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    
    if (tableExists) {
      const userColumns = await db.all("PRAGMA table_info(users)");
      const userColumnNames = userColumns.map(c => c.name);
      
      if (!userColumnNames.includes('is_verified')) {
        await db.run("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
      }
      if (!userColumnNames.includes('verification_code')) {
        await db.run("ALTER TABLE users ADD COLUMN verification_code TEXT");
      }
      if (!userColumnNames.includes('google_id')) {
        await db.run("ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE");
      }
      if (!userColumnNames.includes('is_admin')) {
        await db.run("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0");
      }
    }

    const txTableExists = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='transactions'");
    if (txTableExists) {
      const txColumns = await db.all("PRAGMA table_info(transactions)");
      const txColumnNames = txColumns.map(c => c.name);

      if (!txColumnNames.includes('event_title')) {
        await db.run("ALTER TABLE transactions ADD COLUMN event_title TEXT");
      }
      if (!txColumnNames.includes('event_date')) {
        await db.run("ALTER TABLE transactions ADD COLUMN event_date TEXT");
      }
      if (!txColumnNames.includes('event_location')) {
        await db.run("ALTER TABLE transactions ADD COLUMN event_location TEXT");
      }
    }
  } catch (e) {
    console.log("Migration check failed:", e);
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      is_verified INTEGER DEFAULT 0,
      verification_code TEXT,
      google_id TEXT UNIQUE,
      is_admin INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      date TEXT,
      location TEXT,
      price REAL,
      category TEXT,
      image TEXT,
      organizer TEXT
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      event_id TEXT,
      event_title TEXT,
      event_date TEXT,
      event_location TEXT,
      qr_value TEXT,
      purchase_date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      event_id TEXT,
      amount REAL,
      status TEXT, -- pending, completed, failed
      tx_ref TEXT UNIQUE,
      created_at TEXT,
      event_title TEXT,
      event_date TEXT,
      event_location TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(event_id) REFERENCES events(id)
    );
  `);

  // Cleanup unverified users on startup (after ensuring table exists)
  try {
    await db.run('DELETE FROM users WHERE is_verified = 0');
    console.log('Cleaned up unverified users on startup.');
  } catch (e) {
    console.log('Error cleaning up users (table might be empty):', e);
  }

  // Seed Events
  const eventsCount = await db.get('SELECT COUNT(*) as count FROM events');
  if (eventsCount.count === 0) {
    const MOCK_EVENTS = [
      {
        id: '1',
        title: 'Summer Solstice Jazz Gala',
        description: 'An elegant evening of smooth jazz under the stars. Featuring world-renowned saxophonists and a gourmet dinner service.',
        date: '2026-06-21T19:00:00',
        location: 'Riverside Amphitheater',
        price: 65,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=1200',
        organizer: 'Vibe Productions'
      },
      {
        id: '2',
        title: 'Digital Art Expo 2026',
        description: 'Explore the intersection of technology and creativity. Featuring VR installations, NFT galleries, and live digital painting.',
        date: '2026-05-10T10:00:00',
        location: 'Modern Art Museum',
        price: 25,
        category: 'Art',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
        organizer: 'Creative Minds Collective'
      },
      {
        id: '3',
        title: 'Tech Summit: Future AI',
        description: 'Join industry leaders for a day of talks and workshops on the future of Artificial Intelligence and its impact on society.',
        date: '2026-06-22T09:00:00',
        location: 'Innovation Hub',
        price: 150,
        category: 'Tech',
        image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=1200',
        organizer: 'TechForward'
      },
      {
        id: '4',
        title: 'Gourmet Street Food Tour',
        description: 'Taste the best street food the city has to offer. From spicy tacos to artisanal desserts, there\'s something for everyone.',
        date: '2026-04-20T12:00:00',
        location: 'Central Park Plaza',
        price: 15,
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1200',
        organizer: 'City Eats'
      },
      {
        id: '5',
        title: 'Championship Finals: Basketball',
        description: 'The final game of the season. Witness the intensity as the top two teams battle it out for the trophy.',
        date: '2026-05-05T19:30:00',
        location: 'Victory Stadium',
        price: 80,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1200',
        organizer: 'Pro League'
      },
      {
        id: '6',
        title: 'Startup Pitch Night',
        description: 'Watch the next generation of entrepreneurs pitch their ideas to a panel of expert investors.',
        date: '2026-04-30T18:00:00',
        location: 'The Loft Coworking',
        price: 10,
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
        organizer: 'Venture Hub'
      }
    ];

    for (const event of MOCK_EVENTS) {
      await db.run('INSERT INTO events (id, title, description, date, location, price, category, image, organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        event.id, event.title, event.description, event.date, event.location, event.price, event.category, event.image, event.organizer);
    }
  }

  // --- Admin Setup ---
  const ADMIN_EMAILS = ['damilolaolonitola807@gmail.com'];

  // Promote admins on startup if they exist
  for (const email of ADMIN_EMAILS) {
    await db.run('UPDATE users SET is_admin = 1 WHERE LOWER(email) = ?', email.toLowerCase());
  }

  // Normalize all existing emails to lowercase to fix login issues for older accounts
  try {
    await db.run('UPDATE users SET email = LOWER(email)');
  } catch (err) {
    console.error('Error normalizing emails:', err);
  }
}

// Run migrations on start
runMigrations();

const ADMIN_EMAILS = ['damilolaolonitola807@gmail.com'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use('/uploads', express.static(uploadDir));

// --- Middleware ---
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Auth Routes ---
app.post('/api/auth/signup', async (req, res) => {
  let { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  email = email.toLowerCase().trim();

  try {
    // Check if user already exists
    const existingUser: any = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', email);
    
    let verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    if (existingUser) {
      if (existingUser.is_verified === 1) {
        return res.status(400).json({ error: 'Email already exists and is verified. Please log in.' });
      } else {
        // User exists but is not verified. Update their code, name, and password, then resend.
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run('UPDATE users SET verification_code = ?, name = ?, password = ? WHERE id = ?', verificationCode, name, hashedPassword, existingUser.id);
      }
    } else {
      // New user
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run('INSERT INTO users (email, password, name, verification_code) VALUES (?, ?, ?, ?)', email, hashedPassword, name, verificationCode);
    }
    
    const success = await sendVerificationEmail(email, name, verificationCode);
    
    if (!success) {
      // Rollback user creation if email fails to send (only if it was a new user)
      if (!existingUser) {
        await db.run('DELETE FROM users WHERE LOWER(email) = ?', email);
      }
      return res.status(500).json({ error: 'Failed to send verification email. Please try again or use Google login.' });
    }
    
    res.json({ message: 'Verification code sent to your email.', email });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  let { email, code } = req.body;
  email = email?.toLowerCase().trim();
  const user: any = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', email);

  console.log(`[VERIFY] Attempting to verify user: ${email}`);
  console.log(`[VERIFY] Code provided: '${code}', Code in DB: '${user?.verification_code}'`);

  if (!user || String(user.verification_code).trim() !== String(code).trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  await db.run('UPDATE users SET is_verified = 1, verification_code = NULL WHERE id = ?', user.id);
  
  // Send welcome email
  await sendWelcomeEmail(user.email, user.name);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 }, JWT_SECRET);
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 } });
});

app.post('/api/auth/resend', async (req, res) => {
  let { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  email = email.toLowerCase().trim();

  const user: any = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.is_verified) return res.status(400).json({ error: 'User already verified' });

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  await db.run('UPDATE users SET verification_code = ? WHERE id = ?', verificationCode, user.id);

  try {
    await sendVerificationEmail(email, user.name, verificationCode);
    res.json({ message: 'Verification code resent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  let { email, password } = req.body;
  email = email?.toLowerCase().trim();
  const user: any = await db.get('SELECT * FROM users WHERE LOWER(email) = ?', email);

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.is_verified === 0) {
    return res.status(403).json({ error: 'Please verify your email first', needsVerification: true });
  }

  // Force admin status if in ADMIN_EMAILS
  if (ADMIN_EMAILS.includes(user.email)) {
    await db.run('UPDATE users SET is_admin = 1 WHERE id = ?', user.id);
    user.is_admin = 1;
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 }, JWT_SECRET);
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ user: { id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 } });
});

// --- Google OAuth ---
app.get('/api/auth/google/url', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  // Use APP_URL if available, otherwise fallback to request host with correct protocol
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const appUrl = process.env.APP_URL || `${protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl.replace(/\/$/, '')}/api/auth/google/callback`;
  
  console.log('Generating Google Auth URL with redirect_uri:', redirectUri);

  const options = {
    redirect_uri: redirectUri,
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  res.json({ 
    url: `${rootUrl}?${qs.toString()}`,
    redirectUri: redirectUri // Send back so user can verify
  });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const appUrl = process.env.APP_URL || `${protocol}://${req.get('host')}`;
  const redirectUri = `${appUrl.replace(/\/$/, '')}/api/auth/google/callback`;

  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth credentials not configured');
    }

    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;
    const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let user: any = await db.get('SELECT * FROM users WHERE LOWER(email) = ? OR google_id = ?', googleUser.email.toLowerCase(), googleUser.id);

    if (!user) {
      const result = await db.run('INSERT INTO users (email, name, google_id, is_verified) VALUES (?, ?, ?, 1)', googleUser.email, googleUser.name, googleUser.id);
      user = { id: result.lastInsertRowid, email: googleUser.email, name: googleUser.name, is_admin: 0 };
    } else if (!user.google_id) {
      await db.run('UPDATE users SET google_id = ?, is_verified = 1 WHERE id = ?', googleUser.id, user.id);
    }

    // Force admin status if in ADMIN_EMAILS
    if (ADMIN_EMAILS.includes(user.email)) {
      await db.run('UPDATE users SET is_admin = 1 WHERE id = ?', user.id);
      user.is_admin = 1;
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 }, JWT_SECRET);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', user: ${JSON.stringify({ id: user.id, email: user.email, name: user.name, isAdmin: user.is_admin === 1 })} }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error('Google OAuth Error:', err.response?.data || err.message);
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR', error: '${err.message}' }, '*');
              window.close();
            } else {
              document.write('Google authentication failed: ${err.message}');
            }
          </script>
        </body>
      </html>
    `);
  }
});

app.get('/api/auth/me', authenticate, async (req: any, res) => {
  const user: any = await db.get('SELECT * FROM users WHERE id = ?', req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  res.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      isAdmin: user.is_admin === 1 
    } 
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ success: true });
});

// --- Event Routes ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.all('SELECT * FROM events');
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', authenticate, upload.single('image'), async (req: any, res) => {
  // Fetch fresh user to check admin status
  const user: any = await db.get('SELECT * FROM users WHERE id = ?', req.user.id);
  
  if (!user || user.is_admin !== 1) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { title, description, date, location, price, category, organizer } = req.body;
  let image = req.body.image; // Could be a URL string if no file uploaded

  if (req.file) {
    // If file uploaded, use the path provided by Multer (Cloudinary or Local)
    if (req.file.path) {
      image = req.file.path; // Cloudinary returns full URL in .path
    } else {
      // Local fallback
      image = `${process.env.APP_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;
    }
  }

  if (!image) {
    return res.status(400).json({ error: 'Image is required (URL or File)' });
  }

  const id = Math.random().toString(36).substr(2, 9);

  try {
    await db.run('INSERT INTO events (id, title, description, date, location, price, category, image, organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, title, description, date, location, price, category, image, organizer);
    res.json({ success: true, event: { id, title, description, date, location, price, category, image, organizer } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// --- Ticket Routes ---
app.get('/api/tickets', authenticate, async (req: any, res) => {
  try {
    const tickets = await db.all('SELECT * FROM tickets WHERE user_id = ? ORDER BY purchase_date DESC', req.user.id);
    
    const formattedTickets = tickets.map((t: any) => ({
      id: t.id,
      eventId: t.event_id,
      userEmail: req.user.email,
      purchaseDate: t.purchase_date,
      qrValue: t.qr_value,
      eventTitle: t.event_title,
      eventDate: t.event_date,
      eventLocation: t.event_location
    }));

    res.json({ tickets: formattedTickets });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// --- Payment Routes (Flutterwave) ---
app.post('/api/payments/initialize', authenticate, async (req: any, res) => {
  const { eventId, amount, eventTitle, eventDate, eventLocation } = req.body;
  const tx_ref = `VP-${Date.now()}-${req.user.id}`;

  try {
    let link;

    if (process.env.FLW_SECRET_KEY) {
      // Real Flutterwave Implementation
      const response = await axios.post('https://api.flutterwave.com/v3/payments', {
        tx_ref,
        amount,
        currency: 'NGN',
        redirect_url: `${process.env.APP_URL}/api/payments/callback`,
        customer: {
          email: req.user.email,
          name: req.user.name
        },
        customizations: {
          title: 'VibePass Tickets',
          description: `Payment for ${eventTitle}`,
          logo: `${process.env.APP_URL}/logo.png` // Optional
        }
      }, {
        headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }
      });

      if (response.data.status === 'success') {
        link = response.data.data.link;
      } else {
        throw new Error('Flutterwave initialization failed');
      }
    } else {
      // Mock Implementation
      console.log('Using Mock Payment (FLW_SECRET_KEY not set)');
      link = `${process.env.APP_URL}/api/payments/callback?status=successful&tx_ref=${tx_ref}&transaction_id=MOCK-${Date.now()}`;
    }

    // Save pending transaction
    await db.run('INSERT INTO transactions (id, user_id, event_id, amount, status, tx_ref, created_at, event_title, event_date, event_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      tx_ref, req.user.id, eventId, amount, 'pending', tx_ref, new Date().toISOString(), eventTitle, eventDate, eventLocation);

    res.json({ link });
  } catch (err: any) {
    console.error('Payment Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
});

app.get('/api/payments/callback', async (req, res) => {
  const { status, tx_ref, transaction_id } = req.query;

  if (status === 'successful' || status === 'completed') {
    const transaction: any = await db.get('SELECT * FROM transactions WHERE tx_ref = ?', tx_ref);
    
    if (transaction && transaction.status === 'pending') {
      // Verify transaction with Flutterwave if key exists
      if (process.env.FLW_SECRET_KEY) {
        try {
          const verification = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }
          });
          
          if (verification.data.status !== 'success' || verification.data.data.status !== 'successful') {
            return res.send('Payment verification failed.');
          }
          
          // Verify amount matches
          if (verification.data.data.amount < transaction.amount) {
             return res.send('Payment amount mismatch.');
          }
        } catch (err) {
          console.error('Verification Error:', err);
          return res.send('Payment verification error.');
        }
      }

      // Update transaction status
      await db.run('UPDATE transactions SET status = ? WHERE tx_ref = ?', 'completed', tx_ref);

      // Generate Ticket
      const ticketId = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const user: any = await db.get('SELECT * FROM users WHERE id = ?', transaction.user_id);
      
      const qrValue = `VIBEPASS-${ticketId}-${user.email}`;
      
      await db.run(`
        INSERT INTO tickets (id, user_id, event_id, event_title, event_date, event_location, qr_value, purchase_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, 
        ticketId, 
        transaction.user_id, 
        transaction.event_id, 
        transaction.event_title || 'Event Title', 
        transaction.event_date || new Date().toISOString(), 
        transaction.event_location || 'Location', 
        qrValue, 
        new Date().toISOString()
      );

      // Send Email
      await sendTicketEmail(user.email, user.name, ticketId, qrValue);

      return res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'PAYMENT_SUCCESS', ticketId: '${ticketId}' }, '*');
                window.close();
              } else {
                document.write('<div style="text-align:center; padding:50px; font-family:sans-serif;"><h1>Payment Successful!</h1><p>You can close this window and return to the app.</p></div>');
              }
            </script>
          </body>
        </html>
      `);
    } else if (transaction && transaction.status === 'completed') {
       return res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'PAYMENT_SUCCESS', ticketId: 'ALREADY_PROCESSED' }, '*');
                window.close();
              }
            </script>
            <p>Payment already processed.</p>
          </body>
        </html>
      `);
    }
  }

  res.send('Payment failed or cancelled.');
});

// --- Email Logic ---
async function sendVerificationEmail(to: string, name: string, code: string): Promise<boolean> {
  // Always log the code in development or if email is not configured
  console.log('==================================================');
  console.log(`[DEV MODE] Verification Code for ${to}: ${code}`);
  console.log('==================================================');

  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured. Email not sent.');
    return false;
  }

  try {
    await sgMail.send({
      from: EMAIL_FROM,
      to,
      subject: 'Verify your VibePass account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Welcome to VibePass, ${name}!</h2>
          <p>Please use the code below to verify your account:</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #6b7280;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `
    });

    console.log(`Verification email sent to ${to}`);
    return true;
  } catch (err: any) {
    console.error('Error sending verification email:', err.response?.body || err);
    return false;
  }
}

async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    return false;
  }

  try {
    await sgMail.send({
      from: EMAIL_FROM,
      to,
      subject: 'Welcome to VibePass!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4f46e5;">You're In, ${name}! 🎉</h2>
          <p>Your email has been successfully verified.</p>
          <p>You can now explore events, book tickets, and manage your bookings.</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.APP_URL || 'http://localhost:3000'}/events" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Browse Events</a>
          </div>
          <p style="font-size: 12px; color: #6b7280;">Thank you for joining VibePass.</p>
        </div>
      `
    });

    console.log(`Welcome email sent to ${to}`);
    return true;
  } catch (err: any) {
    console.error('Error sending welcome email:', err.response?.body || err);
    return false;
  }
}

async function sendTicketEmail(to: string, name: string, ticketId: string, qrValue: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY not configured. Cannot send ticket email.');
    return;
  }

  try {
    await sgMail.send({
      from: EMAIL_FROM,
      to,
      subject: 'Your VibePass Event Ticket',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Hi ${name}, your ticket is ready!</h2>
          <p>Thank you for booking with VibePass. Here are your ticket details:</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
            <p><strong>Event:</strong> Your Upcoming Event</p>
          </div>
          <p>Show the QR code below at the entrance:</p>
          <div style="text-align: center; margin: 20px 0;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrValue)}" alt="QR Code" />
          </div>
          <p style="font-size: 12px; color: #6b7280;">If you have any questions, reply to this email.</p>
        </div>
      `
    });

    console.log(`Ticket email sent to ${to}`);
  } catch (err: any) {
    console.error('Error sending email:', err.response?.body || err);
  }
}

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
