import { clsx } from 'clsx';
import { Anvil, Loader2, LogIn } from 'lucide-react';
import { SubmitEvent, useState } from 'react';

import { inputBase } from '@/constants';

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<{ message: string } | null>;
}

export default function LoginPage({ onSignIn }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    // TODO: if this ever becomes expanded to multiple users, this will need to be updated to actually look up the email based on the username instead of just appending `@gmail.com`
    const email = `${username.trim().toLowerCase()}@gmail.com`;
    const result = await onSignIn(email, password);

    if (result) {
      setError('Invalid username or password.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-[#050810] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/4 w-150 h-150 bg-blue-600/4 rounded-full blur-[120px]" />
        <div className="absolute -top-48 right-1/4 w-150 h-150 bg-violet-600/3 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Anvil className="size-9 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Rob's Place</h1>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Repair Tracker</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Sign in to continue</p>
        </div>
        <form
          className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm shadow-lg shadow-black/20 p-6 space-y-5"
          onSubmit={event => void handleSubmit(event)}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="username">
              Username
            </label>
            <input
              autoFocus
              autoComplete="username"
              className={inputBase}
              id="username"
              onChange={event => setUsername(event.target.value)}
              placeholder="Enter your username"
              type="text"
              value={username}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className={inputBase}
              id="password"
              onChange={event => setPassword(event.target.value)}
              placeholder="Enter your password"
              type="password"
              value={password}
            />
          </div>
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            className={clsx(
              'w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-transparent transition-all duration-300',
              'bg-linear-to-r from-blue-500 to-violet-600 text-white',
              'shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:brightness-110',
              'disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none'
            )}
            disabled={!username.trim() || !password.trim() || loading}
            type="submit"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
