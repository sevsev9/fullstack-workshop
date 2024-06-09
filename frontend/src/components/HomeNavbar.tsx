import Link from "next/link";
import UserButton from "@/components/UserButton";

export default function HomeNavbar() {
  return (
    <nav className="container mx-auto flex items-center justify-between h-14">
      <Link href={"/"}>Home</Link>
      <UserButton />
    </nav>
  );
}
