import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>You must be logged in.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  const { data: userData } = await supabase
    .from("users_table")
    .select("plan, status")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>

      <p>
        <strong>Subscription Plan:</strong> {userData?.plan}
      </p>
      <p>
        <strong>Status:</strong> {userData?.status}
      </p>

      {userData?.plan === "Agency" && (
        <div className="mt-4 p-4 border rounded">
          <p>🔥 Agency features unlocked</p>
        </div>
      )}

      {userData?.plan === "Pro" && (
        <div className="mt-4 p-4 border rounded">
          <p>⭐ Pro features unlocked</p>
        </div>
      )}

      {userData?.plan === "Basic" && (
        <div className="mt-4 p-4 border rounded">
          <p>🙂 Basic features enabled</p>
        </div>
      )}

      <Link
        href="/billing"
        className="block mt-6 text-blue-500 underline"
      >
        Manage Billing
      </Link>
    </div>
  );
}
