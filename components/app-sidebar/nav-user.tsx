"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import { CurrentUserAvatar } from "@/components/auth/current-user-avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/auth-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error(error);
      }

      setUser(data.session?.user ?? null);
    };

    fetchUser();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <CurrentUserAvatar></CurrentUserAvatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.user_metadata?.name}
                </span>
                <span className="truncate text-xs">
                  {user?.user_metadata?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel asChild className="p-0 font-normal">
              <Link href="/account">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <CurrentUserAvatar></CurrentUserAvatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{"fullname"}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </div>
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/account"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <BadgeCheck />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-1 cursor-pointer">
                <SlidersHorizontal />
                Preferences
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="flex items-center gap-1 cursor-pointer"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
