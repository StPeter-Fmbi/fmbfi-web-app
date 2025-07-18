// /pages/data.tsx
import { useEffect, useState } from "react";
import { NextPage } from "next";

type SheetData = {
  name: string;
  email: string;
  role: string;
}[];

const DataPage: NextPage = () => {
  const [data, setData] = useState<SheetData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getData");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Submitted Data</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200">Name</th>
              <th className="py-2 px-4 bg-gray-200">Email</th>
              <th className="py-2 px-4 bg-gray-200">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{row.name}</td>
                <td className="py-2 px-4 border">{row.email}</td>
                <td className="py-2 px-4 border">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default DataPage;
