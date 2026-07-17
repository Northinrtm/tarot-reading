export function OracleLoader() {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-20 h-20"
          style={{ animation: "oracle-rotate 7s linear infinite" }}
        >
          <defs>
            <radialGradient id="oracle-moon-gradient" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="55%" stopColor="#d8b4fe" />
              <stop offset="100%" stopColor="#7c3aed" />
            </radialGradient>
            <mask id="oracle-moon-mask">
              <rect width="100" height="100" fill="white" />
              <circle cx="63" cy="34" r="32" fill="black" />
            </mask>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="url(#oracle-moon-gradient)"
            mask="url(#oracle-moon-mask)"
          />
        </svg>

        {[
          { top: "6%", left: "72%", size: 6, delay: "0s" },
          { top: "70%", left: "82%", size: 4, delay: "0.6s" },
          { top: "80%", left: "18%", size: 5, delay: "1.1s" },
          { top: "14%", left: "10%", size: 4, delay: "0.3s" },
        ].map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-amber-200"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animation: `oracle-twinkle 1.8s ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <p className="text-violet-300 text-sm italic">Карты раскрывают тайну…</p>
    </div>
  );
}
