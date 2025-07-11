import type { NextConfig } from "next";
import { locales } from "./i18n.config";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['hhjfykvyzqimqcsvlady.supabase.co']
  }
};

export default withNextIntl(nextConfig);
