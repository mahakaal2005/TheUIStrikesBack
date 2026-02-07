# Next-Gen AI Healthcare Platform
[![Nexus Health Gateway](https://img.shields.io/badge/Status-Nexus%20Health%20Gateway%20Live-indigo?style=for-the-badge)](http://localhost:3000)

## Overview
This project is a comprehensive, AI-enhanced Electronic Health Record (EHR) and patient portal ecosystem designed to bridge the gap between complex medical data and patient understanding. The platform integrates interactive AI agents, advanced data visualization, and streamlined clinical workflows into a unified, responsive interface.

It leverages the **Tambo AI SDK** to provide intelligent features like symptom explanation, medical guides, and automated clinical reasoning, all wrapped in a modern, mobile-first UI built with Next.js 15 and Tailwind CSS v4.

## Key Features

### AI-Powered Clinical Tools
- **Nexus Health Gateway:** The central intelligence agent that uses natural language to route users (Patient, Doctor, Lab, Pharmacy) to the correct portal based on intent.
- **Living Treatment Timeline:** Visualizes complex patient history, combining vital signs (HR, BP) with medical events for rapid clinical assessment.
- **Symptom Explainer & Medical Guide:** Interactive AI agents that translate medical jargon into patient-friendly advice and step-by-step procedural guides.
- **Medical Image Analysis:** Integrated AI-driven image analysis simulating immediate clinical findings for X-rays and skin conditions.
- **AI Counseling Assistant:** Streamlines pharmacy workflows by automating medication advice generation based on prescriptions.

### Advanced Data Visualization
- **Smart Lab Trends:** Dynamic charts using Recharts to track lab results over time, highlighting critical trends and deviations for early intervention.
- **Interactive Body Map:** A visual interface allowing patients to pinpoint symptom locations intuitively.

### Modern Architecture
- **Unified UI System:** A modular, reusable component library ensuring design consistency across Patient, Doctor, Lab, and Pharmacy portals.
- **Responsive Design:** A fully responsive "mobile-first" experience with seamless animations and transitions using Framer Motion.

## Technology Stack

### Core Frameworks
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Radix UI, Lucide React
- **Animations:** Framer Motion

### AI & Data
- **AI Integration:** Tambo AI SDK (`@tambo-ai/react`, `@tambo-ai/typescript-sdk`)
- **Validation:** Zod
- **Visualization:** Recharts

### Text Editing
- **Rich Text:** TipTap

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/next-gen-healthcare-platform.git
   ```

2. Navigate to the project directory:
   ```bash
   cd my-tambo-app
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up environment variables:
   Create a `.env.local` file in the root directory and add your necessary API keys (e.g., Tambo API key).

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app`: Application routes and pages (Next.js App Router).
- `src/components`: Reusable UI components and feature-specific modules.
- `src/lib`: Utility functions and shared logic.
- `public`: Static assets.

## Contributing

Contributions are welcome. Please ensure that you follow the existing code style and conventions.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

