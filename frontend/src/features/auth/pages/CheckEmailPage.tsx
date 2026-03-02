import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Card from "../../../shared/ui/Card";
import Button from "../../../shared/ui/Button";

export default function CheckEmailPage() {
    return (
        <AuthLayout
            title="Check your email"
            subtitle="We've sent a verification link to your inbox"
        >
            <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm text-center">
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                        <div className="relative w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                            <Mail className="w-10 h-10 text-indigo-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-white">Verification link sent! 📩</h3>
                        <p className="text-white/60 leading-relaxed">
                            We’ve sent a verification link to your email.
                            Please click the link to activate your account.
                        </p>
                        <p className="text-white/40 text-sm italic">
                            Can't find it? Check your spam folder.
                        </p>
                    </div>

                    <div className="w-full pt-4">
                        <Link to="/login" className="w-full">
                            <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] group">
                                Back to login
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </AuthLayout>
    );
}
