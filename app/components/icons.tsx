export function SendIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22l-4-9-9-4 20-7z" />
        </svg>
    );
}

export function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

export function ChatEmptyIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-12 w-12"
            aria-hidden="true"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}

export function LoadingIcon({ width, height }:{ width?: string; height?: string; }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            width={width || 200}
            height={height || 200}
            style={{ shapeRendering: "auto", display: "block" }}
        >
            <g>
                <circle cx="84" cy="50" r="10" fill="#b3dcff">
                    <animate attributeName="r" repeatCount="indefinite" dur="0.5952380952380952s" calcMode="spline" keyTimes="0;1" values="10;0" keySplines="0 0.5 0.5 1" begin="0s"/>
                    <animate attributeName="fill" repeatCount="indefinite" dur="2.380952380952381s" calcMode="discrete" keyTimes="0;0.25;0.5;0.75;1" values="#b3dcff;#b3dcff;#00ad45;#5ecc62;#b3dcff" begin="0s"/>
                </circle>
                    <circle cx="16" cy="50" r="10" fill="#b3dcff">
                        <animate attributeName="r" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"/>
                        <animate attributeName="cx" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="0s"/>
                    </circle>
                    <circle cx="50" cy="50" r="10" fill="#5ecc62">
                        <animate attributeName="r" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5952380952380952s"/>
                        <animate attributeName="cx" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-0.5952380952380952s"/>
                    </circle>
                    <circle cx="84" cy="50" r="10" fill="#00ad45">
                        <animate attributeName="r" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.1904761904761905s"/>
                        <animate attributeName="cx" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.1904761904761905s"/>
                    </circle>
                    <circle cx="16" cy="50" r="10" fill="#b3dcff">
                        <animate attributeName="r" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="0;0;10;10;10" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.7857142857142856s"/>
                        <animate attributeName="cx" repeatCount="indefinite" dur="2.380952380952381s" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1" values="16;16;16;50;84" keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1" begin="-1.7857142857142856s"/>
                    </circle>
                <g/>
            </g>
        </svg>
)
}