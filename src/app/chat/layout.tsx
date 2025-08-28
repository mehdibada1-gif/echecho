
'use client';

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import * as React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="container p-4"><Skeleton className="w-full h-[calc(100vh-150px)]" /></div>;
  }
  
  return <>{children}</>;
}
