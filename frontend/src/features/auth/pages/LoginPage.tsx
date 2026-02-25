import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout
            title="We're so excited to see you again!"
            subtitle="Login page"
        >
            <LoginForm />
        </AuthLayout>
    );
}
