
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, addDoc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import type { Chat, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function ChatPage() {
    const { chatId } = useParams();
    const router = useRouter();
    const { user: authUser } = useAuth();
    const [chat, setChat] = React.useState<Chat | null>(null);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [newMessage, setNewMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!chatId || !authUser) return;

        const chatDocRef = doc(db, 'chats', chatId as string);
        const unsubscribeChat = onSnapshot(chatDocRef, (doc) => {
            if (doc.exists()) {
                const chatData = doc.data() as Chat;
                if (!chatData.participantIds.includes(authUser.uid)) {
                    router.push('/chat'); // Not a participant, redirect
                    return;
                }
                setChat({ id: doc.id, ...chatData });
            } else {
                router.push('/chat');
            }
            setIsLoading(false);
        });
        
        const messagesRef = collection(db, 'chats', chatId as string, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(messagesData);
        });

        return () => {
            unsubscribeChat();
            unsubscribeMessages();
        };

    }, [chatId, authUser, router]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !authUser || !chatId) return;

        const text = newMessage;
        setNewMessage('');

        const messagesRef = collection(db, 'chats', chatId as string, 'messages');
        const chatDocRef = doc(db, 'chats', chatId as string);
        
        const messageData = {
            text,
            senderId: authUser.uid,
            createdAt: serverTimestamp(),
        };
        
        try {
            await addDoc(messagesRef, messageData);
            await updateDoc(chatDocRef, {
                lastMessage: messageData
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    if (isLoading) {
        return (
            <div className="h-[calc(100vh-5rem)] flex flex-col">
                <header className="p-4 border-b flex items-center gap-4">
                     <Skeleton className="h-8 w-8" />
                    <div className="flex items-center gap-3">
                         <Skeleton className="h-10 w-10 rounded-full" />
                         <Skeleton className="h-6 w-32" />
                    </div>
                </header>
                <div className="flex-1 p-4 space-y-4">
                    <Skeleton className="h-10 w-2/3" />
                    <Skeleton className="h-10 w-1/2 ml-auto" />
                    <Skeleton className="h-12 w-3/4" />
                </div>
                 <footer className="p-4 border-t">
                    <Skeleton className="h-10 w-full" />
                </footer>
            </div>
        )
    }

    if (!chat) {
        return null;
    }

    const otherParticipantId = chat.participantIds.find(id => id !== authUser?.uid);
    const otherParticipant = otherParticipantId ? chat.participants[otherParticipantId] : null;

    return (
        <div className="h-[calc(100vh-128px)] flex flex-col bg-muted/20">
            <header className="p-4 border-b flex items-center gap-4 bg-background sticky top-[64px] z-10">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/chat">
                        <ArrowLeft />
                    </Link>
                </Button>
                {otherParticipant && (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={otherParticipant.profileImage} />
                            <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="font-semibold text-lg">{otherParticipant.name}</h2>
                    </div>
                )}
            </header>

            <main className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map(message => (
                    <div
                        key={message.id}
                        className={cn(
                            'flex items-end gap-2',
                            message.senderId === authUser?.uid ? 'justify-end' : 'justify-start'
                        )}
                    >
                         {message.senderId !== authUser?.uid && otherParticipant && (
                             <Avatar className="h-8 w-8">
                                 <AvatarImage src={otherParticipant.profileImage} />
                                 <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                         )}
                        <div
                            className={cn(
                                'max-w-xs md:max-w-md p-3 rounded-lg',
                                message.senderId === authUser?.uid
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-background rounded-bl-none'
                            )}
                        >
                            <p className="text-sm">{message.text}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send />
                    </Button>
                </form>
            </footer>
        </div>
    );
}
