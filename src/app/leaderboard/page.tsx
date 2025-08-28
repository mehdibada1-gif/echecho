import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { mockLeaderboard } from '@/lib/mock-data';
import { Crown, Recycle, Sprout, Star, Trash2 } from 'lucide-react';

const badges = [
    { icon: <Sprout/>, name: "Tree Planter", description: "Plant 10 trees."},
    { icon: <Recycle/>, name: "Recycling Hero", description: "Participate in 5 recycling drives."},
    { icon: <Trash2/>, name: "Cleanup Crew", description: "Join 3 cleanup events."},
    { icon: <Star/>, name: "Community Star", description: "Organize an event."},
]

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold font-headline mb-2">Leaderboard</h1>
      <p className="text-muted-foreground mb-8">
        See who is making the biggest impact in the community!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Top Eco-Warriors</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {mockLeaderboard.map((entry) => (
                    <TableRow key={entry.rank}>
                      <TableCell className="font-medium">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                          {entry.rank <= 3 ? <Crown className={`h-5 w-5 ${entry.rank === 1 ? 'text-yellow-500' : entry.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`}/> : entry.rank}
                        </div>
                        </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={entry.user.profileImage} />
                            <AvatarFallback>
                              {entry.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{entry.user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getCountryName(entry.user.country)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {entry.ecoPoints.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
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
    </div>
  );
}
