export const metadata = {
  title: 'Reddit Subreddit Search',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
