import { FeaturedDestinations } from "@/components/home/featured-destinations";
import { HeroSection } from "@/components/home/hero-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { PopularListings } from "@/components/home/popular-listings";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { AIRecommendations } from "@/components/home/ai-recommendations";
import { ChatbotWidget } from "@/components/home/chatbot-widget";

export default function HomePage() {
  return (
    <main className="bg-slate-50">
      <HeroSection />
      <FeaturedDestinations />
      <PopularListings />
      <TestimonialsSection />
      <AIRecommendations />
      <ChatbotWidget />
      <NewsletterSection />
    </main>
  );
}
