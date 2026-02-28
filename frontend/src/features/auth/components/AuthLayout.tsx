import type { ReactNode } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../shared/ui/Button";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-indigo-900/20 to-transparent -z-10 blur-3xl pointer-events-none" />

            {/* Back Button */}
            <div className="absolute top-8 left-8">
                <Link to="/">
                    <Button variant="ghost" className="text-white/60 hover:text-white pl-2 pr-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 mb-6 shadow-lg shadow-indigo-500/20">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>

                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Nexa<span className="text-white/40 font-medium">Talk</span>
                    </h1>

                    <h2 className="text-3xl font-bold text-white tracking-tight pt-4">
                        {title}
                    </h2>
                    <p className="text-white/40 text-sm">
                        {subtitle}
                    </p>
                </div>

                {/* Content/Form */}
                {children}
            </div>
        </div>
    );
}
