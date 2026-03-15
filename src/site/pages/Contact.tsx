import { clsx } from 'clsx';
import { MapPin, Send } from 'lucide-react';
import { ChangeEvent, SubmitEvent, useState } from 'react';

import GoogleIcon from '@/site/components/GoogleIcon';
import InstagramIcon from '@/site/components/InstagramIcon';

import { inputBase } from '@/constants';
import { capitalizeFirst, capitalizeWords, formatPhone } from '@/utils';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = {
    name: !name.trim() ? 'Name is required' : '',
    email: !email.trim() ? 'Email is required' : '',
    phone: !phone.trim() ? 'Phone number is required' : '',
    message: !message.trim() ? 'Message is required' : ''
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    setTouched({ name: true, email: true, phone: true, message: true });

    if (hasErrors) {
      return;
    }

    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };

        throw new Error(data.error ?? 'Failed to send message');
      }

      setSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(capitalizeWords(event.target.value));
  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>) => setSubject(capitalizeWords(event.target.value));
  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => setPhone(formatPhone(event.target.value));

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(capitalizeFirst(event.target.value));

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 left-1/4 w-150 h-150 bg-blue-600/4 rounded-full blur-[120px]" />
        <div className="absolute -top-48 right-1/4 w-150 h-150 bg-violet-600/3 rounded-full blur-[120px]" />
      </div>
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">Contact</h1>
            <p className="mt-4 sm:mt-6 text-lg text-slate-400 leading-relaxed">
              Have a question about a piece, need a repair, or want to discuss a custom design? Reach out.
            </p>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
            <div className="lg:col-span-3 flex flex-col">
              {sent ? (
                <div className="flex-1 rounded-2xl border border-slate-700/30 bg-slate-900/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="size-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Message Sent!</h2>
                  <p className="text-slate-400 text-sm">Thank you for reaching out. We will get back to you soon.</p>
                  <button
                    className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200"
                    onClick={() => {
                      setSent(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  className="flex-1 flex flex-col rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-8"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        htmlFor="name"
                      >
                        Name *
                      </label>
                      <input
                        className={clsx(
                          inputBase,
                          touched.name &&
                            errors.name &&
                            'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                        )}
                        id="name"
                        onBlur={() => setTouched(prevTouched => ({ ...prevTouched, name: true }))}
                        onChange={handleNameChange}
                        placeholder="Your name"
                        type="text"
                        value={name}
                      />
                      {touched.name && errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        htmlFor="email"
                      >
                        Email *
                      </label>
                      <input
                        className={clsx(
                          inputBase,
                          touched.email &&
                            errors.email &&
                            'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                        )}
                        id="email"
                        onBlur={() => setTouched(prevTouched => ({ ...prevTouched, email: true }))}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="your@email.com"
                        type="email"
                        value={email}
                      />
                      {touched.email && errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        htmlFor="phone"
                      >
                        Phone *
                      </label>
                      <input
                        className={clsx(
                          inputBase,
                          touched.phone &&
                            errors.phone &&
                            'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                        )}
                        id="phone"
                        onBlur={() => setTouched(prevTouched => ({ ...prevTouched, phone: true }))}
                        onChange={handlePhoneChange}
                        placeholder="(555) 123-4567"
                        type="tel"
                        value={phone}
                      />
                      {touched.phone && errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        htmlFor="subject"
                      >
                        Subject
                      </label>
                      <input
                        className={inputBase}
                        id="subject"
                        onChange={handleSubjectChange}
                        placeholder="What is this about?"
                        type="text"
                        value={subject}
                      />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-5 flex-1 flex flex-col gap-1.5">
                    <label
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                      htmlFor="message"
                    >
                      Message *
                    </label>
                    <textarea
                      className={clsx(
                        inputBase,
                        'flex-1 min-h-36 resize-y',
                        touched.message &&
                          errors.message &&
                          'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20'
                      )}
                      id="message"
                      onBlur={() => setTouched(prevTouched => ({ ...prevTouched, message: true }))}
                      onChange={handleMessageChange}
                      placeholder="Tell us what you need..."
                      value={message}
                    />
                    {touched.message && errors.message && <p className="text-xs text-red-400">{errors.message}</p>}
                  </div>
                  {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                  <button
                    className={clsx(
                      'mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-transparent transition-all duration-300',
                      'bg-linear-to-r from-blue-500 to-violet-600 text-white',
                      'shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:brightness-110',
                      'disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none'
                    )}
                    disabled={sending}
                    type="submit"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
              <div className="flex-1 rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center mb-4">
                  <MapPin className="size-5 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Location</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Golden Nugget Antique Market
                  <br />
                  Lambertville, New Jersey
                </p>
              </div>
              <div className="flex-1 rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center mb-4">
                  <InstagramIcon className="size-5 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Instagram</h3>
                <a
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  href="https://instagram.com/robs.place"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  @robs.place
                </a>
              </div>
              <div className="flex-1 rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center mb-4">
                  <GoogleIcon className="size-5 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">Leave a Comment</h3>
                <a
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  href="https://g.page/r/CddCfmuxLaylEBM/review"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Review us on Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
