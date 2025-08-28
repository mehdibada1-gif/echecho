
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCountryName } from "@/data/countries";
import { db } from "@/lib/firebase";
import { Event, User, Chat } from "@/lib/types";
import { collection, doc, getDoc, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { format } from "date-fns";
import { ArrowLeft, Building, Calendar, Globe, Mail, MapPin, Sprout, MessageSquare, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

async function getUserData(id: string) {
    const userDocRef = doc(db, 'users', id);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        return null;
    }
    
    const eventsQuery = query(collection(db, 'events'), where('createdBy', '==', id));
    const eventsSnapshot = await getDocs(eventsQuery);
    const createdEvents = eventsSnapshot.docs.map(d => {
        const data = d.data();
        return { 
            id: d.id, 
            ...data, 
            date: data.date.toDate(),
            endDate: data.endDate.toDate()
        } as Event;
    });

    return {
        user: { id: userDoc.id, ...userDoc.data() } as User,
        createdEvents
    };
}


export default function ProfilePage({ params }: { params: { id: string } }) {
    const { user: authUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = React.useState<{user: User, createdEvents: Event[]} | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isCreatingChat, setIsCreatingChat] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getUserData(params.id);
            setUserData(data);
            setIsLoading(false);
        };
        fetchData();
    }, [params.id]);
    
    const handleSendMessage = async () => {
        if (!authUser || !userData?.user) return;
        setIsCreatingChat(true);

        try {
            // Check if a chat already exists
            const chatsRef = collection(db, 'chats');
            const q = query(chatsRef, where('participantIds', 'array-contains', authUser.uid));
            const querySnapshot = await getDocs(q);

            let existingChat: Chat | null = null;
            querySnapshot.forEach(doc => {
                const chat = doc.data() as Chat;
                if (chat.participantIds.includes(userData.user.id)) {
                    existingChat = { id: doc.id, ...chat };
                }
            });

            if (existingChat) {
                router.push(`/chat/${existingChat.id}`);
            } else {
                // Create a new chat
                const authUserDoc = await getDoc(doc(db, 'users', authUser.uid));
                if (!authUserDoc.exists()) throw new Error("Could not find current user data");
                const authUserData = authUserDoc.data() as User;
                
                const newChatRef = await addDoc(collection(db, 'chats'), {
                    participantIds: [authUser.uid, userData.user.id],
                    participants: {
                        [authUser.uid]: {
                            name: authUserData.name,
                            profileImage: authUserData.profileImage
                        },
                        [userData.user.id]: {
                            name: userData.user.name,
                            profileImage: userData.user.profileImage
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

    if (isLoading || authLoading) {
        return <div className="container mx-auto p-4 space-y-8"><Skeleton className="w-full h-screen" /></div>
    }

    if (!userData) {
        notFound();
    }

    const { user, createdEvents } = userData;

    return (
        <div className="container mx-auto p-4 space-y-8">
            <div className="mb-4">
                <Button asChild variant="ghost">
                    <Link href="/leaderboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Leaderboard
                    </Link>
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.profileImage} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
                                <p className="flex items-center text-muted-foreground"><Mail className="mr-2 h-4 w-4" />{user.email}</p>
                                <p className="flex items-center text-muted-foreground"><MapPin className="mr-2 h-4 w-4" />{getCountryName(user.country)}</p>
                            </div>
                        </div>
                        {authUser && authUser.uid !== user.id && (
                             <Button onClick={handleSendMessage} disabled={isCreatingChat}>
                                {isCreatingChat ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                                {isCreatingChat ? 'Starting Chat...' : 'Send Message'}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Eco-Profile Description</h3>
                        <p className="text-muted-foreground italic">
                            {user.ecoProfileDescription || "No description available."}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Contributions</h3>
                        <p className="text-muted-foreground">{user.contributions || "No contributions listed yet."}</p>
                    </div>
                    {user.badges && user.badges.length > 0 && (
                         <div>
                            <h3 className="font-semibold text-lg mb-2">Badges</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.badges.map(badge => <Badge key={badge} variant="secondary">{badge}</Badge>)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Sprout className="mr-2"/>Created Initiatives ({createdEvents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {createdEvents.length > 0 ? (
                        <div className="space-y-4">
                            {createdEvents.map(event => (
                                <Link key={event.id} href={`/events/${event.id}`} className="block hover:bg-muted/50 rounded-lg p-4 border">
                                    <div className="flex items-center gap-4">
                                        <Image src={event.beforePhotos[0]} alt={event.title} width={80} height={60} className="rounded-md object-cover"/>
                                        <div>
                                            <h4 className="font-bold">{event.title}</h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4" />
                                                {format(event.date as Date, 'PPP')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">This user hasn't created any initiatives yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
