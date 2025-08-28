
import { CommunityGallery } from '@/components/impact/gallery';
import { Testimonials } from '@/components/impact/testimonials';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Calendar, FileText, Users } from 'lucide-react';

async function getImpactData() {
  try {
    const [eventsSnapshot, usersSnapshot, articlesSnapshot] = await Promise.all([
      getDocs(collection(db, 'events')),
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'blogs')),
    ]);

    return {
      totalEvents: eventsSnapshot.size,
      totalUsers: usersSnapshot.size,
      totalArticles: articlesSnapshot.size,
    };
  } catch (error) {
    console.error("Error fetching impact data:", error);
    return {
      totalEvents: 0,
      totalUsers: 0,
      totalArticles: 0,
    };
  }
}

export default async function ImpactPage() {
  const { totalEvents, totalUsers, totalArticles } = await getImpactData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold font-headline mb-6">Impact Dashboard</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-headline mb-4">Community Contributions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Initiatives created
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Articles
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticles}</div>
              <p className="text-xs text-muted-foreground">Insights shared</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Making a difference
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 font-headline">Voices of Our Community</h2>
        <div className="px-4">
            <Testimonials />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 font-headline">Gallery of Impact</h2>
        <CommunityGallery />
      </section>
    </div>
  );
}
