# Aman Kumar Portfolio

A custom Next.js portfolio with a portrait-led midnight and violet visual system, self-hosted Manrope typography, responsive layouts, Framer Motion animations, project filtering, project detail dialogs, and a floating portfolio assistant.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. If that port is occupied, use `npm run dev -- --port 3002`.

For production, run `npm run build` followed by `npm run start`.

## Customize

- `app/components/premium-portfolio.jsx`: page sections, interactions, and project details.
- `app/components/cinematic-hero.jsx`: staggered heading entrance, spring portrait tilt, magnetic links, and floating accents.
- `app/css/elevated.scss`: the current visual direction and self-hosted typography.
- `app/css/premium.scss`: shared responsive layout and component foundations.
- `utils/data/personal-data.js`: profile, social links, contact details, and resume.
- `utils/data/projects-data.js`: project summaries, tools, and live/source links.
- `utils/data/experience.js` and `educations.js`: career and education.
- `public/profile.png` and `public/resume/Aman_Kumar_CV.pdf`: portrait and CV.

The AAA Fitness entry uses a real screenshot from the local project. Other gallery artwork is labeled as interface concepts. Website and app development availability is shown in the hero, enquiry section, and assistant context.

## Contact and assistant setup

Configure `.env.local` without committing secrets:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
EMAIL_ADDRESS=your_email_address
GMAIL_PASSKEY=your_gmail_app_password
NEXT_PUBLIC_GTM=
```

The assistant opens from the bottom-right button and uses `/api/chat`. The contact form uses `/api/contact`. Both display loading states and failures without falsely reporting success. Actual delivery and AI responses depend on valid service credentials.

Framer Motion powers section reveals, layout transitions during project filtering, spring-based interactions, scroll progress, and dialog/chat entrance and exit transitions. `MotionConfig` respects the device reduced-motion preference. The interface includes keyboard navigation, a skip link, project dialog focus management, native form validation, and reduced-motion support. Page content remains visible when JavaScript is unavailable.
