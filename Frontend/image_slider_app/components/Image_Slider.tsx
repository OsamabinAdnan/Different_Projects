'use client'

import { useCallback, useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import Spline from '@splinetool/react-spline'

// Define the ImageData Interface

interface ImageData {
    id: string;
    urls: {
        thumb:string;
    };
    alt_description:string;
    description:string;
    user: {
        name:string
    }
}

export default function ImageSlider() {
    // State to manage the images fetched from the API
    const [images, setImages] = useState<ImageData[]>([]);
    // State to manage the current image index in the carousel
    const[currentIndex, setCurrentIndex] =useState<number>(0);
    // State to manage the play/pause status of the carousel
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    // State to track if we're on the client side to prevent hydration errors
    const [isClient, setIsClient] = useState<boolean>(false);

    // Interval for the carousel autoplay
    const interval = 3000; 

    // Function to fetch images from Unsplash API
    const fetchImages = async () => {
        try {

            // Check if the API key is available
            const apiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
            if (!apiKey || apiKey.trim() === '') {
                console.error('Unsplash API key is missing. Please set NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in your environment variables.');

                // Provide sample data for demonstration
                const sampleImages = [
                    {
                        id: 'sample1',
                        urls: { thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                        alt_description: 'Mountain Landscape',
                        description: 'Beautiful mountain landscape',
                        user: { name: 'Unsplash Photographer' }
                    },
                    {
                        id: 'sample2',
                        urls: { thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                        alt_description: 'Forest Path',
                        description: 'Peaceful forest path',
                        user: { name: 'Nature Explorer' }
                    },
                    {
                        id: 'sample3',
                        urls: { thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                        alt_description: 'Scenic Nature View',
                        description: 'Scenic nature view',
                        user: { name: 'Landscape Artist' }
                    }
                ];

                setImages(sampleImages);
                return;
            }

            const response = await fetch(
                `https://api.unsplash.com/photos?client_id=${apiKey}&per_page=15`
            )

            if (!response.ok) {
                console.error(`Failed to fetch images: ${response.status} ${response.statusText}`)

                // Still provide sample data on API failure
                const sampleImages = [
                    {
                        id: 'api_error1',
                        urls: { thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                        alt_description: 'API Error - Sample Image 1',
                        description: 'Could not load images from Unsplash API',
                        user: { name: 'API Error' }
                    },
                    {
                        id: 'api_error2',
                        urls: { thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                        alt_description: 'API Error - Sample Image 2',
                        description: 'Could not load images from Unsplash API',
                        user: { name: 'API Error' }
                    }
                ];

                setImages(sampleImages);
                return;
            }

            const data = await response.json()

            // Validate that data is an array before setting state
            if (Array.isArray(data)) {
                setImages(data)
            } else {
                console.error('API did not return an array:', data)

                // Provide sample data when API returns unexpected format
                const sampleImages = [
                    {
                        id: 'format_error1',
                        urls: { thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                        alt_description: 'Format Error - Sample Image 1',
                        description: 'API returned unexpected format',
                        user: { name: 'Format Error' }
                    }
                ];

                setImages(sampleImages);
            }
        }
        catch(error){
            console.error('Error fetching Images:', error)

            // Provide sample data on network/catch errors
            const sampleImages = [
                {
                    id: 'network_error1',
                    urls: { thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                    alt_description: 'Network Error - Sample Image 1',
                    description: 'Could not connect to Unsplash API',
                    user: { name: 'Network Error' }
                },
                {
                    id: 'network_error2',
                    urls: { thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80' },
                    alt_description: 'Network Error - Sample Image 2',
                    description: 'Please check your connection and API key',
                    user: { name: 'Network Error' }
                }
            ];

            setImages(sampleImages);
        }
        finally {
            // Cleanup after fetch completes
        }
    };

    // useEffect to fetch images when the component mounts
    useEffect(() => {
        setIsClient(true); // Mark as client-side after mount
        fetchImages();
    }, [])

    // Function to go to the next image
    const nextImage = useCallback(():void => {
        setCurrentIndex((prevIndex) => {
            // Ensure we don't exceed the images length and handle edge cases
            if (images.length === 0) return 0;
            return (prevIndex + 1) % images.length;
        });
    }, [images.length]);

    // useEffect to handle the autoplay functionality
    useEffect(() => {
        if(isPlaying && images.length > 0){
            const id = setInterval(nextImage, interval);
            return () => clearInterval(id);
        }
    }, [isPlaying, nextImage, images.length])

    // Function to toggle play/pause status
    const togglePlayPause = ():void => {
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    }

    // JSX return statement rendering the Image Slider UI
  return (
    <>
    <div className=" relative flex items-center justify-center min-h-screen bg-gray-50 z-999">
        <div className="w-full max-w-2xl sm:mx-auto mx-2">
            <h1 className="text-3xl font-bold text-center mb-4">Image Slider</h1>
            <p className="text-center font-semibold mb-8">
            A simple dynamic image slider/carousel with Unsplash.
            </p>

            <Carousel className="rounded-xl overflow-hidden shadow-lg">
            <CarouselContent>
                {images && Array.isArray(images) && images.length > 0 ? (
                    images.map((image, index) => (
                    <CarouselItem
                        key={image.id}
                        className={index === currentIndex ? "block" : "hidden"}
                    >
                        <div className="relative w-full h-[400px] bg-white/30 backdrop-blur-lg flex items-center justify-center ">
                        <Image
                            src={image.urls?.thumb || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"}
                            alt={image.alt_description || "Unsplash image"}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 400px"
                            priority={index === 0}
                            unoptimized={image.urls?.thumb?.endsWith('.svg')}
                        />
                        </div>

                        <div className="p-3 bg-white/30 text-center backdrop-blur-lg ">
                            <h2 className="text-lg font-semibold">{image.user?.name || "Unknown Photographer"}</h2>
                            <p className="text-sm text-gray-700">
                                {image.description || image.alt_description || "No description available"}
                            </p>
                        </div>
                    </CarouselItem>
                    ))
                ) : (
                    <CarouselItem>
                        <div className="relative w-full h-[400px] bg-white/30 backdrop-blur-lg flex items-center justify-center">
                            <p className="text-gray-500">Loading images...</p>
                        </div>
                    </CarouselItem>
                )}
            </CarouselContent>

            <div className=" flex items-center justify-center gap-2 py-2 z-999 bg-white/30 backdrop-blur-lg">
                <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="bg-purple-700/30 backdrop:blur-lg border-white hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 ease-in-out"
                >
                {isPlaying ? (
                    <PauseIcon className="w-6 h-6 text-gray-800" />
                ) : (
                    <PlayIcon className="w-6 h-6 text-gray-800" />
                )}
                <span className="sr-only ">{isPlaying ? "Pause" : "Play"}</span>
                </Button>
            </div>
            </Carousel>
        </div>
        {isClient ? (
            <div className="absolute -z-10 size w-screen h-screen">
                <Spline
                scene="https://prod.spline.design/OMvByUw0AZOHqpBs/scene.splinecode"
                />
            </div>
        ) : (
            <div className="absolute -z-10 size w-screen h-screen">
                {/* Placeholder div to prevent hydration mismatch */}
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
            </div>
        )}
        
    </div>

    </>
  )
}
