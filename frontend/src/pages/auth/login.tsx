import HomeLayout from "@/layouts/HomeLayout";
import LoginForm from "@/components/LoginForm";
import AuthLayout from "@/layouts/AuthLayout";

export default function LoginPage() {
  return <LoginForm />;
}

LoginPage.getLayout = (page: React.ReactElement) => {
  return (
    <HomeLayout>
      <AuthLayout type="login">{page}</AuthLayout>
    </HomeLayout>
  );
};
