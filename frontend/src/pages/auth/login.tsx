import HomeLayout from "@/layouts/HomeLayout";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}

LoginPage.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};
