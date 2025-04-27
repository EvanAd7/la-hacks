# Brew

Brew is an autonomous cold outreach platform that helps you craft personalized cold outreach messages to potential connections.

## Overview

Brew uses AI to generate highly personalized outreach messages for LinkedIn and email based on your profile information, your objective, and the target person's LinkedIn profile. The application searches for relevant people based on your criteria and context, generates custom messages, and can send them agentically through LinkedIn or Gmail.

## Features

- 🔍 **Linkd Powered Profile Search**: Find relevant professionals based on your search criteria
- 💬 **AI-Powered Message Generation**: Create personalized messages that reference both your background and the recipient's profile
- ✉️ **Direct Outreach**: Send messages agentically through LinkedIn or Gmail
- 👤 **Profile Customization**: Save your profile details to personalize outreach
- 🎯 **Multi-Objective Support**: Create messages for networking, job hunting, informational interviews, and more
- 📊 **Tracking**: Dashboard for monitoring cold outreach initiative, connecting with more people

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: Radix UI, Motion
- **API Integration**: Linkd API, Google Gemini AI
- **Automation**: Browserbase Stagehand for browser automation
- **Authentication**: Google and LinkedIn authentication

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Google Gemini API key
- A Linkd API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/brew.git
   cd brew
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   LINKD_API_KEY=your_linkd_api_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your profile information in the profile settings
2. Enter your outreach objective (e.g., "Looking for coffee chats with software engineers at Google")
3. Review the list of found people
4. Generate personalized messages for each person
5. Edit messages as needed
6. Send agentically via LinkedIn or email

## License

[MIT](LICENSE)

## Acknowledgments

- Powered by [Google Gemini](https://ai.google.dev)
- People search by [Linkd](https://linkd.inc)
- Browser automation powered by [Browserbase Stagehand](https://browserbase.io)
