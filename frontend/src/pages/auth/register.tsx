import HomeLayout from "@/layouts/HomeLayout";
import RegisterForm from "@/components/RegisterForm";
import AuthLayout from "@/layouts/AuthLayout";

export default function RegisterPage() {
  return <RegisterForm />;
}

RegisterPage.getLayout = (page: React.ReactElement) => {
  return (
    <HomeLayout>
      <AuthLayout type="register">{page}</AuthLayout>
    </HomeLayout>
  );
};
