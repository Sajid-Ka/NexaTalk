import AuthLayout from "../../features/auth/components/AuthLayout";
import SignupForm from "../../features/auth/components/SignupForm";

export default function SignupPage() {
    return (
        <AuthLayout
            title="Create an account"
            subtitle="Join the conversation today."
        >
            <SignupForm />
        </AuthLayout>
    );
}
