'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { COUNTRIES } from '@/data/countries';
import { Calendar, MapPin } from 'lucide-react';

export default function CreateEventPage() {
  return (
    <div className="container py-8 mx-auto">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Create a New Initiative
          </CardTitle>
          <CardDescription>
            Inspire your community by starting a new eco-friendly event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                placeholder="e.g., Community Beach Cleanup"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell everyone about your event, what to expect, and what to bring."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleanup">Cleanup</SelectItem>
                    <SelectItem value="gardening">Gardening</SelectItem>
                    <SelectItem value="recycling">Recycling</SelectItem>
                    <SelectItem value="awareness">Awareness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address / Location</Label>
              <div className="relative">
                <Input
                  id="address"
                  placeholder="e.g., 123 Green Way, Eco City"
                  required
                  className="pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date and Time</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="datetime-local"
                  required
                  className="pl-10"
                />
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90">
                Publish Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
