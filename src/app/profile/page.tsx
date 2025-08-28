import { EcoProfileForm } from "@/components/profile/eco-profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCountryName } from "@/data/countries";
import { mockUsers } from "@/lib/mock-data";
import { Leaf, Star } from "lucide-react";

export default function ProfilePage() {
    const user = mockUsers[0];
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-4xl font-bold font-headline">{user.name}</h1>
            <p className="text-muted-foreground text-lg">{getCountryName(user.country)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <EcoProfileForm user={user}/>
        </div>
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="h-5 w-5"/>
                            <span>EcoPoints</span>
                        </div>
                        <span className="font-bold text-lg text-primary">{user.ecoPoints.toLocaleString()}</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Leaf className="h-5 w-5"/>
                            <span>Badges</span>
                        </div>
                        <span className="font-bold text-lg">{user.badges.length}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
