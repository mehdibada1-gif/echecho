'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createDescription } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { User } from '@/lib/types';
import * as React from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Generate Description
    </Button>
  );
}

export function EcoProfileForm({ user }: { user: User }) {
  const initialState = { description: user.ecoProfileDescription || null, error: null };
  const [state, dispatch] = useFormState(createDescription, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  
  React.useEffect(() => {
    if (state.description) {
      formRef.current?.reset();
    }
  }, [state.description]);


  return (
    <div className="space-y-6">
      <Card>
        <form action={dispatch} ref={formRef}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              AI Eco-Profile Generator
            </CardTitle>
            <CardDescription>
              Let our AI craft a compelling summary of your environmental contributions.
              Fill out the details below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="userName">Username</Label>
                    <Input id="userName" name="userName" defaultValue={user.name} />
                     {state.fieldErrors?.userName && <p className="text-destructive text-xs">{state.fieldErrors.userName}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ecoPoints">EcoPoints</Label>
                    <Input id="ecoPoints" name="ecoPoints" type="number" defaultValue={user.ecoPoints}/>
                     {state.fieldErrors?.ecoPoints && <p className="text-destructive text-xs">{state.fieldErrors.ecoPoints}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select name="country" defaultValue={user.country}>
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
                 {state.fieldErrors?.country && <p className="text-destructive text-xs">{state.fieldErrors.country}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="badges">Badges (comma-separated)</Label>
                <Input id="badges" name="badges" defaultValue={user.badges.join(', ')}/>
                 {state.fieldErrors?.badges && <p className="text-destructive text-xs">{state.fieldErrors.badges}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="contributions">Contributions Summary</Label>
                <Textarea id="contributions" name="contributions" placeholder="e.g., Organized community cleanups, planted over 50 trees..." defaultValue={user.contributions}/>
                 {state.fieldErrors?.contributions && <p className="text-destructive text-xs">{state.fieldErrors.contributions}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch">
            <SubmitButton />
             {state.error && !state.fieldErrors && (
                <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <p>{state.error}</p>
                </div>
            )}
          </CardFooter>
        </form>
      </Card>
      
      {state.description && (
        <Card className="bg-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><Sparkles className="text-accent"/> Generated Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/90">{state.description}</p>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
