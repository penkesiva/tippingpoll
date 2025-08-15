# TippingPoll - Real-Time Tipping Awareness Site

A dynamic tipping awareness website that captures real voting data per state using Supabase and Vercel.

## 🚀 Features

- **Real-Time Voting**: Capture actual user votes by state
- **Interactive US Map**: Visual representation of voting patterns across states
- **Dynamic Polls**: 50+ tipping-related questions
- **Real Database**: Supabase PostgreSQL backend
- **Vercel Deployment**: Fast, scalable hosting

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Vercel API Routes
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Real-time**: Supabase real-time subscriptions

## 📋 Prerequisites

- [Supabase](https://supabase.com) account
- [Vercel](https://vercel.com) account
- Node.js 16+ installed

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note your project URL and anon key

### 2. Run Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create tables and initial data

### 3. Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🚀 Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to connect to your Vercel account
```

### 3. Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the same environment variables from `.env.local`

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use Vercel dev
vercel dev
```

### API Endpoints

- `GET /api/poll-results` - Get current poll results
- `POST /api/vote` - Submit a vote

## 📊 Database Schema

### Tables

- **`polls`** - Poll questions and metadata
- **`state_votes`** - Vote counts per state per poll
- **`user_votes`** - Individual user vote records

### Key Features

- Real-time vote tracking by state
- User analytics and IP tracking
- Automatic vote counting and percentages
- Support for multiple polls

## 🎯 How It Works

1. **User Votes**: Users click Yes/No/Depends buttons
2. **State Detection**: System determines user's state (currently defaults to CA)
3. **Database Update**: Vote is recorded in Supabase with state information
4. **Real-time Updates**: Map colors update based on actual vote data
5. **Analytics**: Track voting patterns across different states

## 🔮 Future Enhancements

- **IP Geolocation**: Automatically detect user's state
- **State Selection**: Allow users to manually select their state
- **Real-time Updates**: WebSocket connections for live updates
- **Advanced Analytics**: Detailed voting insights and trends
- **Multiple Polls**: Support for different tipping scenarios

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure `.env.local` is properly configured
2. **Supabase Connection**: Verify your project URL and anon key
3. **CORS Issues**: Check Supabase RLS policies
4. **API Errors**: Check Vercel function logs

### Debug Mode

Enable console logging by checking the browser console for detailed error messages.

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.
