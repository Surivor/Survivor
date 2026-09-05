"use client";

type Props = {
    isFeatured: boolean;
    isAnimating: boolean;
    isLoading: boolean;
    onToggle: () => void;
};

export default function HeartButton({ isFeatured, isAnimating, isLoading, onToggle }: Props) {
    return (
        <button
            onClick={onToggle}
            disabled={isLoading}
            className={`
                group relative flex items-center justify-center p-2 rounded-full 
                outline-none transition-colors
                ${isLoading ? "cursor-default" : "cursor-pointer hover:bg-zinc-100 active:bg-zinc-200"}
            `}
            aria-label={isFeatured ? "Retirer des coups de cœur" : "Ajouter aux coups de cœur"}
            title={isFeatured ? "Retirer des coups de cœur" : "Ajouter aux coups de cœur"}
        >
            <div className="relative flex items-center justify-center">
                <svg
                    viewBox="0 0 24 24"
                    className={`
                        w-7 h-7 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
                        ${isFeatured ? "text-red-500 scale-110" : "text-zinc-400 scale-100 group-hover:text-zinc-500"}
                        ${isAnimating ? "scale-[1.3]" : ""}
                    `}
                    style={{
                        filter: isFeatured ? "drop-shadow(0px 2px 6px rgba(239, 68, 68, 0.4))" : "none",
                    }}
                    fill={isFeatured ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={isFeatured ? "0" : "2"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                
                {/* Pop animation ring effect */}
                {isAnimating && (
                    <div 
                        className="absolute inset-0 rounded-full bg-red-400/40 animate-ping" 
                        style={{ animationDuration: '450ms', animationIterationCount: 1 }} 
                    />
                )}
            </div>
        </button>
    );
}
