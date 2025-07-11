"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import EnhancedHero from "@/components/enhanced-hero";
import FeaturesSection from "@/components/features-section";
import StatsSection from "@/components/stats-section";
import TargetAudienceSection from "@/components/target-audience-section";
import CtaSection from "@/components/cta-section";
import LatestLecturesSection from "@/components/latest-lectures-section";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <EnhancedHero />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Call-to-Action Section */}
      <CtaSection />

      {/* Latest Lectures Section */}
      <LatestLecturesSection />
      
    </div>
  );
}
