"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const AUTH_KEY = "wedding_authenticated";
// Cookie 7 jours (évite de se déconnecter tous les jours)
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

function AuthForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const secretLink = searchParams.get("secret");
  const passwordConfig = process.env.NEXT_PUBLIC_WEDDING_PASSWORD ?? "";
  const secretConfig = process.env.NEXT_PUBLIC_WEDDING_SECRET;
  const isDashboard = redirect.startsWith("/dashboard");
  const isSecretValid = !!secretLink && !!secretConfig && secretLink === secretConfig;

  useEffect(() => {
    if (isSecretValid) {
      document.cookie = `${AUTH_KEY}=true; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
      window.location.href = redirect;
    }
  }, [isSecretValid, redirect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordConfig) {
      setError(true);
      return;
    }
    if (password === passwordConfig) {
      if (typeof window !== "undefined") {
        document.cookie = `${AUTH_KEY}=true; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
      }
      // Redirection complète pour que le cookie soit bien envoyé au prochain chargement
      window.location.href = redirect;
    } else {
      setError(true);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-champagne-200">
      <h1 className="font-serif text-xl sm:text-2xl text-stone-800 text-center mb-2">
        Accès privé
      </h1>
      <p className="text-stone-600 text-center text-sm mb-6">
        {isDashboard
          ? "Entrez le mot de passe du tableau de bord pour continuer."
          : "Entrez le mot de passe pour accéder au site."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Mot de passe"
          className="w-full px-4 py-3 rounded-lg border border-champagne-300 focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none text-base min-h-[48px]"
          autoFocus
        />
        {error && (
          <p className="text-red-500 text-sm">
            {!passwordConfig
              ? "Aucun mot de passe configuré. Ajoutez NEXT_PUBLIC_WEDDING_PASSWORD dans .env.local"
              : "Mot de passe incorrect."}
          </p>
        )}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition font-medium touch-manipulation min-h-[48px]"
        >
          Accéder
        </button>
      </form>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 bg-champagne-50">
      <Suspense fallback={<div className="w-full max-w-md h-64 bg-champagne-100 rounded-2xl animate-pulse" />}>
        <AuthForm />
      </Suspense>
    </main>
  );
}
