// pages/api/business/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { db } from '../../../lib/drizzle';
import { businesses } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const businessId = parseInt(req.query.id as string);

  if (req.method === 'PATCH') {
    const existing = await db.select().from(businesses).where(eq(businesses.id, businessId)).limit(1);
    const business = existing[0];

    if (!business) return res.status(404).json({ message: 'Not Found' });

    const isOwner = business.userId === user.id;

    if (userProfile?.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, description, location } = req.body;
    const updated = await db.update(businesses)
      .set({ name, description, location })
      .where(eq(businesses.id, businessId))
      .returning();

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    if (userProfile?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const deleted = await db.delete(businesses).where(eq(businesses.id, businessId)).returning();
    return res.status(200).json(deleted);
  }

  res.setHeader('Allow', ['PATCH', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
