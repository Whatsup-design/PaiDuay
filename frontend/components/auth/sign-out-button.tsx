"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { logout } from "@/lib/auth-api";
import { clearAuthSession } from "@/lib/auth-session";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await logout();
    } catch {
      // Logout should not trap users if the network/backend is unavailable.
    } finally {
      clearAuthSession();
      router.replace("/login");
      router.refresh();
    }
  }

  function closeConfirm() {
    if (!isSigningOut) {
      setIsConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Logout"
        disabled={isSigningOut}
        onClick={() => setIsConfirmOpen(true)}
        className={className}
      >
        <LogOut className="h-4 w-4" />
      </button>

      {isConfirmOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center bg-neutral-950/45 px-4 backdrop-blur-sm"
              role="presentation"
              onClick={closeConfirm}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="sign-out-title"
                aria-describedby="sign-out-description"
                className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-5 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                  <LogOut className="h-5 w-5" />
                </div>

                <h2
                  id="sign-out-title"
                  className="mt-4 text-lg font-semibold text-neutral-950"
                >
                  Sign out?
                </h2>
                <p
                  id="sign-out-description"
                  className="mt-2 text-sm leading-6 text-neutral-500"
                >
                  Are you sure you want to sign out? Your local session token
                  will be cleared from this device.
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isSigningOut}
                    onClick={closeConfirm}
                    className="h-10 cursor-pointer rounded-md border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSigningOut}
                    onClick={handleSignOut}
                    className="h-10 cursor-pointer rounded-md bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </section>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
