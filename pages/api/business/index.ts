// pages/api/business/index.ts
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

  if (req.method === 'GET') {
    if (userProfile?.role === 'admin') {
      const result = await db.select().from(businesses);
      return res.status(200).json(result);
    } else {
      const result = await db
        .select()
        .from(businesses)
        .where(eq(businesses.userId, user.id));
      return res.status(200).json(result);
    }
  }

  if (req.method === 'POST') {
    if (userProfile?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { userId, name, description, location } = req.body;
    const inserted = await db.insert(businesses).values({ userId, name, description, location }).returning();
    return res.status(201).json(inserted);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

