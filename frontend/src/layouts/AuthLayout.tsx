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

      {isLogin ? <RegisterLink /> : <LoginLink />}
    </div>
  );
}

const LoginLink = () => {
  return (
    <AuthLink
      link={"/auth/login"}
      linkText={"You already have an account?"}
      span={"Login"}
    />
  );
};

const RegisterLink = () => {
  return (
    <AuthLink
      link={"/auth/register"}
      linkText={"You don't have an account yet?"}
      span={"Sign up"}
    />
  );
};

const AuthLink = (props: { link: string; linkText: string; span: string }) => {
  return (
    <Link href={props.link} className="text-center">
      {props.linkText} <span className="font-bold underline">{props.span}</span>
    </Link>
  );
};
