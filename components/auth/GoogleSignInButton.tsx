"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/components/auth/AuthProvider";

// "Continue with Google" button. Renders nothing if the public client id isn't
// configured, so the auth pages keep working without Google set up.
export function GoogleSignInButton({ from }: { from?: string | null }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (!clientId) return null;

  async function handleCredential(credential?: string) {
    if (!credential) {
      setError("Google sign-in failed. Please try again.");
      return;
    }
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign-in failed.");
        return;
      }
      await refreshUser();
      const dest =
        from && from.startsWith("/")
          ? from
          : data.user?.role === "ADMIN"
            ? "/admin"
            : "/account";
      router.push(dest);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <GoogleOAuthProvider clientId={clientId}>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) => handleCredential(cred.credential)}
            onError={() => setError("Google sign-in failed. Please try again.")}
            text="continue_with"
            shape="rectangular"
            width="320"
          />
        </div>
      </GoogleOAuthProvider>
      {error && (
        <p className="mt-2 text-center text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
