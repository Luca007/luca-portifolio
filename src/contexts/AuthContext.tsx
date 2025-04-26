"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);

      // Check if user is admin
      if (authUser) {
        // This is a simple check. In production, you might want to check against a list
        // of admin emails or a custom claim in Firebase Authentication
        const adminEmails = ['admin@example.com', 'luca.clerot@gmail.com'];
        setIsAdmin(adminEmails.includes(authUser.email || ''));
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        variant: "success",
      });
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Logout Successful",
        description: "You have successfully logged out.",
        variant: "success",
      });
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Logout Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
