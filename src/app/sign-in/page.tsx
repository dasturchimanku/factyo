import { AuthShell } from "@/components/auth/AuthShell";
import { SignInScreen } from "@/components/auth/SignInScreen";

export default function SignInPage() {
    return (
        <AuthShell>
            <SignInScreen />
        </AuthShell>
    );
}
