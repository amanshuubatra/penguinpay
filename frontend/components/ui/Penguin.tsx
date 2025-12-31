import React from 'react';

type PenguinMood = 'happy' | 'waving' | 'sleeping' | 'working' | 'confused';

interface PenguinProps {
    mood?: PenguinMood;
    className?: string;
    size?: number;
}

export const Penguin = ({ mood = 'happy', className = '', size = 100 }: PenguinProps) => {
    // Basic shared styles
    const bodyColor = "#111827"; // gray-900
    const bellyColor = "#F3F4F6"; // gray-100
    const beakColor = "#F59E0B"; // amber-500
    const blushColor = "#FCA5A5"; // red-300

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Base Body - Egg shape */}
            <ellipse cx="100" cy="110" rx="70" ry="80" fill={bodyColor} />

            {/* White Belly */}
            <ellipse cx="100" cy="125" rx="45" ry="55" fill={bellyColor} />

            {/* Eyes */}
            {mood === 'sleeping' ? (
                <>
                    <path d="M75 90 Q85 90 95 90" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <path d="M105 90 Q115 90 125 90" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <text x="140" y="80" fontSize="24" fill="white">zZ</text>
                </>
            ) : mood === 'confused' ? (
                <>
                    <circle cx="85" cy="90" r="5" fill="white" />
                    <circle cx="115" cy="85" r="7" fill="white" />
                </>
            ) : (
                <>
                    <circle cx="85" cy="90" r="6" fill="white" />
                    <circle cx="115" cy="90" r="6" fill="white" />
                </>
            )}

            {/* Beak */}
            <path d="M90 100 L110 100 L100 115 Z" fill={beakColor} />

            {/* Wings */}
            {mood === 'waving' ? (
                <>
                    {/* Left Wing Down */}
                    <path d="M40 110 Q20 130 40 150" fill={bodyColor} />
                    {/* Right Wing Waving Up */}
                    <path d="M160 110 Q190 70 155 70" fill={bodyColor} stroke="white" strokeWidth="2">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 160 110"
                            to="20 160 110"
                            dur="0.5s"
                            repeatCount="indefinite"
                            additive="sum"
                            values="0 160 110; 20 160 110; 0 160 110"
                        />
                    </path>
                </>
            ) : mood === 'working' ? (
                <>
                    <path d="M35 120 Q15 140 35 160" fill={bodyColor} />
                    <path d="M165 120 Q185 140 165 160" fill={bodyColor} />
                    {/* Laptop */}
                    <rect x="60" y="140" width="80" height="50" rx="4" fill="#3B82F6" />
                    <path d="M50 190 L150 190 L160 200 L40 200 Z" fill="#1F2937" />
                </>
            ) : (
                <>
                    <path d="M35 110 Q15 130 35 150" fill={bodyColor} />
                    <path d="M165 110 Q185 130 165 150" fill={bodyColor} />
                </>
            )}

            {/* Feet */}
            <path d="M70 185 Q80 185 90 195" stroke={beakColor} strokeWidth="8" strokeLinecap="round" />
            <path d="M130 185 Q120 185 110 195" stroke={beakColor} strokeWidth="8" strokeLinecap="round" />

            {/* Blush */}
            {(mood === 'happy' || mood === 'waving') && (
                <>
                    <circle cx="70" cy="105" r="5" fill={blushColor} opacity="0.6" />
                    <circle cx="130" cy="105" r="5" fill={blushColor} opacity="0.6" />
                </>
            )}
        </svg>
    );
};
