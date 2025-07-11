// filepath: /Users/aeaevo/projects/deenly-web-v2/components/features-section.tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BookOpen, Landmark, Clock, Globe, Smartphone, Settings } from "lucide-react";
import { useState, useEffect } from "react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureProps) => {
  return (
    <motion.div 
      className="flex flex-row items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-[hsl(var(--deenly-background-secondary))/30%] hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[hsl(var(--deenly-background-secondary))] mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1 text-[hsl(var(--deenly-text-primary))]">{title}</h3>
        <p className="text-[hsl(var(--deenly-text-secondary))]">{description}</p>
      </div>
    </motion.div>
  );
};

export default function FeaturesSection() {
  const t = useTranslations("app.features");
  const ft = useTranslations("featuresSection");
  const [activeTab, setActiveTab] = useState<'ummah' | 'mosque'>('ummah');
  
  // Definiere Bildpfade und Feature-Daten für beide Tabs
  const featureData = {
    ummah: [
      {
        id: 'khutba',
        icon: <BookOpen className="w-6 h-6 text-[hsl(var(--deenly-text-primary))]" />,
        title: ft("ummah.khutba.title"),
        description: ft("ummah.khutba.description")
      },
      {
        id: 'prayerTimes',
        icon: <Clock className="w-6 h-6 text-[hsl(var(--deenly-text-primary))]" />,
        title: ft("ummah.prayerTimes.title"),
        description: ft("ummah.prayerTimes.description")
      },
      {
        id: 'mosqueInfo',
        icon: <Landmark className="w-6 h-6 text-[hsl(var(--deenly-text-primary))]" />,
        title: ft("ummah.mosqueInfo.title"),
        description: ft("ummah.mosqueInfo.description")
      }
    ],
    mosque: [
      {
        id: 'translation',
        icon: <Globe className="w-6 h-6 text-[hsl(var(--deenly-text-primary))]" />,
        title: ft("mosque.translation.title"),
        description: ft("mosque.translation.description")
      },
      {
        id: 'webPresence',
        icon: <Smartphone className="w-6 h-6 text-[hsl(var(--deenly-text-primary))]" />,
        title: ft("mosque.webPresence.title"),
        description: ft("mosque.webPresence.description")
      },
      {
        id: 'management',
        icon: <Settings className="w-6 h-6 text-[hsl(var(--deenly-text-primary))]" />,
        title: ft("mosque.management.title"),
        description: ft("mosque.management.description")
      }
    ]
  };
  
  // Definiere die statischen Bilder für die Tabs
  const tabImages = {
    ummah: '/images/features/ummah-features.webp',
    mosque: '/images/features/mosque-features.webp'
  };
  
  return (
    <section className="py-16 bg-[hsl(var(--deenly-background))/30%]">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          {/* Integrated Tab Navigation */}
          <div className="mt-6 flex justify-center items-center">
            <div className="inline-flex rounded-full bg-[hsl(var(--deenly-background-secondary))/20%] p-1">
              <button
                onClick={() => setActiveTab('ummah')}
                className={`px-6 py-2 rounded-full text-sm transition-all duration-200 ${
                  activeTab === 'ummah'
                    ? 'bg-[hsl(var(--deenly-button-background))] shadow-sm text-white font-medium'
                    : 'text-[hsl(var(--deenly-text-secondary))] hover:text-[hsl(var(--deenly-text-primary))]'
                }`}
              >
                {ft("tabs.ummah")}
              </button>
              <button
                onClick={() => setActiveTab('mosque')}
                className={`px-6 py-2 rounded-full text-sm transition-all duration-200 ${
                  activeTab === 'mosque'
                    ? 'bg-[hsl(var(--deenly-button-background))] shadow-sm text-white font-medium'
                    : 'text-[hsl(var(--deenly-text-secondary))] hover:text-[hsl(var(--deenly-text-primary))]'
                }`}
              >
                {ft("tabs.mosque")}
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Layout with Features and Image */}
        <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
          {/* Left Column: Feature List */}
          <div className="md:w-1/2 space-y-4">
            {featureData[activeTab].map((feature, index) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
          
          {/* Right Column: Feature Image */}
          <div className="md:w-1/2 flex items-center justify-center">
            <motion.div 
              className="w-full aspect-[16/9] relative rounded-lg overflow-hidden"
              key={activeTab} // Ensures animation triggers on tab change
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={tabImages[activeTab]} 
                alt={ft(`altText.${activeTab}`)} 
                className="w-full h-full object-cover rounded-lg"
              />
             
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
              
}
