export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          🚀 We’re Coming Soon
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-80">
          Our new experience is on the way. Stay tuned for updates.
        </p>
        <div className="flex justify-center">
          <a
            href="#"
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-md hover:shadow-lg transition"
          >
            Notify Me
          </a>
        </div>
      </div>
    </main>
  );
}
