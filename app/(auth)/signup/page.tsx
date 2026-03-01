import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <h1 className="mb-6 text-center text-2xl font-semibold">Create account</h1>
        <SignupForm />
      </div>
    </div>
  );
}
