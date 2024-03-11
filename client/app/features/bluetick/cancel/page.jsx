"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");
  const [showContent, setShowContent] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!userId || !type) router.push("/profile");
    else {
      setShowContent(true);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {showContent && (
        <div className="p-4 rounded-md shadow-md flex items-center flex-col">
          <h1 className="mb-4 text-2xl">Purchase Cancelled</h1>
          <Link
            className="px-4 py-2 rounded bg-blue-500"
            href="/features/bluetick"
          >
            Go Back
          </Link>
        </div>
      )}
    </div>
  );
};

export default page;
