import Link from "next/link";

export default function HomeNavbar() {
  return (
    <nav className="container mx-auto">
      <Link href={"/"}>Home</Link>
    </nav>
  );
}
