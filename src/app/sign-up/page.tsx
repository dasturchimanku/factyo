import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpScreen } from "@/components/auth/SignUpScreen";

export default function SignUpPage() {
    return (
        <AuthShell>
            <SignUpScreen />
        </AuthShell>
    );
}
