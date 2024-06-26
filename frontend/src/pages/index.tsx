import Link from "next/link";
import HomeLayout from "@/layouts/HomeLayout";
import { Button } from "@/components/ui/button";
import { DASHBOARD_PAGE } from "@/utils/pages";

export default function Home() {
  return (
    <div className="space-y-8 h-full">
      <h1 className="text-3xl font-bold text-center">
        This is a cool todo app
      </h1>

      <Link href={DASHBOARD_PAGE}>
        <Button>Go to your todos</Button>
      </Link>
    </div>
  );
}

Home.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};
