"use client";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const debounced = useDebounceCallback(setUsername, 500);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (username) {
      const checkUniqueUsername = async () => {
        setUsernameMessage("");
        setIsCheckingUsername(true);
        try {
          const response = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const usernameError = error as AxiosError;
          console.error(`Error on checking the unique user: ${error}`);
          setUsernameMessage(usernameError.message);
        } finally {
          setIsCheckingUsername(false);
        }
      };

      checkUniqueUsername();
    }
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      console.log(response);
      toast({
        title: "Sign up successful",
        description: response.data.message,
      });

      //   redirect to the verify page
      router.push(`/verify/${username}`);
    } catch (error) {
      const formErr = error as AxiosError<ApiResponse>;
      console.error(`Error on submitting the signup form: ${error}`);
      toast({
        title: "Error",
        description:
          formErr.response?.data.message ||
          "Something went wrong, please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </FormControl>
                <div className="flex">
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  {usernameMessage && (
                    <span
                      className={`text-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-green-500"
                          : "text-red-500"
                      } `}
                    >
                      {usernameMessage}
                    </span>
                  )}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormDescription className="opacity-80">
                  We will send you a verification code.
                </FormDescription>
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
                  <Input {...field} type="password" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Please wait
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
