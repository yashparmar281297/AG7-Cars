import { useEffect, useState } from "react";
import { supabase } from "@/integrationssupabase/client";
import type { Session, User } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
      else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId: string) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
    setLoading(false);
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
    setSession(null);
    window.location.href = "/";
  };

  return { session, user, isAdmin, loading, signOut };
}


// import { useEffect, useState } from "react";
// import { supabase } from "@/integrationssupabase/client";
// import type { Session, User } from "@supabase/supabase-js";

// export function useAuth() {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       if (session?.user) checkAdmin(session.user.id);
//       else setLoading(false);
//     });

//     // Listen for auth changes (login/logout)
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       if (session?.user) checkAdmin(session.user.id);
//       else {
//         setIsAdmin(false);
//         setLoading(false);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   async function checkAdmin(userId: string) {
//     const { data } = await supabase
//       .from("user_roles")
//       .select("role")
//       .eq("user_id", userId)
//       .eq("role", "admin")
//       .maybeSingle();

//     setIsAdmin(!!data);
//     setLoading(false);
//   }

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setIsAdmin(false);
//     setUser(null);
//     setSession(null);
//     window.location.href = "/";
//   };

//   return { session, user, isAdmin, loading, signOut };
// }

