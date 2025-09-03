
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="relative flex min-h-screen flex-col">
           <main className="flex-1 pb-20">
              <div className="mx-auto max-w-md bg-background shadow-2xl flex flex-col flex-1 min-h-screen">
                <Header />
                 <div className="flex-1 p-4">
                    <Skeleton className="h-screen w-full" />
                 </div>
              </div>
            </main>
            <BottomNav />
        </div>
    )
  }


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
