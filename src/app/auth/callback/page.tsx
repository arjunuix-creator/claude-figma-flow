"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const errorParam = url.searchParams.get("error");
        const errorDescription = url.searchParams.get("error_description");

        // Surface errors returned by the OAuth provider
        if (errorParam) {
          throw new Error(errorDescription ?? errorParam);
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        // Whether we exchanged a code or already had a session, redirect
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (!mounted) return;

        if (data.session) {
          router.replace("/dashboard");
        } else {
          throw new Error("No session established after authentication.");
        }
      } catch (e: unknown) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Authentication failed.");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090c14] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="w-full rounded-2xl border border-[#1e2640] bg-[#141827] p-8 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.4)]">
          {error ? (
            <>
              <div className="text-lg font-semibold text-red-400">Sign-in failed</div>
              <div className="mt-3 rounded-[14px] border border-[#1e2640] bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
              <button
                onClick={() => router.replace("/login")}
                className="mt-5 h-10 w-full rounded-[14px] bg-gradient-to-b from-indigo-500 to-violet-500 text-sm font-semibold text-white"
              >
                Back to login
              </button>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold">Signing you in…</div>
              <div className="mt-2 text-sm text-slate-600">
                Please wait while we finish authentication.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
