// /pages/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/main"); // Redirects to /home
  }, [router]);

  return null; // You can return a loading spinner or null while the redirect happens
};

export default Index;
