import { Loader2 } from 'lucide-react';

import App from '@/repairs/App';

import LoginPage from '@/repairs/components/LoginPage';
import useAuth from '@/repairs/hooks/useAuth';

export default function Root() {
  const { session, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#050810] flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-blue-500/60" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage onSignIn={signIn} />;
  }

  return <App onSignOut={() => void signOut()} />;
}
