import { useEffect, useState } from 'react';

import { getSession, login, logout } from '@/repairs/lib/api';

interface User {
  username: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const data = await login(username, password);

      setUser(data.user);

      return null;
    } catch (error) {
      return { message: error instanceof Error ? error.message : 'Sign in failed' };
    }
  };

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, signIn, signOut };
}
