
import AnimatedBackground from "./components/animated-background";
import LoginForm from "./components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}
