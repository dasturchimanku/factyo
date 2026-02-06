import { TopNav } from "@/components/layout/TopNav";
import { LandingHero } from "@/components/marketing/LandingHero";

export default function HomePage() {
    return (
        <div>
            <TopNav />
            <main className="mx-auto w-full max-w-6xl px-4 py-10">
                <LandingHero />
                <footer className="mt-10 border-t border-white/10 py-8 text-center text-xs text-neutral-500">
                    © {new Date().getFullYear()} Factyo — Get paid faster.
                    Stress less.
                </footer>
            </main>
        </div>
    );
}
