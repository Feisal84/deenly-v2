"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchStatistics } from "@/app/actions";

interface StatProps {
  value: number;
  label: string;
  delay?: number;
}

const StatItem = ({ value, label, delay = 0 }: StatProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center p-6 bg-[hsl(var(--deenly-background))]/10% dark:bg-[hsl(var(--deenly-text-primary))]/10% rounded-xl transition-all duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <span className="text-4xl md:text-5xl font-bold text-white">
        {value.toLocaleString()}
      </span>
      <span className="text-[hsl(var(--deenly-background))] dark:text-[hsl(var(--deenly-text))] mt-2 text-lg font-medium">{label}</span>
    </motion.div>
  );
};

export default function StatsSection() {
  const t = useTranslations("app.stats");
  
  // Standardwerte, die angezeigt werden, während die Daten geladen werden
  const [stats, setStats] = useState({
    mosques: 0,
    lectures: 0,
    views: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStatistics() {
      try {
        const data = await fetchStatistics();
        setStats({
          mosques: data.mosques,
          lectures: data.lectures,
          views: data.views
        });
      } catch (error) {
        console.error("Fehler beim Laden der Statistiken:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStatistics();
  }, []);
  
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="bg-[hsl(var(--deenly-text-primary))] dark:bg-[hsl(var(--deenly-background-secondary))] rounded-3xl shadow-xl p-8 md:p-12 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[hsl(var(--deenly-background))] dark:text-[hsl(var(--deenly-text-primary))]">
            {t("title")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
            {isLoading ? (
              // Lade-Animation oder Platzhalter
              <>
                <div className="h-24 w-full animate-pulse bg-[hsl(var(--deenly-background))]/30% dark:bg-[hsl(var(--deenly-text-primary))]/30% rounded-lg"></div>
                <div className="h-24 w-full animate-pulse bg-[hsl(var(--deenly-background))]/30% dark:bg-[hsl(var(--deenly-text-primary))]/30% rounded-lg"></div>
                <div className="h-24 w-full animate-pulse bg-[hsl(var(--deenly-background))]/30% dark:bg-[hsl(var(--deenly-text-primary))]/30% rounded-lg"></div>
              </>
            ) : (
              <>
                <StatItem value={stats.mosques} label={t("mosques")} delay={0.1} />
                <StatItem value={stats.lectures} label={t("khutbas")} delay={0.3} />
                <StatItem value={stats.views} label={t("views")} delay={0.5} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
