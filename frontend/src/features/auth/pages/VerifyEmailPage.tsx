import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Card from "../../../shared/ui/Card";
import Button from "../../../shared/ui/Button";
import { verifyEmailApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    const hasVerified = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No verification token found.");
            return;
        }

        if(hasVerified.current) return
        hasVerified.current = true;

        const verifyEmail = async () => {
            try {
                const response = await verifyEmailApi(token);
                setStatus("success");
                setMessage(response.data.message || "Email verified successfully!");
            } catch (error: any) {
                setStatus("error");
                setMessage(
                    error?.response?.data?.message ||
                    "Failed to verify email. The link may be invalid or expired."
                );
            }
        };

        verifyEmail();
    }, [token]);

    useEffect(() => {
        if(status === "success") {
            const timer  = setTimeout(() => {
                navigate("/login",{replace: true});
            },3000);

            return () => clearTimeout(timer);
        }
    },[status,navigate]);

    return (
        <AuthLayout
            title="Email Verification"
            subtitle="Confirm your email address to get started"
        >
            <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm text-center">
                <div className="flex flex-col items-center justify-center space-y-6 py-4">
                    {status === "loading" && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">Verifying...</h3>
                                <p className="text-white/40 text-sm">Please wait while we confirm your email.</p>
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
                                <CheckCircle2 className="w-16 h-16 text-green-500 relative" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">Verification successful!</h3>
                                <p className="text-white/40 text-sm">{message}</p>
                            </div>
                            <Link to="/login" className="w-full">
                                <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] mt-4">
                                    Go to Login
                                </Button>
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                                <XCircle className="w-16 h-16 text-red-500 relative" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-white">Verification failed</h3>
                                <p className="text-white/40 text-sm">{message}</p>
                            </div>
                            <div className="flex flex-col gap-3 w-full mt-4">
                                <Link to="/signup" className="w-full">
                                    <Button variant="secondary" className="w-full bg-[#1A1D2D] hover:bg-white/5 border border-white/10">
                                        Back to Signup
                                    </Button>
                                </Link>
                                <Link to="/login" className="w-full">
                                    <Button variant="ghost" className="w-full text-white/40 hover:text-white">
                                        Try logging in
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </AuthLayout>
    );
}
