"use client"

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

//this is my hero section
const HeroSection = () => {

    //with this ref variable we can manipulate the html of the image div
    const imageRef = useRef(null);

    //when the page renders we want to display all the things
    useEffect(() => {
        const imageElement = imageRef.current;

        if (!imageElement) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if (scrollPosition > scrollThreshold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled"); // Remove when scrolling back up
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll); // Cleanup listener
        };
    }, []);

    
  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
        <div className='space-y-6 text-center'>
            <div className='space-y-6 mx-auto'>
                {/* captions */}
                <h1 className=' text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title'>
                    Your AI Career Coach for
                    <br />
                    Professional Success
                </h1>
                <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>
                    Advance your carrer with personalized guidance,
                    interview prep, and AI-powered tools for job success.
                </p>
            </div>
            <div className='flex justify-center space-x-4'>
                {/* action buttons */}
                <Link href="/dashboard">
                    <Button size="lg" className="px-8">Get Started</Button>
                </Link>
                <Link href="https://www.youtube.com/roadsidecoder">
                    <Button variant="outline" size="lg" className="px-8">Demo Video</Button>
                </Link>
            </div>
            <div className='hero-image-wrapper mt-5 md:mt-0'>
                {/* banner of my page */}
                <div ref={imageRef} className='hero-image'>
                    <Image
                        src={"/banner.jpeg"}
                        width={1280}
                        height={720}
                        alt='Banner Sensei'
                        className='rounded-lg shadow-2xl border mx-auto'
                        priority
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection