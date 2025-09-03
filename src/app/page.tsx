
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calendar, Leaf, MapPin, Recycle, Sprout, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { mockBlogs } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, Timestamp } from 'firebase/firestore';
import type { Event } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';


async function getRecentEvents() {
  try {
    const eventsCollection = collection(db, 'events');
    const q = query(
      eventsCollection,
      orderBy('date', 'desc'), 
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    const allRecentEvents = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date && data.date instanceof Timestamp ? data.date.toDate() : new Date(),
        endDate: data.endDate && data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(),
      } as Event;
    });

    const upcomingEvents = allRecentEvents
      .filter(event => (event.date as Date) >= new Date())
      .sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime())
      .slice(0, 5); 

    return upcomingEvents;
  } catch (error) {
    console.error("Error fetching recent events: ", error);
    return [];
  }
}

async function getImpactStats() {
  try {
    const [usersSnapshot, eventsSnapshot] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'events')),
    ]);

    const events = eventsSnapshot.docs.map(doc => doc.data() as Event);
    const totalParticipants = events.reduce((sum, event) => sum + (event.participants?.length || 0), 0);

    return {
      totalUsers: usersSnapshot.size,
      totalEvents: eventsSnapshot.size,
      totalParticipants,
    };
  } catch (error) {
    console.error("Error fetching impact stats:", error);
    return {
      totalUsers: 0,
      totalEvents: 0,
      totalParticipants: 0,
    };
  }
}


export default async function Home() {

  const recentEvents = await getRecentEvents();
  const impactStats = await getImpactStats();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12">
        <div className="container px-4">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2 text-center">
               <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfQgj-XqK3O-BJlAoAitUf7b3XWx4cuA9rNA&s"
                  width="600"
                  height="400"
                  alt="Hero"
                  data-ai-hint="green environment"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline text-primary mt-4">
                EcoEcho: Amplify Your Impact
              </h1>
              <p className="max-w-[600px] mx-auto text-foreground/80 md:text-xl">
                Explore eco-initiatives, from clean-ups to urban gardening.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                <Link href="/events">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Upcoming Events
              </h2>
              <p className="max-w-[900px] text-foreground/80">
                Find an event near you and contribute to a greener planet.
              </p>
            </div>
          </div>
          {recentEvents.length > 0 ? (
             <div className="mx-auto max-w-5xl py-12">
                <Carousel 
                    opts={{
                        align: "start",
                        loop: recentEvents.length > 1,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {recentEvents.map((event) => (
                            <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                               <Card className="flex flex-col h-full">
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={Array.isArray(event.beforePhotos) && event.beforePhotos.length > 0 ? event.beforePhotos[0] : `https://picsum.photos/seed/${event.id}/400/300`}
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
                                        <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
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
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
             </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg font-semibold">No upcoming events found.</p>
              <p className="text-muted-foreground">Check back soon or create a new event!</p>
            </div>
          )}
        </div>
      </section>
      
      <section className="w-full py-12 md:py-16">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Our Collective Impact
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/80">
              Every action counts. See what our community has achieved together.
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl">
            <div className="grid grid-cols-2 gap-4">
              <Card className="flex flex-col items-center justify-center p-4">
                <Users className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{impactStats.totalUsers}</p>
                <p className="text-xs text-foreground/70 text-center">Users</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{impactStats.totalEvents}</p>
                <p className="text-xs text-foreground/70 text-center">Events</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4">
                <Sprout className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold">{impactStats.totalParticipants}</p>
                <p className="text-xs text-foreground/70 text-center">Participants</p>
              </Card>
              <Link href="/signup">
                <Card className="flex flex-col items-center justify-center p-4 bg-accent text-accent-foreground h-full hover:bg-accent/90 transition-colors">
                  <Leaf className="h-8 w-8 mb-2" />
                  <p className="text-2xl font-bold">Ready?</p>
                  <p className="text-xs text-center">Join Now!</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                Learn & Take Action
              </h2>
              <p className="max-w-[900px] text-foreground/80">
                Access quick guides, resources, and tips to live more sustainably.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2">
            {mockBlogs.slice(0,2).map((post) => (
              <Card key={post.id} className="flex flex-col overflow-hidden">
                 <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint="blog photo"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{post.category}</Badge>
                  <CardTitle className="font-headline text-xl mt-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <Button asChild variant="link" className="p-0 h-auto self-start mt-4">
                    <Link href={`/blog/${post.id}`}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
           <div className="text-sm text-muted-foreground text-center">
              <p>
                Funded by the European Union. Views and opinions expressed are
                however those of the author(s) only and do not necessarily
                reflect those of the European Union or the European Education
                and Culture Executive Agency (EACEA). Neither the European
                Union nor EACEA can be held responsible for them.
              </p>
               <Image
                src="https://dare4.masterpeace.org/wp-content/uploads/sites/19/2024/03/EN-Co-Funded-by-the-EU_PANTONE-1536x322.png"
                width={400}
                height={84}
                alt="Co-funded by the European Union"
                className="object-contain mx-auto mt-4"
                data-ai-hint="logo eu"
              />
            </div>
        </div>
      </section>
    </div>
  );
}
