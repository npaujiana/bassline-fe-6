# BASSLINE

> The City Never Sleeps, Neither Should You.

BASSLINE is a modern web application that helps users discover locations throughout with an intuitive search interface and interactive maps.

![BASSLINE Logo](/public/images/favicon.ico)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Location Search**: Find places throughout Indonesia with an intuitive search interface
- **Interactive Maps**: View locations on interactive maps using Leaflet and Google Maps integration
- **Responsive Design**: Fully responsive UI that works on desktop and mobile devices
- **Smooth UI**: Modern UI with transitions and loading states
- **Multi-language Support**: Toggle between English and Bahasa Indonesia

## 🛠️ Tech Stack

This project is built with the [T3 Stack](https://create.t3.gg/), which includes:

- **[Next.js](https://nextjs.org)**: React framework for building web applications
- **[React](https://react.dev)**: JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed programming language
- **[Tailwind CSS](https://tailwindcss.com)**: Utility-first CSS framework
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation
- **[Leaflet](https://leafletjs.com/)** & **[React Leaflet](https://react-leaflet.js.org/)**: Open-source JavaScript libraries for interactive maps
- **[@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)**: Google Maps integration for React

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/bassline-fe.git
cd bassline-fe
```

2. Install dependencies:

```bash
npm install
```

### Running the Application

#### Development Mode

Run the application in development mode with hot reloading:

```bash
npm run dev
```

This will start the application in development mode on [http://localhost:3000](http://localhost:3000).

#### Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

#### Other Scripts

- **Type Checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Format Check**: `npm run format:check`
- **Format Write**: `npm run format:write`
- **Preview Production**: `npm run preview`

## 📁 Project Structure

```
bassline-fe/
├── public/            # Static assets
│   └── images/        # Image files
├── src/
│   ├── app/           # Next.js App Router pages and components
│   │   ├── components/# Shared components
│   │   ├── about/     # About page
│   │   ├── map/       # Map page
│   │   └── search/    # Search results page
│   ├── styles/        # Global styles
│   └── env.js         # Environment variables
├── package.json       # Project dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── next.config.js     # Next.js configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## 📖 Usage Guide

1. **Home Page**: Enter a location name in Indonesia in the search bar
2. **Search Results**: View search results and select a location
3. **Map View**: Explore the selected location on an interactive map
4. **Language Toggle**: Switch between English and Bahasa Indonesia using the language toggle button

## 🧑‍💻 Development

### Code Quality

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting issues
npm run format:write
```

### Adding New Features

When adding new features:

1. Create new components in the appropriate directory
2. Follow the existing code style and patterns
3. Add appropriate TypeScript types
4. Test your changes thoroughly

## 🌐 Deployment

This project can be deployed to various platforms:

### Vercel (Recommended)

For the easiest deployment experience, use [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Follow the deployment steps

For more information, see the [Vercel deployment guide](https://create.t3.gg/en/deployment/vercel).

### Other Platforms

The project can also be deployed to:

- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
