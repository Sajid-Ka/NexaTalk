import { Calendar } from "lucide-react";

interface RevenueChartProps {
    title: string;
    amount: string;
    variant?: "purple" | "blue";
}

export default function RevenueChart({ title, amount, variant = "purple" }: RevenueChartProps) {
    const isPurple = variant === "purple";
    const strokeColor = isPurple ? "#A855F7" : "#0EA5E9";
    const gradientId = `gradient-${variant}`;

    return (
        <div className="bg-[#151926]/50 border border-white/5 rounded-2xl p-6 flex flex-col h-full hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 block">{title}</span>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{amount}</h2>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                    <Calendar size={20} className="text-gray-400" />
                </div>
            </div>

            <div className="flex-1 min-h-[100px] w-full mt-auto relative">
                <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Background Fill */}
                    <path
                        d={isPurple
                            ? "M 0 80 Q 50 100, 100 80 T 200 60 T 300 80 T 400 70 L 400 100 L 0 100 Z"
                            : "M 0 90 Q 50 85, 100 80 T 200 90 T 300 75 T 400 80 L 400 100 L 0 100 Z"
                        }
                        fill={`url(#${gradientId})`}
                    />

                    {/* Main Line */}
                    <path
                        d={isPurple
                            ? "M 0 80 Q 50 100, 100 80 T 200 60 T 300 80 T 400 70"
                            : "M 0 90 Q 50 85, 100 80 T 200 90 T 300 75 T 400 80"
                        }
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                    />
                </svg>
            </div>
        </div>
    );
}
