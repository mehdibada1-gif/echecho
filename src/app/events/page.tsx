
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import { PlusCircle, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const EventCard = ({ event }: { event: Event }) => {
    const imageUrl = (Array.isArray(event.beforePhotos) && event.beforePhotos.length > 0 && event.beforePhotos[0]) 
        ? event.beforePhotos[0] 
        : `https://picsum.photos/seed/${event.id}/400/300`;

    return (
        <Card className="w-full h-full flex flex-col">
            <div className="relative h-48 w-full">
                <Image
                    src={imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover rounded-t-lg"
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(event.date as Date, 'PPP')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.address}</span>
                </div>
                <Button asChild variant="outline" className="w-full mt-2">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
            </CardContent>
        </Card>
    );
};


export default function EventsPage() {
    const [events, setEvents] = React.useState<Event[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const eventsCollection = collection(db, 'events');
                const q = query(eventsCollection, orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const eventsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date && data.date instanceof Timestamp ? data.date.toDate() : new Date(),
                        endDate: data.endDate && data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(),
                    } as Event;
                });
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);


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

       {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
             <Card key={i} className="flex flex-col">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="p-4 space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full mt-4" />
                </div>
            </Card>
          ))}
        </div>
      ) : events.length > 0 ? (
        <Carousel 
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-2">
                {events.map((event) => (
                    <CarouselItem key={event.id} className="pl-4">
                        <div className="p-1 h-full">
                            <EventCard event={event} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
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
