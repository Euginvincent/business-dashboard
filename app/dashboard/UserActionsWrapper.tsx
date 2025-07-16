'use client';

import { useEffect, useState } from 'react';
import UserActions from './UserActions';

export default function UserActionsWrapper({ userId }: { userId: string }) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return <UserActions userId={userId} role={role} />;
}
