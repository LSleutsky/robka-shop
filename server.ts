import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import nodemailer from 'nodemailer';
import path from 'path';
import { Pool } from 'pg';

import 'dotenv/config';

interface SessionPayload {
  sub: string;
}

interface RepairRow {
  id: number;
  ticket: string;
  date: string;
  customer: string;
  phone: string | null;
  items: string[];
  specs: string | null;
  status: string;
  picked_up_at: string | null;
  created_at: string;
  price: string | null;
}

interface RepairPayload {
  ticket: string;
  date: string;
  customer: string;
  phone: string | null;
  items: string[];
  specs: string | null;
  status: string;
  price?: number | null;
}

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? '3000');
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!DATABASE_URL) {
  throw new Error('Missing database URL');
}
if (!SESSION_SECRET) {
  throw new Error('Missing session secret');
}
if (!ADMIN_USERNAME) {
  throw new Error('Missing username');
}
if (!ADMIN_PASSWORD) {
  throw new Error('Missing password');
}

const SESSION_COOKIE = 'rs_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

const REPAIR_COLUMNS =
  'id, ticket, date::text AS date, customer, phone, items, specs, status, picked_up_at, created_at, price';

const pool = new Pool({ connectionString: DATABASE_URL });

pool.on('connect', client => {
  void client.query('SET search_path TO robka_shop, public');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const signSession = (username: string) =>
  jwt.sign({ sub: username } satisfies SessionPayload, SESSION_SECRET, { expiresIn: SESSION_TTL_SECONDS });

const readSession = (req: Request): SessionPayload | null => {
  const token = (req.cookies as Record<string, string | undefined>)[SESSION_COOKIE];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, SESSION_SECRET) as SessionPayload;
  } catch {
    return null;
  }
};

const setSessionCookie = (res: Response, token: string) => {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: '/'
  });
};

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!readSession(req)) {
    res.status(401).json({ error: 'Unauthorized' });

    return;
  }

  next();
};

const serializeRepair = (row: RepairRow) => ({
  ...row,
  date: typeof row.date === 'string' ? row.date : new Date(row.date).toISOString().slice(0, 10),
  price: row.price == null ? null : Number(row.price)
});

app.use(compression());
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: 'Missing credentials' });

    return;
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid username or password' });

    return;
  }

  setSessionCookie(res, signSession(username));

  res.json({ user: { username } });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ success: true });
});

app.get('/api/auth/session', (req, res) => {
  const session = readSession(req);

  if (!session) {
    res.json({ user: null });

    return;
  }

  res.json({ user: { username: session.sub } });
});

app.get('/api/repairs', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query<RepairRow>(`SELECT ${REPAIR_COLUMNS} FROM repairs ORDER BY id DESC`);

    res.json(rows.map(serializeRepair));
  } catch (error) {
    console.error(`GET /api/repairs error: ${String(error)}`);

    res.status(500).json({ error: 'Failed to load repairs' });
  }
});

app.post('/api/repairs', requireAuth, async (req, res) => {
  try {
    const body = req.body as RepairPayload;

    const { rows } = await pool.query<RepairRow>(
      `INSERT INTO repairs (ticket, date, customer, phone, items, specs, status, price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING ${REPAIR_COLUMNS}`,
      [
        body.ticket,
        body.date,
        body.customer,
        body.phone ?? null,
        body.items,
        body.specs ?? null,
        body.status,
        body.price ?? null
      ]
    );

    res.json(serializeRepair(rows[0]));
  } catch (error) {
    console.error(`POST /api/repairs error: ${String(error)}`);

    res.status(500).json({ error: 'Failed to create repair' });
  }
});

app.patch('/api/repairs/:id', requireAuth, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id as string);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' });

      return;
    }

    const body = req.body as Partial<RepairPayload>;
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    const assign = (column: string, value: unknown) => {
      fields.push(`${column} = $${String(index++)}`);
      values.push(value);
    };

    if (body.ticket !== undefined) {
      assign('ticket', body.ticket);
    }

    if (body.date !== undefined) {
      assign('date', body.date);
    }

    if (body.customer !== undefined) {
      assign('customer', body.customer);
    }

    if (body.phone !== undefined) {
      assign('phone', body.phone);
    }

    if (body.items !== undefined) {
      assign('items', body.items);
    }

    if (body.specs !== undefined) {
      assign('specs', body.specs);
    }

    if (body.status !== undefined) {
      assign('status', body.status);
      assign('picked_up_at', body.status === 'Picked Up' ? new Date().toISOString() : null);
    }

    if (body.price !== undefined) {
      assign('price', body.price);
    }

    if (!fields.length) {
      res.status(400).json({ error: 'No fields to update' });

      return;
    }

    values.push(id);

    const { rows } = await pool.query<RepairRow>(
      `UPDATE repairs SET ${fields.join(', ')} WHERE id = $${String(index)} RETURNING ${REPAIR_COLUMNS}`,
      values
    );

    if (!rows.length) {
      res.status(404).json({ error: 'Repair not found' });

      return;
    }

    res.json(serializeRepair(rows[0]));
  } catch (error) {
    console.error(`PATCH /api/repairs/:id error: ${String(error)}`);

    res.status(500).json({ error: 'Failed to update repair' });
  }
});

app.delete('/api/repairs', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body as { ids?: number[] };

    if (!Array.isArray(ids) || !ids.length) {
      res.status(400).json({ error: 'Missing ids' });

      return;
    }

    await pool.query('DELETE FROM repairs WHERE id = ANY($1::bigint[])', [ids]);

    res.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/repairs error: ${String(error)}`);

    res.status(500).json({ error: 'Failed to delete repairs' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body as Record<string, string>;

    if (!name || !email || !phone || !message) {
      res.status(400).json({ error: 'Missing required fields' });

      return;
    }

    await transporter.sendMail({
      from: `${name} <jewelrydoctor@gmail.com>`,
      to: 'jewelrydoctor@gmail.com',
      replyTo: email,
      subject: subject ? `Contact Form: ${subject}` : 'Contact Form Submission',
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        ${message ? `<h3>Message</h3><p>${message}</p>` : ''}
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error(`Contact form error: ${error}`);

    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/metals', async (_req, res) => {
  try {
    const response = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${process.env.METALS_API_KEY}&currency=USD&unit=toz`
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(`Metals API error: ${error}`);

    res.status(500).json({ error: 'Failed to fetch metals prices' });
  }
});

app.use('/assets', express.static('dist/assets', { immutable: true, maxAge: '1y' }));
app.use(express.static('dist', { maxAge: '1h' }));
app.use((_req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${String(PORT)}`);
});
