'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton({ className = 'nav-logout' }: { className?: string }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <button className={className} onClick={logout} type="button" aria-label="Sign out">
      Sign out
    </button>
  );
}
