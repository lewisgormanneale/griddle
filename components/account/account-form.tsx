"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/account/avatar";
import { useToast } from "@/hooks/use-toast";

const accountFormSchema = z.object({
  email: z.string().email(),
  username: z.string().optional(),
  avatar_url: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountForm({ user }: { user: User }) {
  const supabase = createClient();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: user.email || "",
      username: "",
      avatar_url: "",
    },
  });

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        form.setValue("username", data.username ?? "");
        form.setValue("avatar_url", data.avatar_url ?? "");
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase, form]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function onSubmit(values: z.infer<typeof accountFormSchema>) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: values.username,
        avatar_url: values.avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast({
        title: "Profile Updated",
        description: "Updated profile details may not appear immediately.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "There was a problem updating your profile.",
      });
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Make changes to your account information here
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The name that will be associated with any content you upload
                    to the site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <Avatar
                    uid={user?.id ?? null}
                    url={form.watch("avatar_url") ?? ""}
                    size={150}
                    onUpload={(url) => {
                      form.setValue("avatar_url", url);
                    }}
                  />
                  <FormDescription>
                    This image will appear alongside your username around the
                    site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Loading ..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
