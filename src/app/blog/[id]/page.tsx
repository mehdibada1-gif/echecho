
import { mockBlogs } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = mockBlogs.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl">
       <div className="mb-8">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <article>
        <header className="mb-8">
          <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden mb-4">
             <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                data-ai-hint="blog photo"
            />
          </div>
          <Badge variant="secondary" className="mb-2">{post.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-muted-foreground text-sm gap-x-4">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
            </div>
             <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(post.date, 'PPP')}</span>
            </div>
          </div>
        </header>

        <div
          className="prose dark:prose-invert max-w-none text-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
