```markdown
---
layout: default
title: Getting Started
nav_order: 2
---
# Getting Started with Ad Portal

This guide provides instructions for setting up and using the Ad Portal.

## Prerequisites

- Node.js
- npm
- Git (for cloning the repository)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nimib2/Ad-Portal.git
cd Ad-Portal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root with:

```
REACT_APP_API_URL=https://ad-server-kappa.vercel.app
```

For local backend development, you can point to your local Flask server:

```
REACT_APP_API_URL=http://localhost:1993
```

### 4. Start the Development Server

```bash
npm start
```

This will launch the application on `http://localhost:3000`.

## Production Deployment

### Vercel Deployment

The project includes a `vercel.json` file that configures API proxying:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://ad-server-kappa.vercel.app/:path*" }
  ]
}
```

Deploy to Vercel with:

```bash
vercel
```

## User Accounts

The portal supports two types of users:
- **Advertisers**: Regular users who can manage their own ads
- **Developers**: Admin users who can view statistics across all advertisers

### First Login

When you first visit the portal, you'll be presented with a login screen with options for both regular and developer login.

For testing purposes, you can use:
- Regular login: Any email (will create a new account if it doesn't exist)
- Developer login: "developer@example.com"
```
