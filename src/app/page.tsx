import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Leaf, Recycle, Sprout, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                  EcoEcho: Amplify Your Impact
                </h1>
                <p className="max-w-[600px] text-foreground/80 md:text-xl">
                  Join a global community dedicated to sustainability. Discover
                  local events, track your contributions, and watch our collective
                  impact grow.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <Link href="/events">
                    Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/create-event">Create an Initiative</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://picsum.photos/1200/800"
              width="1200"
              height="800"
              alt="Hero"
              data-ai-hint="community nature"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Featured Initiatives
              </h2>
              <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Check out some of the impactful events happening worldwide. Get
                inspired and join the movement.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Sprout className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Community Garden</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  Join us in planting a new community garden in Milan. All tools provided.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Recycle className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Recycling Drive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  Help us sort and process recyclables at the Amsterdam city center.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Leaf className="h-8 w-8 text-primary" />
                <CardTitle className="font-headline">Beach Cleanup</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  A massive cleanup effort on the beaches of Tunis. Let's protect our marine life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Our Collective Impact
            </h2>
            <p className="mx-auto max-w-[600px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Every action counts. See what our community has achieved together.
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
              <Card className="flex flex-col items-center justify-center p-6">
                <Sprout className="h-10 w-10 text-primary mb-2" />
                <p className="text-3xl font-bold">10,832</p>
                <p className="text-sm text-foreground/70">Trees Planted</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-6">
                <Recycle className="h-10 w-10 text-primary mb-2" />
                <p className="text-3xl font-bold">5,214 kg</p>
                <p className="text-sm text-foreground/70">Waste Recycled</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-6">
                <Users className="h-10 w-10 text-primary mb-2" />
                <p className="text-3xl font-bold">1,500+</p>
                <p className="text-sm text-foreground/70">Volunteers</p>
              </Card>
              <Card className="flex flex-col items-center justify-center p-6 bg-accent text-accent-foreground">
                <Leaf className="h-10 w-10 mb-2" />
                <p className="text-3xl font-bold">Ready?</p>
                <p className="text-sm">Join Now!</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
