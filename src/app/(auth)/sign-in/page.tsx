"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function SignInPae() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button
        className="px-4 py-1 rounded bg-blue-500 "
        onClick={() => signIn()}
      >
        Sign in
      </button>
    </>
  );
}
