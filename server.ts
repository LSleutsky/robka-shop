import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { Resend } from 'resend';

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? '3000');

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

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Robka Shop <contact@robkashop.com>',
      to: ['LushSleutsky@gmail.com'],
      subject: subject ? `Contact Form: ${subject}` : 'CONTACT FORM SUBMISSION',
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
        <h3>Message</h3>
        <p>${message}</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);

      res.status(500).json({ error: 'Failed to send email' });

      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error(`Contact form error: ${error}`);

    res.status(500).json({ error: 'Internal server error' });
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
