import HomeLayout from "@/layouts/HomeLayout";
import ProfileForm from "@/components/ProfileForm";

export default function Home() {
  return <ProfileForm />;
}

Home.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};
