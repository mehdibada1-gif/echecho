'use client';

import * as React from 'react';
import { mockEvents } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES, getCountryName } from '@/data/countries';
import type { Event } from '@/lib/types';
import { List, Map as MapIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const EventMap = dynamic(() => import('@/components/events/event-map'), {
  ssr: false,
});


export default function EventsPage() {
  const [selectedCountry, setSelectedCountry] = React.useState('all');
  const [view, setView] = React.useState('map');

  const filteredEvents =
    selectedCountry === 'all'
      ? mockEvents
      : mockEvents.filter((event) => event.country === selectedCountry);

  const EventCard = ({ event }: { event: Event }) => (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <p className="text-sm font-semibold">
          {format(event.date, 'PPP p')}
        </p>
        <p className="text-sm text-muted-foreground">{event.address}</p>
        <Button variant="outline" size="sm" className="mt-2">
          View Details
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold font-headline">
          Sustainability Events
        </h1>
        <div className="flex items-center gap-4">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="hidden sm:flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('map')}
            >
              <MapIcon className="mr-2 h-4 w-4" />
              Map
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
          </div>
           <Button asChild className="bg-accent hover:bg-accent/90">
             <Link href="/create-event"><PlusCircle className="mr-2 h-4 w-4"/>Create</Link>
           </Button>
        </div>
      </div>
      
      {view === 'map' ? (
        <Card>
          <CardContent className="p-0">
            <div className="h-[600px] w-full">
              <EventMap events={filteredEvents} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
