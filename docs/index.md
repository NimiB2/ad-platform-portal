---
layout: default
title: Home
nav_order: 1
---

# Ad Portal Documentation

## Overview

The Ad Portal is the web-based management interface for the AdSDK ecosystem. It allows advertisers to upload and monitor ad campaigns and gives developers insights into system performance.

---

### Project Architecture

The Ad SDK system consists of several interconnected components that work together to deliver ads to mobile applications:

<div align="center">
  <img src="https://raw.githubusercontent.com/NimiB2/Android-SDK-Ads/main/docs/assets/architecture-diagram.jpg"
       alt="Project Architecture Diagram" width="600"/>
</div>

---

## Documentation Sections

- [Getting Started](getting-started.md) - Installation and setup guide
- [User Guide](user-guide.md) - Portal functionality explanation
- [API Integration](api-integration.md) - How the portal connects to the backend
- [Analytics](analytics.md) - Understanding the statistics and charts

## Core Components

The Ad Portal consists of these primary components:

### User Authentication
The portal supports both advertiser and developer access modes, with email-based authentication.

### Campaign Management
Advertisers can create, update, and delete ads with configurable parameters including video URL, target URL, budget level, and skip/exit timers.

### Statistics Dashboard
Interactive charts display view counts, clicks, and skip rates with date range filtering.

### Administrator View
System-wide metrics and all-advertiser analytics for developers.

## Related Documentation

- [Android AdSDK Documentation](https://nimib2.github.io/Android-SDK-Ads/) - Client library for displaying ads
- [Flask Ad Server Documentation](https://nimib2.github.io/Ad-Server/) - Backend API and data processing
