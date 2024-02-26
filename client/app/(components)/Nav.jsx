import React from "react";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

const Nav = async () => {
  const session = await getServerSession(options);

  return (
    <header className="bg-gray-600 text-gray-100">
      <nav className="flex justify-between items-center px-10 py-4 w-full">
        <Link href="/">
          <h1>My App</h1>
        </Link>
        <div className="flex gap-10">
          <Link className="hover:text-gray-300" href="/">
            Home
          </Link>
          <Link className="hover:text-gray-300" href="public">
            Public
          </Link>
          <Link className="hover:text-gray-300" href="/member">
            Member
          </Link>
          <Link className="hover:text-gray-300" href="/client-member">
            Client Member
          </Link>
          <Link className="hover:text-gray-300" href="/create-user">
            Create User
          </Link>
          {session ? (
            <Link
              className="hover:text-gray-300"
              href="/api/auth/signout?callbackUrl=/"
            >
              Logout
            </Link>
          ) : (
            <Link className="hover:text-gray-300" href="/api/auth/signin">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
