'use client'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { useState } from 'react';
import { Music, Headphones, PlayCircle } from 'lucide-react';
import './globals.css'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white">
      <Head>
        <title>Music Bot</title>
        <meta name="description" content="Get personalized music recommendations" />
      </Head>
      
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Music Bot</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <SignedOut>
                  <a href="/sign-in" className="text-gray-300 hover:bg-white/20 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</a>
                  <a href="/sign-up" className="bg-purple-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-600">Sign Up</a>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <SignedOut>
                <a href="/sign-in" className="text-gray-300 hover:bg-white/20 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</a>
                <a href="/sign-up" className="bg-purple-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-purple-600">Sign Up</a>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
            Welcome to Our Music Recommendation Bot!
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            We recommend songs based on your favorite songs and artists. We can also generate playlists for you using your preferences. Log in now to get started!
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <SignedIn>
              <a href="/recs" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10">
                Get Recommendations
              </a>
            </SignedIn>
            <SignedOut>
              <a href="/sign-in" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10">
                Log In to Get Started
              </a>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-purple-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              Discover New Music Easily
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <Music className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium">Easy Input</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Simply input your favorite songs and artists. It's as easy as 1, 2, 3 with our intuitive interface.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <Headphones className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium">Get Song Recommendations</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Our AI intelligently analyzes your preferences and recommends personalized songs.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                  <PlayCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium">Make a Playlist</p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Request our bot to create a custom playlist based on your preferences for endless music exploration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}