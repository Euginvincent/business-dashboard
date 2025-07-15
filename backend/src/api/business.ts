
import { Request, Response } from "express";
import { supabase } from "../utils/supabase";
import { db } from "../db/drizzle";
import { businesses, users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getUserFromRequest(req: Request) {
  const token =
  req.cookies["sb-access-token"] ||
  req.headers["authorization"]?.split(" ")[1];
  if (!token) return null;

  const { data, error } = await req.supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.supabase_id, data.user.id))
    .limit(1);

  return dbUser[0] || null;
}

export async function getBusinesses(req: Request, res: Response) {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (user.role === "admin") {
    const all = await db.select().from(businesses);
    return res.json(all);
  } else {
    const own = await db
      .select()
      .from(businesses)
      .where(eq(businesses.owner_id, user.id));
    return res.json(own);
  }
}

export async function createBusiness(req: Request, res: Response) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  const { name, description, owner_id } = req.body;
  const [business] = await db
    .insert(businesses)
    .values({ name, description, owner_id })
    .returning();
  res.json(business);
}

export async function updateBusiness(req: Request, res: Response) {
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const id = Number(req.params.id);
  const { name, description } = req.body;

  const [biz] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.id, id))
    .limit(1);

  if (!biz) return res.status(404).json({ error: "Not found" });
  if (user.role !== "admin" && biz.owner_id !== user.id)
    return res.status(403).json({ error: "Forbidden" });

  const [updated] = await db
    .update(businesses)
    .set({ name, description })
    .where(eq(businesses.id, id))
    .returning();

  res.json(updated);
}

export async function deleteBusiness(req: Request, res: Response) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });

  await db.delete(businesses).where(eq(businesses.id, Number(req.params.id)));
  res.json({ success: true });
}
