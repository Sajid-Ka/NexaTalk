import AuthLayout from "../components/AuthLayout";
import SignupForm from "../components/SignupForm";

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
