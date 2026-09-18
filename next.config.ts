import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These are Supabase's publishable (client-safe) values — fine to ship
  // inline. Rotate via NEXT_PUBLIC_* project env vars on Vercel if preferred.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://eijptlqhryelatlxkggp.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      "sb_publishable_82TSYWqMecq-BJnLL4T5Gw_dMOxhwGL",
  },
};

export default nextConfig;
