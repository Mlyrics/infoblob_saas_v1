// app/pricing/page.tsx
import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import { getProducts, getSubscription, getUser } from '@/utils/supabase/queries';

export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
  ]);
  // Do NOT redirect logged-in users; just render pricing
  return (
    <main className="min-h-screen bg-black text-white">
      <Pricing user={user} products={products ?? []} subscription={subscription} />
    </main>
  );
}
