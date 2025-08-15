export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-700 text-white p-6">
      <h1 className="text-5xl font-bold mb-4">Flowly</h1>
      <p className="text-lg opacity-90 mb-8">
        Something amazing is coming soon. Stay tuned!
      </p>
      <a
        href="#"
        className="bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
      >
        Notify Me
      </a>
    </main>
  );
}
