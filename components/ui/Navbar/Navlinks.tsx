'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/dashboard');
  const isAccount = pathname.startsWith('/account');

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      <div className="flex items-center flex-1">
        {/* Logo always goes home/landing */}
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>

        {/* Main nav */}
        <nav className="ml-6 space-x-2 lg:block">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`${s.link} ${isDashboard ? 'text-white' : ''}`}
              >
                Dashboard
              </Link>
              <Link
                href="/account"
                className={`${s.link} ${isAccount ? 'text-white' : ''}`}
              >
                Account
              </Link>
            </>
          ) : (
            <Link href="#pricing" className={s.link}>
              Pricing
            </Link>
          )}
        </nav>
      </div>

      {/* Right side: sign in / sign out */}
      <div className="flex justify-end space-x-8">
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={pathname} />
            <button type="submit" className={s.link}>
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
