import { Locale } from "@/i18n.config";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcherWrapper } from "@/components/theme-switcher-wrapper";
import { LanguageSwitcher } from "@/components/language-switcher";
import SimpleNavigation from "@/components/simple-navigation";
import { MobileMenu } from "@/components/mobile-menu";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
}

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  let messages;
  try {
    messages = (await import(`../../messages/${locale}/common.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    // Fallback to default messages
    messages = (await import(`../../messages/de/common.json`)).default;
  }

  return (
    <html 
      lang={locale} 
      dir={locale === 'ar' ? 'rtl' : 'ltr'} 
      className={geistSans.className} 
      suppressHydrationWarning
    >
      <body className="bg-white dark:bg-gray-900 text-[hsl(var(--deenly-text-primary))]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <div className="w-full fixed top-0 z-40 flex justify-center pt-4 px-4 sm:px-0">
                  <div className="max-w-[800px] w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-full border border-foreground/10 shadow-sm">
                    <nav className="w-full bg-transparent rounded-full flex items-center">
                      <div className="w-full h-16 flex justify-between items-center p-3 px-5 text-sm">
                        <div className="flex gap-5 items-center font-semibold">
                          <Link href={`/${locale}`} className="flex items-center gap-2">
                            <Image src="/logo.svg" alt="Deenly Logo" width={32} height={32} />
                            <span className="text-xl font-bold text-[hsl(var(--deenly-text-primary))]">Deenly</span>
                          </Link>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-3">
                          <Link href="https://link.deenly.io/WiFdfX" className="bg-[hsl(var(--deenly-primary-button))] text-white hover:bg-[hsl(var(--deenly-primary-button)/90%)] rounded-full text-sm font-medium px-4 py-2 shadow-sm">
                            {messages.navigation["download-app"]}
                          </Link>
                          <LanguageSwitcher />
                          <ThemeSwitcherWrapper />
                          <SimpleNavigation />
                        </div>
                        
                        {/* Mobile Navigation */}
                        <div className="md:hidden">
                          <MobileMenu 
                            locale={locale}
                            messages={messages}
                          />
                        </div>
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="flex flex-col gap-20 w-full md:pt-24">
                  {children}
                </div>

                <footer className="w-full flex items-center justify-center border-t border-[hsl(var(--deenly-background-secondary))/30%] mx-auto text-center text-xs gap-8 py-16 bg-[hsl(var(--deenly-background))/10%]">
                  <div className="flex flex-col items-center gap-2">
                    <Image src="/logo.svg" alt="Deenly Logo" width={40} height={40} />
                    <p className="text-[hsl(var(--deenly-text-primary))]">
                      {messages.footer.madeBy}{" "}
                      <a
                        href="https://el-ali.de"
                        target="_blank"
                        className="font-bold text-[hsl(var(--deenly-text-secondary))] hover:underline"
                        rel="noreferrer"
                      >
                        HalalMedia LLC
                      </a>
                    </p>
                  </div>
                </footer>
              </div>
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
