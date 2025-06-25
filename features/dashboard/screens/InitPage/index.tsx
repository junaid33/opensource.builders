"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { RiLoader2Fill } from "@remixicon/react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createInitialUser, signIn } from "@/features/dashboard/actions";
import { Logo } from "../../components/Logo";

type ActionState = {
  message: string | null;
  formData: {
    name: string;
    email: string;
    password: string;
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full py-2 font-medium"
      disabled={pending}
    >
      {pending ? (
        <RiLoader2Fill className="size-4 shrink-0 animate-spin" />
      ) : (
        "Create account"
      )}
    </Button>
  );
}

const initialState: ActionState = {
  message: null,
  formData: {
    name: "",
    email: "",
    password: "",
  },
};

export function InitPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await createInitialUser(prevState, formData);

      if ("message" in result && result.message) {
        return {
          message: result.message,
          formData: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          },
        };
      }

      // If successful, sign in the user
      await signIn(
        {
          message: null,
          formData: {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          },
        },
        formData
      );

      return {
        message: null,
        formData: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
      };
    },
    initialState
  );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center space-x-1.5">
          <Logo aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-foreground dark:text-foreground">
          Create admin account
        </h3>
        <p className="mt-2 text-sm text-muted-foreground dark:text-muted-foreground">
          Set up your admin account to get started.
        </p>

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground dark:text-foreground"
            >
              Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Enter your name"
              className="mt-2 bg-muted/40"
              defaultValue={state.formData.name}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground dark:text-foreground"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 bg-muted/40"
              defaultValue={state.formData.email}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground dark:text-foreground"
            >
              Password
            </Label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10 bg-muted/40"
                defaultValue={state.formData.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <SubmitButton />
        </form>

        {state.message && (
          <Badge
            variant="destructive"
            className="hover:bg-destructive/10 bg-destructive/5 flex text-base items-start gap-2 border border-destructive/50 p-4 rounded-sm mt-4"
          >
            <div className="flex flex-col gap-1">
              <h2 className="uppercase tracking-wider font-semibold text-sm">
                Error
              </h2>
              <span className="break-all text-sm opacity-75 font-normal">
                {state.message}
              </span>
            </div>
          </Badge>
        )}
      </div>
    </div>
  );
}

export default InitPage;
