import { db } from "../db/drizzle";
import { users } from "../db/schema";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

export async function promoteToAdmin(req: Request, res: Response) {
  const { userId } = req.body;
  await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));
  res.json({ success: true });
}