import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const session = await getServerSession(options);
  if (session) redirect("/");

  return (
    <section className="h-screen w-screen flex justify-center items-center">
      {children}
    </section>
  );
};

export default layout;
