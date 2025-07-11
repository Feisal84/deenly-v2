"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CtaSection() {
  const t = useTranslations("app.cta");
  const ct = useTranslations("app.cta.forMosques");
  
  return (
    <section className="py-20 mx-4 md:mx-8 lg:mx-16 bg-[hsl(var(--deenly-primary-button))] rounded-3xl">
      <div className="container mx-auto px-4">
          {/* Moschee Kontakt CTA */}
          <motion.div 
            className="max-w-xl mx-auto text-center md:text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">{ct("title")}</h2>
            <p className="text-xl text-white/90">{ct("description")}</p>
            
            <motion.div 
              className="flex flex-wrap justify-center md:justify-center gap-4 mt-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="mailto:info@deenly.io">
                <Button size="lg" className="rounded-full px-8 py-3 bg-transparent hover:bg-white/10 text-white border border-white">
                  {ct("contactButton")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
      </div>
    </section>
  );
}
