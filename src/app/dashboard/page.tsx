
'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, MapPin, Edit, Eye, Trash2, PlusCircle, FileText, Calendar, Users, Sprout, Building, Globe, FileEdit, MoreHorizontal, Loader2, ImageIcon, Tag, DollarSign, Clock } from 'lucide-react';
import type { Event, User as AppUser, Blog, Organization } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COUNTRIES, getCountryName } from '@/data/countries';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


const EditEventDialog = ({ event, onEventUpdate, children }: { event: Event, onEventUpdate: (event: Event) => void, children: React.ReactNode }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState(event.title);
    const [description, setDescription] = React.useState(event.description);
    const [category, setCategory] = React.useState(event.category);
    const [country, setCountry] = React.useState(event.country);
    const [address, setAddress] = React.useState(event.address);
    const [date, setDate] = React.useState(format(event.date as Date, "yyyy-MM-dd'T'HH:mm"));
    const [endDate, setEndDate] = React.useState(format(event.endDate as Date, "yyyy-MM-dd'T'HH:mm"));
    const [costType, setCostType] = React.useState(event.cost > 0 ? 'paid' : 'free');
    const [cost, setCost] = React.useState(event.cost);
    const [imageUrl, setImageUrl] = React.useState(event.beforePhotos[0]);

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        const updatedEventData = {
            title,
            description,
            category,
            country,
            address,
            date: Timestamp.fromDate(new Date(date)),
            endDate: Timestamp.fromDate(new Date(endDate)),
            cost: costType === 'free' ? 0 : cost,
            beforePhotos: [imageUrl || `https://picsum.photos/seed/${new Date().getTime()}/400/300`],
        };
        try {
            const eventDocRef = doc(db, 'events', event.id);
            await updateDoc(eventDocRef, updatedEventData);
            onEventUpdate({ ...event, ...updatedEventData, date: new Date(date), endDate: new Date(endDate) });
            toast({ title: "Event Updated", description: "Your event has been successfully updated." });
            setIsOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not update your event." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                 <DialogHeader>
                    <DialogTitle>Edit Initiative</DialogTitle>
                    <DialogDescription>Make changes to your event here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                     <div className="space-y-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select value={country} onValueChange={setCountry}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="date">Start Date</Label>
                            <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Cost</Label>
                        <RadioGroup value={costType} onValueChange={setCostType} className="flex items-center gap-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="free" id="r1" /><Label htmlFor="r1">Free</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="paid" id="r2" /><Label htmlFor="r2">Paid</Label></div>
                        </RadioGroup>
                        {costType === 'paid' && (
                            <div className="relative pt-2">
                                <Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} min="0" />
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const EventListItem = ({ event, authUser, onDelete, onUpdate }: { event: Event; authUser: AppUser; onDelete: (id: string, title: string) => void; onUpdate: (event: Event) => void; }) => {
    const isCreator = event.createdBy === authUser.id;
    return (
        <Card className="flex flex-col sm:flex-row items-center gap-4 p-4">
            <Image 
                src={event.beforePhotos[0]} 
                alt={event.title} 
                width={150}
                height={100}
                className="rounded-md object-cover w-full sm:w-36 h-32 sm:h-24"
                data-ai-hint="event photo"
            />
            <div className="flex-grow">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Calendar className="h-4 w-4" />{event.date ? format(event.date as Date, 'PPP') : 'Date not set'}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Users className="h-4 w-4" />{event.participants.length} joined</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center mt-2 sm:mt-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/events/${event.id}`}><Eye className="mr-2 h-4 w-4" />View</Link>
                        </DropdownMenuItem>
                        {isCreator && (
                            <>
                               <EditEventDialog event={event} onEventUpdate={onUpdate}>
                                   <DropdownMenuItem onSelect={(e) => e.preventDefault()}><FileEdit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                </EditEventDialog>
                                <DropdownMenuItem onClick={() => onDelete(event.id, event.title)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                </DropdownMenuItem>
                             </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
};


const EditArticleDialog = ({ article, onArticleUpdate, children }: { article: Blog, onArticleUpdate: (article: Blog) => void, children: React.ReactNode }) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const [title, setTitle] = React.useState(article.title);
    const [excerpt, setExcerpt] = React.useState(article.excerpt);
    const [content, setContent] = React.useState(article.content);
    const [imageUrl, setImageUrl] = React.useState(article.image);
    const [category, setCategory] = React.useState(article.category);
    
    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        const updatedArticleData = { title, excerpt, content, image: imageUrl, category };

        try {
            const articleDocRef = doc(db, 'blogs', article.id);
            await updateDoc(articleDocRef, updatedArticleData);
            onArticleUpdate({ ...article, ...updatedArticleData });
            toast({ title: "Article Updated", description: "Your article has been successfully updated." });
            setIsOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: "Update Failed", description: "Could not update your article." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Article</DialogTitle>
                    <DialogDescription>Make changes to your article here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                    <Button onClick={handleSaveChanges} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const ArticleListItem = ({ article, authUser, onUpdate, onDelete }: { article: Blog; authUser: AppUser; onUpdate: (article: Blog) => void; onDelete: (id: string, title: string) => void; }) => {
    const isCreator = article.createdBy === authUser.id;
    return (
        <Card className="flex flex-col sm:flex-row items-center gap-4 p-4">
            <Image
                src={article.image}
                alt={article.title}
                width={150}
                height={100}
                className="rounded-md object-cover w-full sm:w-36 h-32 sm:h-24"
                data-ai-hint="article photo"
            />
            <div className="flex-grow">
                <h3 className="font-bold text-lg">{article.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Calendar className="h-4 w-4" />{article.date ? format(article.date as Date, 'PPP') : 'Date not set'}</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center mt-2 sm:mt-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                         <DropdownMenuItem asChild>
                           <Link href={`/blog/${article.id}`}><Eye className="mr-2 h-4 w-4" />View</Link>
                        </DropdownMenuItem>
                        {isCreator && (
                            <>
                                <EditArticleDialog article={article} onArticleUpdate={onUpdate}>
                                     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <FileEdit className="mr-2 h-4 w-4" />Edit
                                    </DropdownMenuItem>
                                </EditArticleDialog>
                                <DropdownMenuItem onClick={() => onDelete(article.id, article.title)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />Delete
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
};

const EditProfileDialog = ({ user, onUserUpdate }: { user: AppUser, onUserUpdate: (user: Partial<AppUser>) => void }) => {
    const { toast } = useToast();
    const [name, setName] = React.useState(user.name);
    const [country, setCountry] = React.useState(user.country);
    const [contributions, setContributions] = React.useState(user.contributions);

    const handleSaveChanges = async () => {
        const updatedUserData: Partial<AppUser> = {
            name,
            country,
            contributions,
        };
        
        try {
            const userDocRef = doc(db, 'users', user.id);
            await updateDoc(userDocRef, updatedUserData);
            onUserUpdate(updatedUserData);
            toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Update Failed",
                description: "Could not update your profile.",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="country" className="text-right">
                            Country
                        </Label>
                        <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map((c) => (
                                    <SelectItem key={c.value} value={c.value}>
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contributions" className="text-right">
                            Contributions
                        </Label>
                        <Textarea id="contributions" value={contributions} onChange={(e) => setContributions(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>
                     <DialogClose asChild>
                        <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const OrganizationDialog = ({ organization, userId, onUpdate }: { organization: Organization | null, userId: string, onUpdate: (org: Organization | null) => void}) => {
    const { toast } = useToast();
    const [name, setName] = React.useState(organization?.name || "");
    const [website, setWebsite] = React.useState(organization?.website || "");
    const [description, setDescription] = React.useState(organization?.description || "");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        const orgId = organization?.id || userId;
        const orgData: Omit<Organization, 'id'> = {
            name,
            website,
            description,
            ownerId: userId,
        };

        try {
            const orgDocRef = doc(db, 'organizations', orgId);
            await setDoc(orgDocRef, orgData, { merge: true });
            onUpdate({ id: orgId, ...orgData });
            toast({
                title: organization ? "Organization Updated" : "Organization Created",
                description: "Your organization details have been saved.",
            });
            setIsOpen(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save organization details.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const handleDelete = async () => {
        if (!organization) return;
        try {
            await deleteDoc(doc(db, 'organizations', organization.id));
            onUpdate(null);
            toast({
                title: "Organization Deleted",
                description: "Your organization has been removed.",
            });
            setIsOpen(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Deletion Failed",
                description: "Could not delete organization.",
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    {organization ? 'Edit Organization' : 'Create Organization'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{organization ? 'Edit Organization' : 'Create Organization'}</DialogTitle>
                    <DialogDescription>
                       {organization ? "Update your organization's details." : "Fill in your organization's details."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="org-name" className="text-right">
                            Name
                        </Label>
                        <Input id="org-name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="org-website" className="text-right">
                            Website
                        </Label>
                        <Input id="org-website" value={website} onChange={e => setWebsite(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="org-desc" className="text-right">
                            Description
                        </Label>
                        <Textarea id="org-desc" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter className="sm:justify-between">
                     {organization && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete your organization.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <div className="flex gap-2 justify-end">
                       <DialogClose asChild>
                           <Button type="button" variant="secondary">Cancel</Button>
                       </DialogClose>
                       <Button type="submit" onClick={handleSaveChanges} disabled={isSubmitting}>
                           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                           Save changes
                       </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function DashboardPage() {
    const { user: authUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [user, setUser] = React.useState<AppUser | null>(null);
    const [organization, setOrganization] = React.useState<Organization | null>(null);
    const [createdEvents, setCreatedEvents] = React.useState<Event[]>([]);
    const [joinedEvents, setJoinedEvents] = React.useState<Event[]>([]);
    const [userArticles, setUserArticles] = React.useState<Blog[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = React.useCallback(async (uid: string) => {
        setIsLoading(true);
        try {
            // Fetch User
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                setUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
            } else {
                if (authUser) {
                    const newUser: Omit<AppUser, 'id'> = {
                        name: authUser.displayName || 'New User',
                        email: authUser.email || '',
                        role: 'citizen',
                        country: '',
                        ecoPoints: 0,
                        badges: [],
                        profileImage: authUser.photoURL || `https://picsum.photos/seed/${authUser.uid}/100/100`,
                        contributions: '',
                        ecoProfileDescription: '',
                    };
                    await setDoc(doc(db, 'users', authUser.uid), newUser);
                    setUser({ id: authUser.uid, ...newUser });
                }
            }


            // Fetch Organization
            const orgsQuery = query(collection(db, 'organizations'), where('ownerId', '==', uid));
            const orgsSnapshot = await getDocs(orgsQuery);
            if (!orgsSnapshot.empty) {
                const orgDocSnapshot = orgsSnapshot.docs[0];
                setOrganization({ id: orgDocSnapshot.id, ...orgDocSnapshot.data() } as Organization);
            } else {
               setOrganization(null);
            }
            
            // Fetch Created Events
            const createdEventsQuery = query(collection(db, 'events'), where('createdBy', '==', uid));
            const createdEventsSnapshot = await getDocs(createdEventsQuery);
            setCreatedEvents(createdEventsSnapshot.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id, 
                    ...data, 
                    date: data.date?.toDate ? data.date.toDate() : new Date(), 
                    endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date() 
                } as Event
            }));

            // Fetch Joined Events
            const joinedEventsQuery = query(collection(db, 'events'), where('participants', 'array-contains', uid));
            const joinedEventsSnapshot = await getDocs(joinedEventsQuery);
            setJoinedEvents(joinedEventsSnapshot.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id, 
                    ...data, 
                    date: data.date?.toDate ? data.date.toDate() : new Date(), 
                    endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date() 
                } as Event
            }));

            // Fetch User Articles
            const articlesQuery = query(collection(db, 'blogs'), where('createdBy', '==', uid));
            const articlesSnapshot = await getDocs(articlesQuery);
            setUserArticles(articlesSnapshot.docs.map(d => {
                const data = d.data();
                return { id: d.id, ...data, date: data.date?.toDate ? data.date.toDate() : new Date() } as Blog
            }));

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load dashboard data.' });
        } finally {
            setIsLoading(false);
        }
    }, [toast, authUser]);

    React.useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/login');
        } else if (authUser) {
            fetchData(authUser.uid);
        }
    }, [authUser, authLoading, router, fetchData]);

    const handleUserUpdate = (updatedData: Partial<AppUser>) => {
        if (user) {
            setUser({ ...user, ...updatedData });
        }
    };
    
    const handleEventDelete = async (id: string, title: string) => {
        try {
            await deleteDoc(doc(db, 'events', id));
            setCreatedEvents(prev => prev.filter(e => e.id !== id));
            toast({
                title: "Event Deleted",
                description: `The event "${title}" has been deleted.`
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Deletion Failed",
                description: "Could not delete the event."
            });
        }
    };
  
    const handleEventUpdate = (updatedEvent: Event) => {
        setCreatedEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    };

    const handleArticleUpdate = (updatedArticle: Blog) => {
        setUserArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    };

    const handleArticleDelete = async (id: string, title: string) => {
        try {
            await deleteDoc(doc(db, 'blogs', id));
            setUserArticles(prev => prev.filter(a => a.id !== id));
            toast({
                title: "Article Deleted",
                description: `Article "${title}" has been deleted.`
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Deletion Failed",
                description: "Could not delete the article."
            });
        }
    }
    
    const handleOrgUpdate = (org: Organization | null) => {
        setOrganization(org);
    }

    if (authLoading || isLoading || !user || !authUser) {
        return <div className="container mx-auto p-4"><Skeleton className="h-screen w-full" /></div>;
    }

    return (
    <div className="container mx-auto p-4 space-y-8">
      
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
                  <CardDescription>Your personal profile.</CardDescription>
              </div>
              <EditProfileDialog user={user} onUserUpdate={handleUserUpdate}/>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                      <p className="flex items-center text-muted-foreground"><Mail className="mr-2 h-4 w-4" />{user.email}</p>
                      <p className="flex items-center text-muted-foreground"><MapPin className="mr-2 h-4 w-4" />{getCountryName(user.country)}</p>
                  </div>
              </div>
               <div>
                  <h3 className="font-semibold text-lg mb-2">Eco-Profile Description</h3>
                  <p className="text-muted-foreground italic text-sm">
                      {user.ecoProfileDescription || "No description available. You can add one by editing your profile!"}
                  </p>
              </div>
              <div>
                  <h3 className="font-semibold text-lg mb-2">Contributions</h3>
                  <p className="text-muted-foreground text-sm">{user.contributions || "No contributions listed yet."}</p>
              </div>
          </CardContent>
      </Card>
      
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
                 <CardTitle className="text-2xl font-headline flex items-center"><Users className="mr-2" />My Events</CardTitle>
                 <CardDescription>Manage your created and joined events.</CardDescription>
             </div>
             <Button asChild size="sm">
                <Link href="/create-event">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Event
                </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
              <div>
                  <h3 className="text-xl font-headline mb-4">Created ({createdEvents.length})</h3>
                   {createdEvents.length > 0 ? (
                      <div className="space-y-4">
                         {createdEvents.map(event => <EventListItem key={event.id} event={event} authUser={user} onDelete={handleEventDelete} onUpdate={handleEventUpdate}/>)}
                      </div>
                  ) : (
                       <div className="text-center py-10 border-2 border-dashed rounded-lg">
                          <Sprout className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-4 font-semibold">You haven't created any events yet.</p>
                          <p className="text-sm text-muted-foreground">Why not start a new initiative?</p>
                      </div>
                  )}
              </div>
               <div>
                  <h3 className="text-xl font-headline mb-4">Joined ({joinedEvents.length})</h3>
                   {joinedEvents.length > 0 ? (
                      <div className="space-y-4">
                         {joinedEvents.map(event => <EventListItem key={event.id} event={event} authUser={user} onDelete={handleEventDelete} onUpdate={handleEventUpdate}/>)}
                      </div>
                  ) : (
                       <div className="text-center py-10 border-2 border-dashed rounded-lg">
                           <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-4 font-semibold">You haven't joined any events.</p>
                          <p className="text-sm text-muted-foreground">Explore events and get involved!</p>
                           <Button asChild variant="outline" className="mt-4" size="sm">
                              <Link href="/events">Explore Events</Link>
                          </Button>
                      </div>
                  )}
              </div>
          </CardContent>
      </Card>

      <Card>
           <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle className="text-2xl font-headline flex items-center"><FileText className="mr-2" />My Articles</CardTitle>
                  <CardDescription>Manage your published articles.</CardDescription>
              </div>
               <Button asChild size="sm">
                  <Link href="/create-article">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Article
                  </Link>
              </Button>
          </CardHeader>
          <CardContent className="space-y-6">
              {userArticles.length > 0 ? (
                  <div className="space-y-4">
                     {userArticles.map(article => <ArticleListItem key={article.id} article={article} authUser={user} onUpdate={handleArticleUpdate} onDelete={() => handleArticleDelete(article.id, article.title)} />)}
                  </div>
              ) : (
                   <div className="text-center py-10 border-2 border-dashed rounded-lg">
                      <FileEdit className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 font-semibold">You haven't written any articles.</p>
                      <p className="text-sm text-muted-foreground">Share your knowledge and inspire!</p>
                  </div>
              )}
          </CardContent>
      </Card>

      <Card>
           <CardHeader className="flex flex-row items-start justify-between">
              <div>
                  <CardTitle className="text-2xl font-headline flex items-center"><Building className="mr-2"/>My Organization</CardTitle>
                  <CardDescription>Manage your organization's details.</CardDescription>
              </div>
               <OrganizationDialog organization={organization} userId={authUser.uid} onUpdate={handleOrgUpdate} />
          </CardHeader>
          <CardContent className="space-y-4">
            {organization ? (
                <>
                    <div>
                        <h3 className="font-semibold text-lg">{organization.name}</h3>
                        <p className="text-muted-foreground text-sm">{organization.description}</p>
                    </div>
                    {organization.website && <div className="flex items-center text-sm text-muted-foreground">
                        <Globe className="mr-2 h-4 w-4" />
                        <a href={organization.website} target="_blank" rel="noreferrer noopener" className="hover:text-primary underline">{organization.website}</a>
                    </div>}
                </>
            ) : (
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold">You haven't set up an organization yet.</p>
                    <p className="text-sm text-muted-foreground">Create one to manage your initiatives.</p>
                </div>
            )}
          </CardContent>
      </Card>
      
    </div>
  );
}
