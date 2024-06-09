import React from "react";
import { useRouter } from "next/router";
import { LogOutIcon, UserIcon } from "lucide-react";
import { LOGIN_PAGE } from "@/utils/pages";
import { useUserContext } from "@/context/AuthContext";
// components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const { isAuthed } = useUserContext();
  const router = useRouter();

  const handleSignInClick = () => {
    router.push(LOGIN_PAGE);
  };

  if (!isAuthed) {
    return <Button onClick={handleSignInClick}>Sign in</Button>;
  }

  return <UserDropdown />;
}

function UserDropdown() {
  const router = useRouter();

  const items = [
    {
      label: "Profile",
      Icon: UserIcon,
      onClick: () => router.push("/profile"),
    },
    {
      label: "Logout",
      Icon: LogOutIcon,
      onClick: () => {},
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Username</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Email</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map(({ onClick, Icon, label }, i) => {
          return (
            <React.Fragment key={i}>
              <DropdownMenuItem
                className="cursor-pointer gap-4"
                onClick={onClick}
              >
                <Icon size={16} />
                {label}
              </DropdownMenuItem>
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
