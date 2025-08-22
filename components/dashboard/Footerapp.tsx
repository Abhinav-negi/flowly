import Image from "next/image";

export default function Footerz() {
  return (
    <footer id="contact" className="bg-white w-full pt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/assets/logo/heart.png"
              alt="Flowly Logo"
              height={40}
              width={40}
            />
            <h1 className="text-[#E05265] font-secondary font-bold text-2xl">
              Flowly
            </h1>
          </div>
          <p className="mt-4 text-sm text-[#7c706a]">
            Connecting hearts through genuine conversations. Personality over looks.
          </p>
        </div>

        {/* Socials + Contact */}
        <div>
          <h2 className="font-bold text-[#E05265] mb-3">Follow Us</h2>
          <div className="flex gap-4 mb-4">
            <a href="#" aria-label="Follow Flowly on Twitter" className="text-[#7c706a]">
              Twitter
            </a>
            <a href="#" aria-label="Follow Flowly on Instagram" className="text-[#7c706a]">
              Instagram
            </a>
          </div>

          <h2 className="font-bold text-[#E05265] mb-2">Contact</h2>
          <p className="text-sm text-[#7c706a]">
            Reach us at:{" "}
            <a
              href="mailto:flowwithflowly@gmail.com"
              className="hover:text-[#E05265] underline"
            >
             flowwithflowly@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="text-center py-4 text-gray-500 text-sm border-t">
        © 2025 Flowly. All rights reserved.
      </div>
    </footer>
  );
}
