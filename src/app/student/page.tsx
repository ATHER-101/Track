import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(options);
  if(!session || session?.user?.role != "student"){
    redirect("/signIn");
  }

  return (
    <>
      <div className="flex justify-between bg-blue-300">
        <div className="text-blue-500 hover:text-blue-800 p-3">{session?(session?.user?.name):("User Name")}</div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 my-1 mx-3 rounded">  
        <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
        </button>
      </div>
    </>
  );
};

export default page;
