// components/Perks.tsx

export default function Perks() {
  return (
    <div className="max-w-[70%] mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        
        {/* Perk 1 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#E05265]">
            {/* SVG Icon 1 (stroke white) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Authentic Connections</h3>
          <p className="mt-2 text-sm text-[#7C706A] font-light">
            Get to know someone&apos;spersonality before meeting face-to-face
          </p>
        </div>

        {/* Perk 2 */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#E05265]">
            {/* SVG Icon 2 (stroke white) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-8 h-8"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Find Your Match</h3>
          <p className="mt-2 text-sm text-[#7C706A] font-light">
            Meet people in your locality and build meaningful connections.
          </p>
        </div>

{/* Perk 3 */}
<div className="flex flex-col items-center">
  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#E05265]">
    {/* Sparkle SVG with visible small + shapes */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className="w-8 h-8"
    >
      {/* Main star (outlined) */}
      <path
        d="M197.00781,132.74023l-52.16015-19.21777a3.99186,3.99186,0,0,1-2.3711-2.37012L123.25977,58.99219a11.99948,11.99948,0,0,0-22.51954,0L81.52246,111.15234a3.99186,3.99186,0,0,1-2.37012,2.3711L26.99219,132.74023a11.99948,11.99948,0,0,0,0,22.51954l52.16015,19.21777a3.99186,3.99186,0,0,1,2.3711,2.37012l19.21679,52.16015a11.99948,11.99948,0,0,0,22.51954,0l19.21679-52.16015h.001a3.99186,3.99186,0,0,1,2.37012-2.3711l52.16015-19.21679a11.99948,11.99948,0,0,0,0-22.51954Z"
        fill="none"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkles (+ shapes) as solid white */}
      <path d="M148,40a4,4,0,0,1,4-4h20V16a4,4,0,0,1,8,0V36h20a4,4,0,0,1,0,8H180V64a4,4,0,0,1-8,0V44H152A4,4,0,0,1,148,40Z" fill="white"/>
      <path d="M244,88a4,4,0,0,1-4,4H228v12a4,4,0,0,1-8,0V92H208a4,4,0,0,1,0-8h12V72a4,4,0,0,1,8,0V84h12A4,4,0,0,1,244,88Z" fill="white"/>
    </svg>
  </div>
  <h3 className="mt-4 text-lg font-semibold">Exciting Features</h3>
  <p className="mt-2 text-sm text-[#7C706A] font-light">
    Our algorithm pairs you based on shared interests and values
  </p>
</div>

      </div>
    </div>
  );
}
