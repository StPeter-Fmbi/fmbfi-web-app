import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  // Redirect if no session or not an admin
  if (!session || session.user?.role !== "Admin") {
    return {
      redirect: {
        destination: "/main", // Redirect to the main page if not an admin
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

const AdminDashboard = () => {
  return <div>Admin Dashboard Content</div>;
};

export default AdminDashboard;
