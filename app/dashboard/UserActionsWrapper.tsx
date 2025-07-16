'use client';

import { useEffect, useState } from 'react';
import UserActions from './UserActions';

export default function UserActionsWrapper({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [role, setRole] = useState<string | null>(null);
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedEmail = localStorage.getItem('email');
    setRole(storedRole);
    setLoggedInEmail(storedEmail);
  }, []);

  if (!loggedInEmail) return null; 

  return (
    <UserActions
      userId={userId}
      userEmail={userEmail}
      role={role}
      loggedInEmail={loggedInEmail}
    />
  );
}
