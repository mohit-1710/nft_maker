'use client';

import AppBar from './components/AppBar';
import HeroSection from './components/HeroSection';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <HeroSection />
        </main>
    );
}
