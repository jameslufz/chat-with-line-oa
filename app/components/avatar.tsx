type AvatarProps = {
    displayName: string;
    seed: string;
    size?: "sm" | "md";
};

function Avatar({ displayName, seed, size = "md" }: AvatarProps) {
    const sizeClass = size === "sm" ? ("h-9 w-9 text-xs") : ("h-10 w-10 text-sm");
    return (
        <div
            className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full font-semibold text-white ${getAvatarColor(seed)}`}
        >
            {getInitials(displayName)}
        </div>
    );
}

export default Avatar

const AVATAR_COLORS = [
    "bg-emerald-500",
    "bg-sky-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-teal-500",
];

function getAvatarColor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(displayName: string): string {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
}