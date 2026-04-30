import { useEffect, useState } from "react";
import { supabase } from "@/integrationssupabase/client";
import type { Car } from "@/types/car";

export function useCars(opts: { limit?: number; featured?: boolean } = {}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let q = supabase.from("cars").select("*").order("created_at", { ascending: false });
      if (opts.featured) q = q.eq("featured", true);
      if (opts.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (!mounted) return;
      if (error) setError(error.message);
      else setCars((data as Car[]) ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [opts.limit, opts.featured]);

  return { cars, loading, error };
}
