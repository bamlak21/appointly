# Appointly

A modern appointment scheduling application built with Next.js, featuring AI-powered assistance and real-time calendar management. Schedule, manage, and confirm appointments with intelligent AI support for call simulations and automated responses.

## Features

- **Interactive Calendar**: Visual calendar interface for scheduling and viewing appointments
- **AI-Powered Call Simulation**: Simulate appointment confirmation calls with AI responses
- **Real-time Updates**: Live synchronization with Supabase database
- **Appointment Management**: Create, edit, confirm, cancel, and reschedule appointments
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **AI Integration**: OpenRouter API (GPT-3.5-turbo)
- **Calendar**: React Big Calendar
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+
- pnpm package manager
- Supabase account
- OpenRouter API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd appointly
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a table called `appointments` with the following schema:

```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  phone_number TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  color TEXT DEFAULT '#3b82f6'
);
```

### OpenRouter Setup

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Generate an API key from your dashboard
3. Add the key to your environment variables

## Running the Application

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
appointly/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Appointment.tsx
│   ├── AppointmentDetailsModal.tsx
│   ├── AppointmentForm.tsx
│   ├── Calendar.tsx
│   ├── CallModal.tsx
│   ├── Modal.tsx
│   └── Navbar.tsx
├── lib/                   # Utility libraries
│   ├── ai.ts             # AI integration functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
│   └── appointments.ts
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
