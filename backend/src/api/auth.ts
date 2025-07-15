import { db } from "../db/drizzle";
import { users } from "../db/schema";
import { Request, Response } from "express";

export async function registerUser(req: Request, res: Response) {
  const { email, supabase_id } = req.body;

  try {
    const [user] = await db
      .insert(users)
      .values({ email, supabase_id, role: "user" })
      .onConflictDoNothing()
      .returning();

    res.status(200).json(user || { message: "User already exists" });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Registration failed" });
  }
}
