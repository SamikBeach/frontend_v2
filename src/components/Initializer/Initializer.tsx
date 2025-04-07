'use client';

import { getCurrentUser } from '@/apis/user';
import { userAtom } from '@/atoms/user';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export default function Initializer() {
  const setCurrentUser = useSetAtom(userAtom);

  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: getCurrentUser,
    retry: 0,
  });

  useEffect(() => {
    setCurrentUser(userData ?? null);
  }, [userData, setCurrentUser]);

  return null;
}

export { Initializer };
