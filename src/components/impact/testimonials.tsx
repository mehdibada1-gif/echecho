'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getCountryName } from '@/data/countries';
import { mockTestimonials } from '@/lib/mock-data';
import { Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function Testimonials() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {mockTestimonials.map((testimonial) => (
          <CarouselItem key={testimonial.name} className="md:basis-1/2 lg:basis-1/3">
             <div className="p-1 h-full">
              <Card className="flex flex-col justify-between h-full">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary mb-4" />
                  <p className="text-foreground/80 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
                <div className="bg-primary/5 p-4 flex items-center gap-4 mt-auto">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {getCountryName(testimonial.country)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
