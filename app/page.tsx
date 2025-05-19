import { auth } from "@/auth";
import { redirect } from "next/navigation";
 
const Home = async () => {
  const session = await auth();

  console.log(session);

  if (!session?.user) {
    redirect("/login");
  }

  redirect("/dashboard");
};

export default Home;