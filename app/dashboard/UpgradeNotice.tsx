// app/dashboard/UpgradeNotice.tsx
'use client';

import Link from 'next/link';

/**
 * A reusable component that encourages users to upgrade.
 * Customize the default message as needed.
 */
export default function UpgradeNotice({
  message = 'Upgrade to Pro to unlock this feature.',
}: {
  message?: string;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-white/80">{message}</div>
      <div className="mt-3 flex gap-2">
        <Link
          href="/pricing"
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
        >
          Upgrade to Pro
        </Link>
        <Link
          href="/dashboard/account"
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80"
        >
          Manage billing
        </Link>
      </div>
    </div>
  );
}
