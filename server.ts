import 'dotenv/config';

import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import nodemailer from 'nodemailer';
import path from 'path';

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? '3000');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

app.use(compression());
app.disable('x-powered-by');
app.use(express.json());
app.use(morgan('tiny'));

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body as Record<string, string>;

    if (!name || !email || !phone || !subject) {
      res.status(400).json({ error: 'Missing required fields' });

      return;
    }

    await transporter.sendMail({
      from: email || `Robka Shop <jewelrydoctor@gmail.com>`,
      to: 'jewelrydoctor@gmail.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
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
