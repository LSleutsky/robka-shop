import { clsx } from 'clsx';
import { MapPin, Send } from 'lucide-react';
import { SubmitEvent, useState } from 'react';

import InstagramIcon from '@/site/components/InstagramIcon';

import { inputBase } from '@/constants';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const canSubmit = name.trim() && email.trim() && message.trim();

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: integrate with a form service or email API
    setSent(true);
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
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
            <div className="lg:col-span-3">
              {sent ? (
                <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-8 sm:p-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <Send className="size-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Message Sent</h2>
                  <p className="text-slate-400 text-sm">Thank you for reaching out. We will get back to you soon.</p>
                  <button
                    className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200"
                    onClick={() => {
                      setSent(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-8"
                  onSubmit={event => handleSubmit(event)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        className={inputBase}
                        id="name"
                        onChange={event => setName(event.target.value)}
                        placeholder="Your name"
                        type="text"
                        value={name}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className={inputBase}
                        id="email"
                        onChange={event => setEmail(event.target.value)}
                        placeholder="your@email.com"
                        type="email"
                        value={email}
                      />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-5 space-y-1.5">
                    <label
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                      htmlFor="subject"
                    >
                      Subject
                    </label>
                    <input
                      className={inputBase}
                      id="subject"
                      onChange={event => setSubject(event.target.value)}
                      placeholder="What is this about?"
                      type="text"
                      value={subject}
                    />
                  </div>
                  <div className="mt-4 sm:mt-5 space-y-1.5">
                    <label
                      className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      className={clsx(inputBase, 'min-h-36 resize-y')}
                      id="message"
                      onChange={event => setMessage(event.target.value)}
                      placeholder="Tell us what you need..."
                      value={message}
                    />
                  </div>
                  <button
                    className={clsx(
                      'mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-transparent transition-all duration-300',
                      'bg-linear-to-r from-blue-500 to-violet-600 text-white',
                      'shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:brightness-110',
                      'disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none'
                    )}
                    disabled={!canSubmit}
                    type="submit"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7">
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
              <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7">
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
