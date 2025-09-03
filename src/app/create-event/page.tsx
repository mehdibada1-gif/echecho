
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { Calendar, MapPin, Loader2, Image as ImageIcon, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [costType, setCostType] = React.useState('free');
  const [cost, setCost] = React.useState(0);
  
  React.useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authUser) {
        toast({ variant: 'destructive', title: 'Not authenticated', description: 'You must be logged in to create an event.'});
        return;
    }
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      country: formData.get('country') as string,
      address: formData.get('address') as string,
      date: formData.get('date') as string,
      endDate: formData.get('endDate') as string,
      cost: costType === 'free' ? 0 : cost,
      beforePhotos: [formData.get('imageUrl') as string || `https://picsum.photos/seed/${new Date().getTime()}/400/300`],
      createdBy: authUser.uid,
      participants: [],
      impact: {},
      afterPhotos: [],
    };
    
    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        date: Timestamp.fromDate(new Date(eventData.date)),
        endDate: Timestamp.fromDate(new Date(eventData.endDate)),
      });
      
      toast({
        title: 'Event Created!',
        description: 'Your new event has been published successfully.',
      });
      router.push('/events');

    } catch (error: any) {
      console.error("Error adding document: ", error);
      toast({
        variant: 'destructive',
        title: 'Submission Error',
        description: `Failed to create event: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading || !authUser) {
    return <div className="container py-8 mx-auto"><Skeleton className="h-screen w-full" /></div>
  }

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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Community Beach Cleanup"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell everyone about your event, what to expect, and what to bring."
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                 <div className="relative">
                    <Input
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        className="pl-10"
                        disabled={isSubmitting}
                    />
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Cleanup, Workshop"
                    required
                    disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  name="country"
                  required
                  disabled={isSubmitting}
                >
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
                  name="address"
                  placeholder="e.g., 123 Green Way, Eco City"
                  required
                  className="pl-10"
                  disabled={isSubmitting}
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Start Date and Time</Label>
                  <div className="relative">
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      required
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="endDate">End Date and Time</Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      required
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
            </div>

            <div className="space-y-2">
              <Label>Cost</Label>
              <RadioGroup
                defaultValue="free"
                className="flex items-center gap-4"
                onValueChange={setCostType}
                disabled={isSubmitting}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="r1" />
                  <Label htmlFor="r1">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="r2" />
                  <Label htmlFor="r2">Paid</Label>
                </div>
              </RadioGroup>
              {costType === 'paid' && (
                <div className="relative pt-2">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="pl-10"
                    min="0"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                size="lg"
                className="bg-accent hover:bg-accent/90"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Publishing...' : 'Publish Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
