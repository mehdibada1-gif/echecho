
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare } from 'lucide-react';
import type { Chat, User } from '@/lib/types';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function SendMessageButton({ targetUser }: { targetUser: User }) {
    const { user: authUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isCreatingChat, setIsCreatingChat] = React.useState(false);

    const handleSendMessage = async () => {
        if (!authUser) {
            router.push('/login');
            return;
        }
        if (authUser.uid === targetUser.id) return;
        
        setIsCreatingChat(true);

        try {
            // Check if a chat already exists
            const chatsRef = collection(db, 'chats');
            const q = query(chatsRef, where('participantIds', 'in', [[authUser.uid, targetUser.id], [targetUser.id, authUser.uid]]));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Chat already exists, navigate to it
                const chatDoc = querySnapshot.docs[0];
                router.push(`/chat/${chatDoc.id}`);
            } else {
                // Create a new chat
                const authUserDoc = await getDoc(doc(db, 'users', authUser.uid));
                if (!authUserDoc.exists()) throw new Error("Could not find current user data");
                const authUserData = authUserDoc.data() as User;
                
                const newChatRef = await addDoc(collection(db, 'chats'), {
                    participantIds: [authUser.uid, targetUser.id],
                    participants: {
                        [authUser.uid]: {
                            name: authUserData.name,
                            profileImage: authUserData.profileImage
                        },
                        [targetUser.id]: {
                            name: targetUser.name,
                            profileImage: targetUser.profileImage
                        }
                    },
                    lastMessage: null,
                    createdAt: serverTimestamp()
                });
                router.push(`/chat/${newChatRef.id}`);
            }

        } catch (error) {
            console.error("Error creating or finding chat:", error);
        } finally {
            setIsCreatingChat(false);
        }
    };
    
    if (authLoading) {
        return <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...</Button>
    }

    if (!authUser || authUser.uid === targetUser.id) {
        return null; // Don't show button if not logged in or viewing own profile
    }

    return (
        <Button onClick={handleSendMessage} disabled={isCreatingChat}>
            {isCreatingChat ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
            {isCreatingChat ? 'Starting Chat...' : 'Send Message'}
        </Button>
    )
}
