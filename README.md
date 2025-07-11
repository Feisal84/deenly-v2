# 🕌 Deenly v2 - Islamic Mosque Community Platform

A modern Next.js application for Islamic mosques and communities, featuring multilingual support, lecture management, event scheduling, and prayer times.

## ✨ Features

- **🌍 Multilingual Support**: German, Arabic, English, and Turkish
- **📚 Lecture Management**: Khutbas and Islamic lectures with translations
- **🕌 Mosque Profiles**: Comprehensive mosque information and services
- **📅 Event Management**: Community events and programs
- **🕐 Prayer Times**: Daily prayer schedules for each mosque
- **📱 Responsive Design**: Modern UI with Tailwind CSS
- **🔒 Secure**: Row-level security with Supabase
- **⚡ Performance**: Optimized with Next.js 14
- **🎯 Offline Support**: Fallback data when database is unavailable

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui
- **Internationalization**: next-intl
- **Authentication**: Supabase Auth (ready for future implementation)
- **Language**: TypeScript
- **Error Handling**: Graceful degradation with fallback data

## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/deenly-v2.git
cd deenly-v2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database schema from `database-schema.sql` in your Supabase SQL Editor
3. Get your project URL and anon key from Settings > API

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗃️ Database Schema

The application uses the following main tables:

- **mosques**: Mosque information and settings
- **lectures**: Khutbas and religious content
- **events**: Community events and programs  
- **prayer_times**: Daily prayer schedules

See `database-schema.sql` for the complete schema with sample data.

## 🌐 Supported Languages

- **German (de)**: Primary language
- **Arabic (ar)**: Islamic content
- **English (en)**: International support
- **Turkish (tr)**: Community support

## 📁 Project Structure

```
deenly-v2/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                  # Utility libraries
├── messages/             # Translation files
│   ├── de/
│   ├── ar/
│   ├── en/
│   └── tr/
├── utils/                # Utility functions
│   ├── supabase/        # Supabase client setup
│   └── fallback-data.ts # Offline fallback data
└── public/              # Static assets
```

## 🔧 Key Features

### Error Handling & Resilience
- Automatic fallback to demo data when database is unavailable
- Connection testing and retry mechanisms
- User-friendly error messages in German
- Graceful degradation for offline scenarios

### Internationalization
- Multi-language support with next-intl
- RTL support for Arabic content
- Localized prayer times and dates
- Cultural considerations for Islamic content

### Performance
- Optimized database queries with proper indexing
- Image optimization with Next.js
- Responsive design for all devices
- Server-side rendering for SEO

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP_GUIDE.md)
- [Supabase Error Fix Documentation](./SUPABASE_ERROR_FIX.md)
- [Database Schema](./database-schema.sql)

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- Supabase handles authentication and authorization
- CORS properly configured

## 📞 Support

If you encounter any issues:

1. Check the [troubleshooting guide](./SUPABASE_ERROR_FIX.md)
2. Review the database connection test script
3. Open an issue on GitHub

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Islamic community for inspiration and guidance
- Supabase for excellent backend services
- Next.js team for the amazing framework
- Contributors and testers

---

**Made with ❤️ for the Islamic community** 
