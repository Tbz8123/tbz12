import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface User {
  username: string;
  isAdmin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  // Mock login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (username === "mhdtbz5@gmail.com" && password === "password") {
        return { username, isAdmin: true };
      }
      throw new Error("Invalid credentials");
    },
    onSuccess: (data) => setUser(data),
  });

  // Mock register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ username, password, isAdmin }: { username: string; password: string; isAdmin?: boolean }) => {
      if (username && password && isAdmin) {
        return { username, isAdmin: true };
      }
      throw new Error("Registration failed");
    },
    onSuccess: (data) => setUser(data),
  });

  return { user, loginMutation, registerMutation };
} 