
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCountryName } from '@/data/countries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, ArrowLeft, Leaf, Recycle, Sprout, Sparkles, Loader2, DollarSign, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Event, User as AppUser } from '@/lib/types';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';


const categoryIcons: { [key: string]: React.ReactElement } = {
    cleanup: <Recycle className="h-5 w-5" />,
    gardening: <Sprout className="h-5 w-5" />,
    recycling: <Recycle className="h-5 w-5" />,
    awareness: <Leaf className="h-5 w-5" />,
    workshop: <Sparkles className="h-5 w-5" />,
};

const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    const icon = Object.keys(categoryIcons).find(key => lowerCategory.includes(key));
    return icon ? React.cloneElement(categoryIcons[icon], { className: "h-5 w-5 text-primary" }) : <Leaf className="h-5 w-5 text-primary" />;
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [event, setEvent] = React.useState<Event | null>(null);
  const [organizer, setOrganizer] = React.useState<AppUser | null>(null);
  const [participants, setParticipants] = React.useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isJoining, setIsJoining] = React.useState(false);

  const fetchEventData = React.useCallback(async (eventId: string) => {
      setIsLoading(true);
      try {
        const eventDocRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(eventDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const eventData = {
            id: docSnap.id,
            ...data,
            date: data.date.toDate(),
            endDate: data.endDate.toDate(),
          } as Event;
          setEvent(eventData);

          // Fetch organizer
          if (eventData.createdBy) {
            const organizerDocRef = doc(db, 'users', eventData.createdBy);
            const organizerDocSnap = await getDoc(organizerDocRef);
            if (organizerDocSnap.exists()) {
                const organizerData = organizerDocSnap.data() as Omit<AppUser, 'id'>;
                setOrganizer({ id: organizerDocSnap.id, ...organizerData });
            }
          }
          
          // Fetch participants
          if (eventData.participants && eventData.participants.length > 0) {
              const participantPromises = eventData.participants.map(pid => getDoc(doc(db, 'users', pid)));
              const participantDocs = await Promise.all(participantPromises);
              const participantData = participantDocs
                .filter(pSnap => pSnap.exists())
                .map(pSnap => {
                    const pData = pSnap.data() as Omit<AppUser, 'id'>;
                    return { id: pSnap.id, ...pData } as AppUser;
                });
              setParticipants(participantData);
          } else {
              setParticipants([]);
          }

        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    }, []);


  React.useEffect(() => {
    if(params.id) {
        fetchEventData(params.id);
    }
  }, [params.id, fetchEventData]);
  
  const handleJoinLeave = async () => {
    if (!event || !authUser) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to join or leave an event.',
      });
      router.push('/login');
      return;
    }
    setIsJoining(true);

    const eventDocRef = doc(db, 'events', event.id);
    const hasJoined = event.participants.includes(authUser.uid);
    
    try {
        if (hasJoined) {
            await updateDoc(eventDocRef, {
                participants: arrayRemove(authUser.uid)
            });
            toast({
                title: "Successfully left",
                description: `You have left the event: ${event.title}`,
            });
        } else {
             await updateDoc(eventDocRef, {
                participants: arrayUnion(authUser.uid)
            });
            toast({
                title: "Successfully joined!",
                description: `You have joined the event: ${event.title}`,
            });
        }
        
        await fetchEventData(event.id);

    } catch (error: any) {
         toast({
            variant: 'destructive',
            title: `Error ${hasJoined ? 'leaving' : 'joining'} event`,
            description: `There was an issue. Please try again. ${error.message}`,
        });
    } finally {
        setIsJoining(false);
    }
  }

  const hasJoined = event && authUser ? event.participants.includes(authUser.uid) : false;
  
  if (isLoading) {
    return (
        <div className="container mx-auto py-12">
             <div className="mb-8">
                <Skeleton className="h-10 w-40" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <Skeleton className="w-full h-72 md:h-96 rounded-t-lg" />
                        <CardHeader>
                            <Skeleton className="h-10 w-3/4" />
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-5 w-full" />
                             <Skeleton className="h-5 w-full mt-2" />
                             <Skeleton className="h-5 w-2/3 mt-2" />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-1/2"/>
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-1/2"/>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!event) {
    return notFound();
  }

  return (
    <div className="bg-primary/5">
        <div className="container mx-auto py-12">
        <div className="mb-8">
            <Button asChild variant="ghost">
            <Link href="/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Events
            </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card className="overflow-hidden">
                    <div className="relative w-full h-72 md:h-96">
                        <Image
                            src={event.beforePhotos[0]}
                            alt={event.title}
                            fill
                            className="object-cover"
                            data-ai-hint="event photo"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="font-headline text-4xl text-primary">{event.title}</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <h2 className="font-headline text-2xl mb-4">About this Initiative</h2>
                        <p className="text-lg text-foreground/80">{event.description}</p>
                    </CardContent>
                </Card>

                {(event.impact.plasticCollectedKg || event.impact.treesPlanted) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Our Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-lg">
                                {event.impact.plasticCollectedKg && <li className="flex items-center gap-3"><Recycle className="text-primary h-6 w-6"/><span>Collected <span className="font-bold">{event.impact.plasticCollectedKg}kg</span> of plastic.</span></li>}
                                {event.impact.treesPlanted && <li className="flex items-center gap-3"><Sprout className="text-primary h-6 w-6"/><span>Planted <span className="font-bold">{event.impact.treesPlanted}</span> trees.</span></li>}
                            </ul>
                        </CardContent>
                    </Card>
                )}
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <Users/>
                            Participants ({participants.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {participants.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {participants.map((p) => (
                                    <Link key={p.id} href={`/profile/${p.id}`} className="flex items-center gap-2 hover:bg-muted p-2 rounded-md transition-colors">
                                        <Avatar title={p.name}>
                                            <AvatarImage src={p.profileImage} alt={p.name} />
                                            <AvatarFallback>{p.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span>{p.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ): (
                            <p className="text-muted-foreground">Be the first to join this initiative!</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8 lg:sticky lg:top-24 h-fit">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-start gap-4">
                            {getCategoryIcon(event.category)}
                            <div>
                                <h3 className="font-semibold">Category</h3>
                                <p className="text-muted-foreground capitalize">{event.category}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-semibold">Date</h3>
                                <p className="text-muted-foreground">{format(event.date, 'PPP')}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-semibold">Time</h3>
                                <p className="text-muted-foreground">{format(event.date, 'p')} - {format(event.endDate, 'p')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-semibold">Location</h3>
                                <p className="text-muted-foreground">{event.address}, {getCountryName(event.country)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <DollarSign className="h-5 w-5 text-primary" />
                            <div>
                                <h3 className="font-semibold">Cost</h3>
                                <p className="text-muted-foreground">{event.cost === 0 ? 'Free' : `$${event.cost}`}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {organizer && <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Organizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Link href={`/profile/${organizer.id}`} className="flex items-center gap-4 hover:bg-muted p-2 rounded-md transition-colors -m-2">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={organizer.profileImage} alt={organizer.name} />
                                <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-xl">{organizer.name}</p>
                                <p className="text-muted-foreground">Community Leader</p>
                            </div>
                        </Link>
                    </CardContent>
                </Card>}
                 <Button 
                    size="lg" 
                    className="w-full text-lg py-6" 
                    onClick={handleJoinLeave} 
                    disabled={isJoining || (authUser && event.createdBy === authUser.uid)}
                    variant={hasJoined ? "outline" : "default"}
                    >
                    {isJoining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {authUser && event.createdBy === authUser.uid 
                        ? 'You are the organizer' 
                        : hasJoined 
                        ? (isJoining ? 'Leaving...' : 'Leave Initiative')
                        : (isJoining ? 'Joining...' : 'Join this Initiative')}
                </Button>
            </div>
        </div>
        </div>
    </div>
  );
}

    