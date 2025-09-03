
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { PlusCircle, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

async function getEvents() {
    try {
        const eventsCollection = collection(db, 'events');
        const q = query(eventsCollection, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: data.date?.toDate ? data.date.toDate() : new Date(),
                endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date(),
            } as Event;
        });
        return eventsData;
    } catch (error) {
        console.error("Error fetching events: ", error);
        return [];
    }
}


const EventCard = ({ event }: { event: Event }) => {
    const imageUrl = (Array.isArray(event.beforePhotos) && event.beforePhotos.length > 0 && event.beforePhotos[0]) 
        ? event.beforePhotos[0] 
        : `https://picsum.photos/seed/${event.id}/400/300`;

    return (
       <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative h-48 w-full">
                <Image
                    src={imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    data-ai-hint="event photo"
                />
                 <div className="absolute top-2 right-2">
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {event.cost === 0 ? 'FREE' : `$${event.cost}`}
                    </div>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="font-headline text-xl line-clamp-2">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow flex flex-col">
                <p className="text-sm text-foreground/80 line-clamp-3 flex-grow">
                    {event.description}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(event.date as Date, 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.address}</span>
                    </div>
                </div>
                <Button asChild variant="outline" className="w-full mt-auto">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
            </CardContent>
        </Card>
    );
};


export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold font-headline">
                    Sustainability Events
                </h1>
                <Button asChild className="bg-accent hover:bg-accent/90">
                    <Link href="/create-event">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Event
                    </Link>
                </Button>
            </div>

            {!events ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 6}).map((_, i) => (
                        <Skeleton key={i} className="w-full h-96 rounded-lg" />
                    ))}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-xl font-semibold">No events found</p>
                <p className="text-muted-foreground">
                    Why not be the first to create a new event?
                </p>
                <Button asChild variant="outline" className="mt-4">
                        <Link href="/create-event">Create Event</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
