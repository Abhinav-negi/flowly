"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FirebaseError } from "firebase/app";
import {
  signUpWithEmail,
  loginWithEmail,
  signInWithGoogle,
} from "@/lib/authService";
import {
  createUserProfileOnSignup,
  checkUserExists,
} from "@/lib/services/userService";
import { getProfile } from "@/lib/services/profileService";
import { getAdditionalUserInfo } from "firebase/auth";

// Validation
const baseSchema = {
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
};
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z
    .string()
    .min(10, "Enter a valid phone")
    .max(20, "Enter a valid phone")
    .regex(/^[\d+\-\s()]*$/, "Only digits and (+- ) allowed"),
  gender: z.enum(["male", "female", "other"]),
  ...baseSchema,
});
const signinSchema = z.object(baseSchema);

type SignUpValues = z.infer<typeof signupSchema>;
type SignInValues = z.infer<typeof signinSchema>;
type FormValues = SignUpValues | SignInValues;

// map Firebase errors to friendly text
function mapFirebaseError(code?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Email already registered. Try signing in.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/invalid-password":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before completing.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(mode === "signup" ? signupSchema : signinSchema),
    defaultValues:
      mode === "signup"
        ? { name: "", mobile: "", gender: "male", email: "", password: "" }
        : { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Normalize inputs
      const email = (values as SignUpValues | SignInValues).email.trim();
      const password = (values as SignUpValues | SignInValues).password;

      if (mode === "signup") {
        const { name, mobile, gender } = values as SignUpValues;
        const userCredential = await signUpWithEmail(email, password);
        const uid = userCredential.user.uid;

        await createUserProfileOnSignup(uid, email, name);
        // optional: store mobile & gender as part of profile
        await getProfile(uid); // triggers profile creation if needed
      } else {
        const userCredential = await loginWithEmail(email, password);
        const uid = userCredential.user.uid;

        const exists = await checkUserExists(uid);
        if (!exists) {
          setErrorMsg("Account not found. Please sign up first.");
          return;
        }
      }

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMsg(mapFirebaseError(error.code));
        console.error("Auth error:", error.code, error.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const userCredential = await signInWithGoogle();
      const uid = userCredential.user.uid;
      const info = getAdditionalUserInfo(userCredential);
      const isNew = info?.isNewUser;

      if (isNew) {
        await createUserProfileOnSignup(uid, userCredential.user.email || "", userCredential.user.displayName || "");
      } else {
        const existingProfile = await getProfile(uid);
        if (!existingProfile) {
          await createUserProfileOnSignup(uid, userCredential.user.email || "", userCredential.user.displayName || "");
        }
      }

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMsg(mapFirebaseError(error.code));
      } else {
        setErrorMsg("Google sign-in failed. Please try again.");
      }
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 mt-3 bg-white rounded-xl p-6 sm:p-8 shadow-md"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
          {mode === "signup" ? "Create Account" : "Login"}
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-sm" aria-live="polite">
            {errorMsg}
          </p>
        )}

        {mode === "signup" && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" inputMode="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <select {...field} className="border p-2 rounded w-full" aria-label="Gender">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@mail.com"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.trim())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full bg-[#E05265] hover:bg-[#E05265]/90 text-white"
        >
          {mode === "signup" ? "Sign Up" : "Login"}
        </Button>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          aria-busy={loading}
          className="w-full border bg-white text-gray-700 flex items-center gap-2"
        >
          <Image
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            width={20}
            height={20}
          />
          Sign in with Google
        </Button>

        <div className="text-center text-sm text-gray-600">
          {mode === "signup" ? (
            <p>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-[#E05265] hover:underline">
                Login
              </Link>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-[#E05265] hover:underline">
                Sign Up
              </Link>
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
