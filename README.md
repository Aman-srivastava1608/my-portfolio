# My Developer Portfolio

This portfolio is built with Next.js App Router and includes an OpenAI-powered chatbot that answers as Aman Kumar.

## Folder Structure

```text
my-portfolio/
├─ app/
│  ├─ api/
│  │  ├─ chat/route.js
│  │  ├─ contact/route.js
│  │  └─ data/route.js
│  ├─ components/
│  │  └─ homepage/
│  │     └─ chatbot/index.jsx
│  ├─ css/
│  ├─ layout.js
│  └─ page.js
├─ public/
├─ utils/
│  └─ data/
│     ├─ chatbot-data.js
│     ├─ personal-data.js
│     ├─ projects-data.js
│     └─ skills.js
├─ .env.example
└─ package.json
```

## Chatbot Setup

1. Install dependencies:

```bash
npm install
```

2. Create or update `my-portfolio/.env.local` with your keys:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
EMAIL_ADDRESS=your_email_address
GMAIL_PASSKEY=your_gmail_app_password
NEXT_PUBLIC_GTM=
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000` and scroll to the `AI Chatbot` section.

## How It Works

- `app/components/homepage/chatbot/index.jsx` renders the chatbot UI.
- The frontend sends chat messages to `app/api/chat/route.js` using the Fetch API.
- `app/api/chat/route.js` calls the OpenAI Responses API with portfolio-aware instructions.
- The chatbot replies in a short, professional, friendly tone as Aman Kumar.

## Notes

- The chatbot uses your existing portfolio data for personal info and projects.
- If `OPENAI_API_KEY` is missing, the chat route returns a clear configuration error.
- Suggested questions, loading state, error handling, and a typing animation are included.
