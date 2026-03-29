"use server";

import { signIn } from "@/auth";

export async function githubSignInAction() {
  await signIn("github", {
    redirectTo: "/dashboard",
  });
}