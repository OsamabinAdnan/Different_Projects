# Modern Countdown Timer

A beautiful and responsive countdown timer application built with Next.js, designed for tracking events, launches, deadlines, and special occasions. Featuring modern UI elements, smooth animations, and advanced functionality.

## Features

- 🎨 **Modern UI Design**: Sleek glass-morphism cards with gradient backgrounds and animated elements
- ⚡ **Real-time Countdown**: Accurate day, hour, minute, and second tracking
- 📱 **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop devices
- 💾 **Save/Load Functionality**: Store multiple countdowns in browser's local storage
- 🎉 **Celebration Effects**: Confetti animation when countdown reaches zero
- 🔔 **Notification Sound**: Audio alert when countdown completes
- 🌙 **Dark/Light Mode**: Automatic theme switching support
- 🎯 **Visual Feedback**: Pulsing animations when time is running low
- 🛠️ **Customizable Events**: Set custom titles for each countdown

## Tech Stack

- [Next.js 16.1.6](https://nextjs.org) - React framework
- [React 19.2.3](https://reactjs.org) - JavaScript library
- [TypeScript 5+](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Radix UI](https://www.radix-ui.com) - Accessible components
- [Lucide React](https://lucide.dev) - Beautiful icons
- [Canvas Confetti](https://github.com/catdad/canvas-confetti) - Celebration effects

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the countdown timer application.

## Usage

1. **Set an Event**: Enter an event title, target date, and time
2. **Start Countdown**: Click "Start" to begin the countdown
3. **Save Countdown**: Click the save icon to store the countdown in local storage
4. **Load Countdown**: Select from saved countdowns to reload them
5. **Manage**: Use the reset button to clear the current countdown

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx           # Main countdown timer component
├── components/
│   └── ui/               # Reusable UI components
├── lib/
│   └── utils.ts          # Utility functions
├── public/
│   └── hourglass.png     # Application icon
└── README.md
```

## Responsive Design

The application is fully responsive and adapts to different screen sizes:
- Mobile: Single column layout with compact elements
- Tablet: Optimized two-column layout
- Desktop: Full featured multi-panel interface

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Other Platforms

This application can be deployed to any platform that supports Next.js applications, including Netlify, AWS Amplify, and GitHub Pages.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ using Next.js and TypeScript
