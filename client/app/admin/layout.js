"use client";

import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import AdminSidebar from "@/components/sidebars/AdminSidebar";
import AdminHeader from "@/components/header/AdminHeader";
import ToggleTheme from "@/components/ToggleTheme";
import Loader from "@/components/Loader";

function AdminLayout({ children }) {
  const { adminInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (!adminInfo) router.push("/auth/admin/signin");
  }, []);

  if (adminInfo) {
    return (
      <section className="flex justify-between w-full dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-900">
        <AdminSidebar adminInfo={adminInfo} />
        <div className="w-full flex flex-col">
          <AdminHeader adminInfo={adminInfo} />
          <main className="p-4">{children}</main>
        </div>
        <ToggleTheme />
      </section>
    );
  } else {
    return <Loader />;
  }
}
export default AdminLayout;
