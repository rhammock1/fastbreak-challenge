import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <h1 className="mb-6 text-center text-2xl font-semibold">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
