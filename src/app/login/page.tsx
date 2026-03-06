"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" {...props}>
      <path
        d="M9 0C4.03 0 0 4.03 0 9a9.004 9.004 0 006.14 8.548c.45.083.614-.194.614-.432 0-.213-.008-.778-.012-1.528-2.502.544-3.03-1.206-3.03-1.206-.409-1.04-1-1.317-1-1.317-.817-.558.062-.547.062-.547.904.064 1.38.928 1.38.928.802 1.375 2.105.978 2.619.748.082-.582.314-.978.57-1.203-1.998-.228-4.1-1-4.1-4.446 0-.982.35-1.786.926-2.415-.093-.227-.401-1.142.088-2.38 0 0 .755-.242 2.474.922A8.61 8.61 0 019 4.33c.765.003 1.535.103 2.255.303 1.718-1.164 2.472-.922 2.472-.922.49 1.238.182 2.153.09 2.38.576.629.924 1.433.924 2.415 0 3.455-2.106 4.215-4.11 4.438.323.279.61.83.61 1.673 0 1.208-.012 2.182-.012 2.479 0 .24.162.52.618.432A9.004 9.004 0 0018 9c0-4.97-4.03-9-9-9z"
        fill="#94a3b8"
      />
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1.333 8s2.334-4.667 6.667-4.667S14.667 8 14.667 8s-2.334 4.667-6.667 4.667S1.333 8 1.333 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 9.833A1.833 1.833 0 1 0 8 6.167a1.833 1.833 0 0 0 0 3.666Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) router.replace("/dashboard");
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090c14] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[776px_1fr]">
        <aside className="relative hidden overflow-hidden border-r border-[#1e2640] bg-[#0f1320] lg:block">
          <div className="pointer-events-none absolute right-[-24px] top-[340px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,1)_0%,rgba(99,102,241,0)_70%)] opacity-20 blur-[80px]" />

          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-[54px] pt-[48px]">
              <div className="grid h-9 w-9 place-items-center rounded-[14px] bg-gradient-to-br from-indigo-500 to-violet-500">
                <span className="text-base font-bold text-white">F</span>
              </div>
              <span className="text-lg font-semibold text-slate-100">Finova</span>
            </div>

            <div className="flex flex-1 items-center px-[171px]">
              <div className="w-[432px]">
                <h1 className="text-[36px] font-bold leading-[45px] tracking-[-0.5px] text-slate-100">
                  Your finances,
                  <br />
                  <span className="bg-gradient-to-b from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                    beautifully clear.
                  </span>
                </h1>
                <p className="mt-4 text-base leading-[25.6px] text-slate-400">
                  Track spending, manage budgets, and grow your wealth — all in
                  one premium dashboard.
                </p>

                <div className="mt-8 flex gap-4">
                  {[
                    { value: "$2.4B+", label: "Assets managed" },
                    { value: "50K+", label: "Active users" },
                    { value: "99.9%", label: "Uptime" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="w-[133px] rounded-[14px] border border-[#1e2640] bg-white/[0.03] px-[16.823px] py-[16.823px]"
                    >
                      <div className="text-[20px] font-bold leading-[28px] text-slate-100">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs leading-4 text-slate-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-[54px] pb-12">
              <div className="w-[692px] rounded-[14px] border border-[#1e2640] bg-white/[0.03] px-[20.833px] py-[20.833px]">
                <p className="text-sm italic leading-5 text-slate-400">
                  &quot;Finova completely changed how I manage my business
                  finances. The UX is incredible.&quot;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-indigo-500">
                    <span className="text-xs font-bold text-white">S</span>
                  </div>
                  <div>
                    <div className="text-xs font-medium leading-[18px] text-slate-100">
                      Sarah Chen
                    </div>
                    <div className="text-xs leading-[18px] text-slate-600">
                      CEO, Luminary Studio
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen items-center justify-center px-6 py-14 lg:px-0">
          <div className="w-full max-w-[420px] rounded-[14px] border border-[#1e2640] bg-[#141827] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.4)]">
            <div className="p-8">
              <header className="space-y-1">
                <h2 className="text-2xl font-bold leading-8 text-slate-100">
                  Welcome back
                </h2>
                <p className="text-sm leading-5 text-slate-600">
                  Sign in to your account to continue
                </p>
              </header>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    setMessage(null);
                    setSubmitting(true);
                    try {
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                        },
                      });
                      if (error) throw error;
                    } catch (e: unknown) {
                      setMessage(e instanceof Error ? e.message : "Google sign-in failed.");
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className="flex h-10 items-center justify-center gap-2 rounded-[14px] border border-[#1e2640] text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.04]"
                >
                  <GoogleIcon className="h-4 w-4" />
                  Google
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setMessage(null);
                    setSubmitting(true);
                    try {
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: "github",
                        options: {
                          redirectTo: `${window.location.origin}/auth/callback`,
                        },
                      });
                      if (error) throw error;
                    } catch (e: unknown) {
                      setMessage(e instanceof Error ? e.message : "GitHub sign-in failed.");
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  className="flex h-10 items-center justify-center gap-2 rounded-[14px] border border-[#1e2640] text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.04]"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#1e2640]" />
                <span className="text-xs text-slate-600">
                  or continue with email
                </span>
                <div className="h-px flex-1 bg-[#1e2640]" />
              </div>

              <form
                className="mt-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setMessage(null);
                  setSubmitting(true);
                  try {
                    const { error } = await supabase.auth.signInWithPassword({
                      email,
                      password,
                    });
                    if (error) throw error;
                    router.push("/dashboard");
                  } catch (err: unknown) {
                    setMessage(
                      err instanceof Error ? err.message : "Email/password sign-in failed."
                    );
                    setSubmitting(false);
                  }
                }}
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor={emailId}
                    className="text-xs font-medium text-slate-400"
                  >
                    Email
                  </label>
                  <input
                    id={emailId}
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="h-10 w-full rounded-[14px] border border-[#1e2640] bg-[#0f1320] px-3 text-sm text-slate-100 placeholder:text-[rgba(241,245,249,0.35)] outline-none focus:border-indigo-500/70"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={passwordId}
                      className="text-xs font-medium text-slate-400"
                    >
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-xs font-medium text-indigo-500 hover:text-indigo-400"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      id={passwordId}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={submitting}
                      className="h-10 w-full rounded-[14px] border border-[#1e2640] bg-[#0f1320] px-3 pr-10 text-sm text-slate-100 placeholder:text-[rgba(241,245,249,0.35)] outline-none focus:border-indigo-500/70"
                    />
                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={submitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {message ? (
                  <div className="rounded-[14px] border border-[#1e2640] bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting || !email || !password}
                  className="h-10 w-full rounded-[14px] bg-gradient-to-b from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-[0px_8px_18px_0px_rgba(99,102,241,0.25)] transition-transform active:translate-y-px"
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm leading-6 text-slate-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="#"
                  className="text-base font-medium leading-6 text-indigo-500 hover:text-indigo-400"
                >
                  Sign up free
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

