import { ImpactCharts } from '@/components/impact/impact-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockUsers } from '@/lib/mock-data';
import { Leaf, Recycle, Sprout, Star, Users } from 'lucide-react';

export default function ImpactPage() {
  const currentUser = mockUsers[0];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold font-headline mb-8">Impact Dashboard</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-headline mb-4">Your Personal Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">EcoPoints</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentUser.ecoPoints}</div>
              <p className="text-xs text-muted-foreground">+20% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentUser.badges.length}</div>
              <p className="text-xs text-muted-foreground">
                {currentUser.badges.join(', ')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Next Badge Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold mb-2">Community Builder</p>
              <Progress value={60} />
              <p className="text-xs text-muted-foreground mt-1">
                Attend 2 more events
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-headline mb-4">Community Contributions</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Trees Planted</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10,832</div>
              <p className="text-xs text-muted-foreground">Across all countries</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Waste Recycled (kg)</CardTitle>
              <Recycle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,214 kg</div>
               <p className="text-xs text-muted-foreground">+300kg this week</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,500+</div>
              <p className="text-xs text-muted-foreground">Making a difference daily</p>
            </CardContent>
          </Card>
        </div>
        <ImpactCharts />
      </section>
    </div>
  );
}
