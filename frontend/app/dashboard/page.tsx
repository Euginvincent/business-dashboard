"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

export default function DashboardPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const supabase = createClientComponentClient();
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:4000/api/business", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });
        setBusinesses(res.data);
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {businesses.map((biz) => (
            <li key={biz.id} className="border p-2 mb-2 rounded">
              <div className="font-bold">{biz.name}</div>
              <div>{biz.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
