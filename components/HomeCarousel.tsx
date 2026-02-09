"use client";

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface HomeCarouselProps {
	images: string[];
}

export function HomeCarousel({ images }: HomeCarouselProps) {
	if (!images || images.length === 0) return null;

	return (
		<Carousel
			className="w-full h-full"
			opts={{
				align: "start",
				loop: true,
			}}
			plugins={[
				Autoplay({
					delay: 4000,
				}),
			]}>
			<CarouselContent className="h-full">
				{images.map((imageUrl, index) => (
					<CarouselItem key={index} className="h-full">
						<div className="aspect-[4/5] bg-gray-100 overflow-hidden border border-primary/10 relative">
							<Image
								src={imageUrl}
								alt={`Slide ${index + 1}`}
								fill
								priority={index === 0}
								className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:scale-105 transition-all duration-700"
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>

			{/* Navigation Buttons */}
			<CarouselPrevious className="absolute -bottom-12 left-0 bg-foreground text-white hover:bg-primary transition-all" />
			<CarouselNext className="absolute -bottom-12 right-0 bg-foreground text-white hover:bg-primary transition-all" />
		</Carousel>
	);
}
