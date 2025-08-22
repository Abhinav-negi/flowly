export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="max-w-[80%] mx-auto py-24 min-h-[90vh] flex flex-col justify-center"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        How It Works
      </h2>
      <p className="text-center text-base md:text-lg text-[#7C706A] max-w-2xl mx-auto mb-16">
        Getting started is simple. Just follow these three easy steps and you’ll be
        ready to meet new people in no time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
        
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#E05265]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-10 h-10"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Create Your Profile</h3>
          <p className="mt-3 text-sm text-[#7C706A] font-extralight">
            Set up your profile and verify your account to get started.
          </p>
          <p className="mt-2 text-sm text-[#7C706A] font-extralight">
            Add a few details about yourself so others can get to know you better.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#E05265]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-10 h-10"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Apply for a Date</h3>
          <p className="mt-3 text-sm text-[#7C706A] font-extralight">
            Join the queue and wait for your turn to connect.
          </p>
          <p className="mt-2 text-sm text-[#7C706A] font-extralight">
            We&apos;ll notify you as soon as it’s your chance to meet someone new.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#E05265]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-10 h-10"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="7" r="4" />
              <circle cx="17" cy="7" r="4" />
              <path d="M2 21v-2a4 4 0 0 1 4-4h4" />
              <path d="M22 21v-2a4 4 0 0 0-4-4h-4" />
            </svg>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Find Your Match</h3>
          <p className="mt-3 text-sm text-[#7C706A] font-extralight">
            Meet people who match your vibe and start your journey.
          </p>
          <p className="mt-2 text-sm text-[#7C706A] font-extralight">
            Whether it&apos;s friendship or something more, the choice is yours.
          </p>
        </div>
      </div>
    </section>
  );
}
