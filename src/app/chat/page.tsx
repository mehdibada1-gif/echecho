
'use client';

import * as React from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import type { Chat } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatListPage() {
    const { user: authUser } = useAuth();
    const [chats, setChats] = React.useState<Chat[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [clientLoaded, setClientLoaded] = React.useState(false);

    React.useEffect(() => {
        setClientLoaded(true);
    }, []);

    React.useEffect(() => {
        if (!authUser) return;

        setIsLoading(true);
        const chatsRef = collection(db, 'chats');
        // The query was changed here to remove the orderBy clause that was causing the missing index error.
        // Sorting is now handled on the client-side after data is fetched.
        const q = query(
            chatsRef, 
            where('participantIds', 'array-contains', authUser.uid)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chatsData = querySnapshot.docs.map(doc => {
                 const data = doc.data();
                 return {
                     id: doc.id,
                     ...data,
                     lastMessage: data.lastMessage ? {
                         ...data.lastMessage,
                         createdAt: data.lastMessage.createdAt?.toDate()
                     } : null
                 } as Chat;
            });
            
            // Sort chats by last message date client-side
            const sortedChats = chatsData.sort((a, b) => {
                const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
                const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
                return dateB - dateA;
            });

            setChats(sortedChats);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching chats:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [authUser]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 space-y-4">
                 <h1 className="text-3xl font-bold font-headline mb-6">Conversations</h1>
                 {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-grow">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold font-headline mb-6">Conversations</h1>
            <Card>
                <CardContent className="p-0">
                    {chats.length > 0 ? (
                        <div className="divide-y">
                            {chats.map(chat => {
                                const otherParticipantId = chat.participantIds.find(id => id !== authUser?.uid);
                                if (!otherParticipantId) return null;
                                const otherParticipant = chat.participants[otherParticipantId];
                                const lastMessageDate = chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt) : null;

                                return (
                                    <Link key={chat.id} href={`/chat/${chat.id}`} className="block hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center space-x-4 p-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={otherParticipant?.profileImage} />
                                                <AvatarFallback>{otherParticipant?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold">{otherParticipant?.name}</p>
                                                    {clientLoaded && lastMessageDate && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(lastMessageDate, { addSuffix: true })}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {chat.lastMessage ? `${chat.lastMessage.senderId === authUser?.uid ? 'You: ' : ''}${chat.lastMessage.text}` : 'No messages yet...'}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                         <div className="text-center py-16">
                            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-semibold">No conversations yet.</p>
                            <p className="text-sm text-muted-foreground">Find a user on the leaderboard to start a chat.</p>
                             <Button asChild variant="outline" className="mt-4">
                                <Link href="/leaderboard">Go to Leaderboard</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
