import './globals.css';

export const metadata = {
  title: 'VoiceAI Assistant',
  description: 'Your AI Conversation Partner',
  icons: {
    icon: 'https://storage.googleapis.com/msgsndr/JBLl8rdfV29DRcGjQ7Rl/media/67f65c4ecafd9f8d70fe2309.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}