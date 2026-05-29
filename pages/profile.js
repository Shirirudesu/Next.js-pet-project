import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUser } from "../context/UserContext";

export default function UserProfile(props) {
  const { status, data: session } = useSession();
  const { credits, user, isLoading } = useUser();
  const ROLES = { 0: "Admin", 1: "User", 2: "Writer" };
  console.log(user);

  if (status === "authenticated") {
    return (
      <div className="shadow-xl p-8 rounded-md flex flex-col gap-3 bg-yellow-200">
        <Image
          className="rounded-full"
          src={session?.user?.image}
          width={60}
          height={60}
        />
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>

        <div>
          Role:{" "}
          <span className="font-bold">{ROLES[user?.roleId] ?? "Unknown"} </span>
        </div>

        <div>
          Credits: <span className="font-bold"> {credits} </span>
        </div>
      </div>
    );
  } else {
    return "Hello";
  }
}
