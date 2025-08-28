import Image from 'next/image';

const galleryImages = [
  { src: 'https://picsum.photos/seed/gallery1/500/400', alt: 'Community gathering for a cleanup event', hint: 'community cleanup' },
  { src: 'https://picsum.photos/seed/gallery2/500/400', alt: 'Volunteers planting trees in a park', hint: 'planting trees' },
  { src: 'https://picsum.photos/seed/gallery3/500/400', alt: 'A child learning about recycling', hint: 'recycling education' },
  { src: 'https://picsum.photos/seed/gallery4/500/400', alt: 'Close-up of hands holding a small sprout', hint: 'sprout hands' },
  { src: 'https://picsum.photos/seed/gallery5/500/400', alt: 'Group photo of happy volunteers after an event', hint: 'happy volunteers' },
  { src: 'https://picsum.photos/seed/gallery6/500/400', alt: 'A clean beach after a successful cleanup drive', hint: 'clean beach' },
];

export function CommunityGallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {galleryImages.map((image, index) => (
        <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <Image
            src={image.src}
            alt={image.alt}
            width={500}
            height={400}
            data-ai-hint={image.hint}
            className="w-full h-full object-cover aspect-[4/3] transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}
