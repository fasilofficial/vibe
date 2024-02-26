import { getServerSession } from "next-auth";
import React from "react";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const Member = async () => {
  const session = await getServerSession(options);

  if (!session) redirect("/api/auth/signin?callbackUrl=/member");

  return (
    <div>
      <h1>Member Server Componenet</h1>
      <h2>Hello {session?.user.name}</h2>
      <hr className="mb-4" />
      <p>Email: {session?.user.email}</p>
      <p>Role: {session?.user.role}</p>
      <img src={session?.user.image} />
    </div>
  );
};

export default Member;
