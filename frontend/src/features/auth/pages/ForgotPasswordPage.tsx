import AuthLayout from "../components/AuthLayout";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Enter your email and we'll send you a reset link"
        >
            <ForgotPasswordForm />
        </AuthLayout>
    );
}
