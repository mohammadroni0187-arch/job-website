"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Loader2, Mail, User } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Handle expired/invalid sessions: send signed-out visitors to Sign In.
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signIn");
    }
  }, [isPending, session, router]);

  // Loading state while the session is being checked.
  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  const { user } = session;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-bold text-white uppercase shadow-inner">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "Profile image"}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{user.name ? user.name.charAt(0) : "U"}</span>
            )}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {user.name}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {user.email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900/60">
            <div className="flex items-center gap-3 px-4 py-3">
              <User className="h-4 w-4 shrink-0 text-zinc-400" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Name</p>
                <p className="truncate text-sm text-zinc-200">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Email</p>
                <p className="truncate text-sm text-zinc-200">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">Member since</p>
                <p className="truncate text-sm text-zinc-200">{memberSince}</p>
              </div>
            </div>
          </div>

          <Link href="/" className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2 font-medium text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-blue-500 hover:to-indigo-500">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
