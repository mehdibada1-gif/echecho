
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCountryName } from '@/data/countries';
import { Crown, Recycle, Sprout, Star, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { User, Event, Blog } from '@/lib/types';
import Link from 'next/link';

const badges = [
    { icon: <Sprout/>, name: "Tree Planter", description: "Plant 10 trees."},
    { icon: <Recycle/>, name: "Recycling Hero", description: "Participate in 5 recycling drives."},
    { icon: <Trash2/>, name: "Cleanup Crew", description: "Join 3 cleanup events."},
    { icon: <Star/>, name: "Community Star", description: "Organize an event."},
];

type LeaderboardUser = User & {
    calculatedEcoPoints: number;
    eventsCreated: number;
    eventsJoined: number;
    articlesWritten: number;
};


async function getLeaderboardData(): Promise<LeaderboardUser[]> {
    try {
        const [usersSnapshot, eventsSnapshot, articlesSnapshot] = await Promise.all([
            getDocs(collection(db, 'users')),
            getDocs(collection(db, 'events')),
            getDocs(collection(db, 'blogs'))
        ]);

        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        const articles = articlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));

        const leaderboard = users.map(user => {
            const eventsCreated = events.filter(e => e.createdBy === user.id).length;
            const eventsJoined = events.filter(e => e.participants && e.participants.includes(user.id)).length;
            const articlesWritten = articles.filter(a => a.createdBy === user.id).length;

            const calculatedEcoPoints = (eventsCreated * 50) + (articlesWritten * 25) + (eventsJoined * 10);

            return {
                ...user,
                calculatedEcoPoints,
                eventsCreated,
                eventsJoined,
                articlesWritten
            };
        });

        return leaderboard.sort((a, b) => b.calculatedEcoPoints - a.calculatedEcoPoints);

    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return [];
    }
}


export default async function LeaderboardPage() {
    const leaderboardData = await getLeaderboardData();

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold font-headline mb-2">Leaderboard</h1>
        <p className="text-muted-foreground mb-8">
            See who is making the biggest impact in the community!
        </p>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Top Eco-Warriors</CardTitle>
                </CardHeader>
                <CardContent>
                {leaderboardData.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead className="text-right">EcoPoints</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {leaderboardData.map((entry, index) => (
                            <TableRow key={entry.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                                    {index + 1 <= 3 ? <Crown className={`h-5 w-5 ${index + 1 === 1 ? 'text-yellow-500' : index + 1 === 2 ? 'text-slate-400' : 'text-amber-700'}`}/> : index + 1}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/profile/${entry.id}`} className="flex items-center gap-3 hover:underline">
                                        <Avatar>
                                            <AvatarImage src={entry.profileImage} />
                                            <AvatarFallback>
                                            {entry.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{entry.name}</span>
                                    </Link>
                                </TableCell>
                                <TableCell>{getCountryName(entry.country)}</TableCell>
                                <TableCell className="text-right font-bold text-primary">
                                    {entry.calculatedEcoPoints.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-10">
                        <p>No leaderboard data available yet. Be the first to contribute!</p>
                    </div>
                )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Badges</CardTitle>
                    <CardDescription>Earn badges for your contributions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {badges.map(badge => (
                        <div key={badge.name} className="flex items-center gap-4">
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                {badge.icon}
                            </div>
                            <div>
                                <p className="font-semibold">{badge.name}</p>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        </div>
    );
}
