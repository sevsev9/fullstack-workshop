import HomeNavbar from "@/components/HomeNavbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeNavbar />
      <main className="container mx-auto">{children}</main>
    </>
  );
}
