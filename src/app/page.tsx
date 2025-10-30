'use client';

import AppBar from './components/AppBar';
import HeroSection from './components/HeroSection';

export default function Home() {
    return (
        <main className="min-h-screen bg-black relative">
            <AppBar />
            <HeroSection />
        </main>
    );
}
