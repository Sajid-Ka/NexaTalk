import AuthLayout from "../components/AuthLayout";
import ResetPasswordForm from "../components/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Please enter your new password below"
        >
            <ResetPasswordForm />
        </AuthLayout>
    );
}
