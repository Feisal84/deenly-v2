"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Image from "next/image";
import Link from "next/link";
import BackgroundCanvas from "./animations/background-canvas";

export default function EnhancedHero() {
  const t = useTranslations();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[hsl(var(--deenly-background))] to-[hsl(var(--deenly-background-secondary))/30%] min-h-screen flex items-center pb-8">
      {/* Interaktiver Canvas-Hintergrund */}
      <BackgroundCanvas 
        color="#4ade80"
        speed={0.015}
        minBlur={70}
        maxBlur={150}
        minRadius={200}
        maxRadius={300}
        opacity={0.35}
      />
      
      {/* Dekorative Elemente */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[hsl(var(--deenly-background-teal))/20%] blur-3xl" />
        <div className="absolute top-[60%] -left-[5%] w-[30%] h-[40%] rounded-full bg-[hsl(var(--deenly-background-teal))/20%] blur-3xl" />
      </div>
      
      <div className="container mx-auto relative z-10 pt-[120px] md:pt-[0px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Badge variant="outline" className="px-4 py-1 text-sm bg-[hsl(var(--deenly-background-teal))/10%] text-[hsl(var(--deenly-text-primary))]">
                  {t('app.badge')}
                </Badge>
              </motion.div>
              
              <motion.h1
                className="text-4xl md:text-6xl font-bold tracking-tight text-[hsl(var(--deenly-text-primary))]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {t('app.title')}
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-[hsl(var(--deenly-text-secondary))]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {t('app.description')}
              </motion.p>
            </div>
            
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link href="/moscheen">
                <Button size="lg" className="rounded-full bg-[hsl(var(--deenly-primary-button))] hover:bg-[hsl(var(--deenly-primary-button)/90%)] text-white">
                  {t('app.ctaButton')}
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Badge className="px-3 py-1 border-0 bg-gray-100 dark:bg-gray-800 text-[hsl(var(--deenly-text-primary))]">{t('hero.badges.fridaySermons')}</Badge>
              <Badge className="px-3 py-1 border-0 bg-gray-100 dark:bg-gray-800 text-[hsl(var(--deenly-text-primary))]">{t('hero.badges.mosqueSearch')}</Badge>
              <Badge className="px-3 py-1 border-0 bg-gray-100 dark:bg-gray-800 text-[hsl(var(--deenly-text-primary))]">{t('hero.badges.prayerTimes')}</Badge>
              <Badge className="px-3 py-1 border-0 bg-gray-100 dark:bg-gray-800 text-[hsl(var(--deenly-text-primary))]">{t('hero.badges.imamGPT')}</Badge>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="relative h-[400px] md:h-[500px] lg:h-[80vh] rounded-xl overflow-hidden flex justify-center mt-8 sm:mt-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="relative h-full w-[60%] md:w-[45%] max-w-[300px]">
              <Image 
                src="/images/hero.webp?v=6" 
                alt={t('hero.altText')}
                fill
                className="object-contain object-center"
                priority
              />
            </div>
            {/* Dekorativer Smartphone-Rahmen */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--deenly-background-teal))/5%] to-[hsl(var(--deenly-background-teal))/10%] pointer-events-none"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
