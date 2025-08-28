
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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image as ImageIcon, FileText, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CreateArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authUser) {
      toast({
        variant: 'destructive',
        title: 'Not authenticated',
        description: 'You must be logged in to create an article.',
      });
      return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const articleData = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      image: formData.get('imageUrl') as string || `https://picsum.photos/seed/${new Date().getTime()}/400/300`,
      category: formData.get('category') as string,
      author: authUser.displayName || 'Anonymous',
      createdBy: authUser.uid,
      date: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'blogs'), articleData);
      toast({
        title: 'Article Published!',
        description: 'Your new article has been published successfully.',
      });
      router.push('/dashboard');
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Publishing Error',
        description: `Failed to publish article: ${error.message}`,
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (authLoading || !authUser) {
    return (
      <div className="container py-8 mx-auto">
        <Skeleton className="h-screen w-full" />
      </div>
    );
  }

  return (
    <div className="container py-8 mx-auto">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center">
            <FileText className="mr-3" /> Write a New Article
          </CardTitle>
          <CardDescription>
            Share your knowledge and insights with the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 10 Simple Ways to Reduce Your Carbon Footprint"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt / Short Summary</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="A brief summary to capture the reader's attention."
                required
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your full article content here. You can use Markdown for formatting."
                required
                rows={12}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL</Label>
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
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="relative">
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Lifestyle, Community"
                    required
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
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
                {isSubmitting ? 'Publishing...' : 'Publish Article'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
