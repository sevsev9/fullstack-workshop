import HomeLayout from "@/layouts/HomeLayout";

export default function SignUpPage() {
  return <div className="space-y-8">Sign up</div>;
}

SignUpPage.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};
