import Link from "next/link";

export default function AuthLayout({
  type,
  children,
}: {
  type: "login" | "register";
  children: React.ReactNode;
}) {
  const isLogin = type === "login";
  const header = isLogin ? "Welcome back" : "Create Account";

  return (
    <div className="gap-12 flex flex-col">
      <div className="text-center">
        <h1 className="font-bold text-2xl">{header}</h1>
        <p>Enter your details to continue</p>
      </div>

      <div className="self-center w-full max-w-md">{children}</div>

      <AuthLink
        link={isLogin ? "/auth/register" : "/auth/login"}
        linkText={
          isLogin
            ? "You don't have an account yet?"
            : "You already have an account?"
        }
        span={isLogin ? "Sign up" : "Login"}
      />
    </div>
  );
}

const AuthLink = (props: { link: string; linkText: string; span: string }) => {
  return (
    <Link href={props.link} className="text-center">
      {props.linkText} <span className="font-bold underline">{props.span}</span>
    </Link>
  );
};

const RegisterLink = () => {
  return (
    <Link href="/auth/register" className="text-center">
      You don't have an account yet?{" "}
      <span className="font-bold underline">Sign up</span>
    </Link>
  );
};

const LoginLink = () => {
  return (
    <Link href="/auth/login" className="text-center">
      You already have an account?{" "}
      <span className="font-bold underline">Login</span>
    </Link>
  );
};
