const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DIGITS = "0123456789".split("");

interface AlphabetIndexProps {
  active: string | null;
  onSelect: (char: string) => void;
}

export function AlphabetIndex({ active, onSelect }: AlphabetIndexProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {LETTERS.map((letter) => (
          <LetterButton
            key={letter}
            char={letter}
            isActive={active === letter}
            onClick={() => onSelect(letter)}
            variant="moss"
          />
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {DIGITS.map((digit) => (
          <LetterButton
            key={digit}
            char={digit}
            isActive={active === digit}
            onClick={() => onSelect(digit)}
            variant="ink"
          />
        ))}
      </div>
    </div>
  );
}

interface LetterButtonProps {
  char: string;
  isActive: boolean;
  onClick: () => void;
  variant: "moss" | "ink";
}

function LetterButton({ char, isActive, onClick, variant }: LetterButtonProps) {
  const base =
    variant === "moss"
      ? "bg-moss-700 hover:bg-moss-800"
      : "bg-ink hover:bg-ink/80";

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={[
        "flex h-9 w-9 items-center justify-center rounded font-sans text-sm font-semibold text-ivory-50 transition",
        "focus:outline-none focus:ring-2 focus:ring-moss-500/40",
        isActive ? "ring-2 ring-stamp-500 ring-offset-1 ring-offset-ivory-50" : "",
        base,
      ].join(" ")}
    >
      {char}
    </button>
  );
}