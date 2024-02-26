"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const ClientMember = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin?callbackUrl=/client-member");
    },
  });

  return (
    <div>
      <h1>Member Client Componenet</h1>
      <h2>Hello {session?.user.name}</h2>
      <hr className="mb-4" />
      <p>Email: {session?.user.email}</p>
      <p>Role: {session?.user.role}</p>
    </div>
  );
};

export default ClientMember;
