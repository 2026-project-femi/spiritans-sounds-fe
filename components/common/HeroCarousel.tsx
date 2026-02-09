"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselSlide {
    image: { asset: { url: string } };
    title: string;
    description: string;
    ctaText?: string;
    ctaLink?: string;
}

interface HeroCarouselProps {
    slides: CarouselSlide[];
    interval?: number; // Time in ms for auto-advance
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (slides.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
            }, interval);
            return () => clearInterval(timer);
        }
    }, [slides, interval]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    if (!slides || slides.length === 0) {
        return null; // Or render a fallback for no slides
    }

    const currentSlide = slides[currentIndex];

    return (
        <div className="relative w-full h-[80vh] overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={index} // Using index as key is generally discouraged but acceptable for static lists
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <Image
                        src={slide.image.asset.url}
                        alt={slide.title}
                        fill
                        priority={index === currentIndex} // Only prioritize current slide
                        className="object-cover brightness-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4 bg-black bg-opacity-40">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow">
                                {slide.description}
                            </p>
                            {slide.ctaText && slide.ctaLink && (
                                <Link
                                    href={slide.ctaLink}
                                    className="inline-block rounded-full bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    {slide.ctaText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {slides.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full bg-white ${
                                    index === currentIndex ? "bg-opacity-100" : "bg-opacity-50"
                                } hover:bg-opacity-75 transition-all`}
                            ></button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroCarousel;