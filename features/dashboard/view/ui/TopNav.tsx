'use client';

import { TopNavView } from './TopNavView';
import { useTopNav } from '../hooks/useTopNav';
import type { TopNavProps } from '@/features/dashboard/view/types/top-nav.types';

export function TopNav({ user, profile }: TopNavProps) {
  const nav = useTopNav();
  return <TopNavView user={user} profile={profile} {...nav} />;
}
