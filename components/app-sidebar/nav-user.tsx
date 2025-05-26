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
import { ChevronsUpDown, LogOut, SlidersHorizontal, User2 } from "lucide-react";
import { CurrentUserAvatar } from "@/components/auth/current-user-avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/auth-js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error(error);
      setUser(data.session?.user ?? null);
    };
    fetchUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    setOpenMobile(false);
  };

  return (
    <SidebarMenu>
      {user ? (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <CurrentUserAvatar></CurrentUserAvatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{"Username"}</span>
                  <span className="truncate text-xs">{user?.email}</span>
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
                <Link href="/account" onClick={() => setOpenMobile(false)}>
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <CurrentUserAvatar></CurrentUserAvatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {"Username"}
                      </span>
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
                    onClick={() => setOpenMobile(false)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <User2 />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-1 cursor-pointer">
                  <Link
                    href="/preferences"
                    onClick={() => setOpenMobile(false)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal />
                    Preferences
                  </Link>
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
      ) : (
        <>
          <SidebarMenuItem>
            <Button variant="outline" className="w-full" asChild>
              <Link
                href={`/auth/login?next=${pathname}`}
                onClick={() => setOpenMobile(false)}
              >
                Sign in
              </Link>
            </Button>
          </SidebarMenuItem>

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <SidebarMenuItem>
            <Button className="w-full" asChild>
              <Link href="/auth/sign-up/" onClick={() => setOpenMobile(false)}>
                Sign up
              </Link>
            </Button>
          </SidebarMenuItem>
        </>
      )}
    </SidebarMenu>
  );
}
