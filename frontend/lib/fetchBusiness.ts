import { supabase } from "./supabaseClient";
import axios from "axios";

export const fetchBusinesses = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) return [];

  const res = await axios.get("http://localhost:4000/api/business", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return res.data;
};
