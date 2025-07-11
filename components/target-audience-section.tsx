"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

interface TargetAudienceProps {
  type: "mosques" | "users";
  reverse?: boolean;
}

export default function TargetAudienceSection({ type, reverse = false }: TargetAudienceProps) {
  const t = useTranslations(`app.for${type === "mosques" ? "Mosques" : "Users"}`);
  const tApp = useTranslations("app");
  
  const imagePath = type === "mosques" 
    ? "/images/mosque-interface.png" 
    : "/images/user-interface.png";
    
  const buttonText = type === "mosques" 
    ? tApp("forMosquesButton") 
    : tApp("forUsersButton");
    
  // Erstellen eines Arrays der Vorteile aus den Objektschlüsseln
  const benefitItems = ["item1", "item2", "item3", "item4"];
  
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: reverse ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(var(--deenly-text-primary))]">{t("title")}</h2>
            <p className="text-xl text-[hsl(var(--deenly-text-secondary))]">{t("description")}</p>
            
            <ul className="space-y-3">
              {benefitItems.map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="text-[hsl(var(--deenly-primary-button))] h-6 w-6 mt-0.5 flex-shrink-0" />
                  <span className="text-[hsl(var(--deenly-text-primary))]">{t(`benefits.${item}`)}</span>
                </motion.li>
              ))}
            </ul>
            
            <Button size="lg" className="mt-6 bg-[hsl(var(--deenly-primary-button))] hover:bg-[hsl(var(--deenly-primary-button))/90%] text-white">
              {buttonText}
            </Button>
          </motion.div>
          
          <motion.div
            className="relative h-[400px] rounded-xl overflow-hidden shadow-lg border border-[hsl(var(--deenly-background-secondary))/50%]"
            initial={{ opacity: 0, x: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Placeholder für ein Mockup-Bild - soll später durch ein echtes Bild ersetzt werden */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--deenly-background-secondary))/20%] to-[hsl(var(--deenly-background))/10%] flex items-center justify-center">
              <p className="text-xl text-center px-8 text-[hsl(var(--deenly-text-primary))]">
                {type === "mosques" 
                  ? "Moschee-Administration Interface" 
                  : "Benutzeroberfläche der Deenly-App"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
