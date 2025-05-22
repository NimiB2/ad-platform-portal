# Ad Portal – Web Dashboard for AdSDK System

## Overview
**Ad Portal** is a React-based web dashboard that allows advertisers to manage ad campaigns and developers to monitor ad performance across the AdSDK ecosystem. It provides an intuitive interface for uploading ads, viewing statistics, and analyzing campaign effectiveness.

The portal serves as the management frontend for the Flask Ad Server backend and complements the Android SDK integration.

---

## Documentation
Full guides and reference material are available at **[Ad Portal Documentation](https://nimib2.github.io/video-ad-portal/)**.

---

## 📱 AdSDK – Watch How It Works

<a href="https://www.kapwing.com/videos/68264cf77eecde027c279537">
  <img src="https://i.imgur.com/BarqWRo.png" alt="AdSDK Demo" width="200"/>
</a>

---

## Features

### Advertiser Portal
- Upload and manage ad campaigns with video and target URLs
- Set budget levels and control ad display settings (skip/exit timers)
- Track performance metrics including views, clicks, and skip rates
- Visualize campaign effectiveness with interactive charts
- Export data for external analysis

### Developer/Admin Tools
- Monitor overall system performance
- View statistics across all advertisers
- Analyze user engagement patterns
- Track daily trends with detailed graphs

### Integration
The Ad Portal connects to both components of the AdSDK ecosystem:
- **[Flask Ad Server](https://nimib2.github.io/video-ad-server/)** - RESTful backend for data storage and processing
- **[Android SDK](https://nimib2.github.io/video-ad-sdk-android/)** - Client library displaying ads in mobile apps

---

## Tech Stack
- **React** - Frontend UI library
- **ApexCharts** - Interactive data visualization
- **Axios** - API communication
- **Material Design** - UI component styling

---

## Quick Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nimib2/Ad-Portal.git
   cd Ad-Portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with:
   ```
   REACT_APP_API_URL=https://ad-server-kappa.vercel.app
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Deploy to Vercel**:
   ```bash
   vercel
   ```

---

## License

MIT License - Copyright © 2025 Nimrod Bar

This study project is created for educational purposes only. Demo content is not for commercial use.

Permission is granted to use, copy, modify, and distribute this software subject to including the above copyright notice and permission notice in all copies.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

[Full license](https://opensource.org/licenses/MIT)

---
