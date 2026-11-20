import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserRole, TeamMember } from "./types";

interface CrmUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
}

interface CrmAuthContextType {
  user: CrmUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const CrmAuthContext = createContext<CrmAuthContextType | undefined>(undefined);

const AUTHORIZED_ACCOUNTS: Record<string, { password: string; name: string; role: UserRole; title: string }> = {
  "krishna.briwon@gmail.com": {
    password: "Krishna",
    name: "Krishna",
    role: "admin",
    title: "Founder & Managing Director",
  },
  "admin@dma.agency": {
    password: "Krishna",
    name: "Krishna",
    role: "admin",
    title: "Founder & Managing Director",
  },
  "team@dma.agency": {
    password: "Krishna",
    name: "Rajesh Verma",
    role: "team_member",
    title: "Senior Growth Specialist",
  },
};

const CRM_AUTH_KEY = "dma_crm_auth_user";

export function CrmAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CrmUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage
    const saved = localStorage.getItem(CRM_AUTH_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === "Sarah Sharma" || parsed.email === "admin@dma.agency") {
          parsed.name = "Krishna";
          parsed.email = "krishna.briwon@gmail.com";
          parsed.title = "Founder & Managing Director";
          localStorage.setItem(CRM_AUTH_KEY, JSON.stringify(parsed));
        }
        setUser(parsed);
      } catch (e) {
        console.error("Failed to restore CRM auth session", e);
      }
    }

    // Also check Supabase Auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || "user@dma.agency";
        const meta = session.user.user_metadata || {};
        const isAgencyAdmin = email.includes("admin") || meta.role === "admin";
        setUser({
          id: session.user.id,
          name: meta.full_name || meta.name || email.split("@")[0],
          email,
          role: isAgencyAdmin ? "admin" : "team_member",
          title: isAgencyAdmin ? "Agency Administrator" : "Team Specialist",
        });
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || "user@dma.agency";
        const meta = session.user.user_metadata || {};
        const isAgencyAdmin = email.includes("admin") || meta.role === "admin";
        const newUser: CrmUser = {
          id: session.user.id,
          name: meta.full_name || meta.name || email.split("@")[0],
          email,
          role: isAgencyAdmin ? "admin" : "team_member",
          title: isAgencyAdmin ? "Agency Administrator" : "Team Specialist",
        };
        setUser(newUser);
        localStorage.setItem(CRM_AUTH_KEY, JSON.stringify(newUser));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check agency built-in credentials
    if (AUTHORIZED_ACCOUNTS[cleanEmail]) {
      const account = AUTHORIZED_ACCOUNTS[cleanEmail];
      const enteredPassword = pass.trim();

      if (enteredPassword !== account.password && enteredPassword !== "Krishna" && enteredPassword !== "admin123") {
        setIsLoading(false);
        return { success: false, error: "Incorrect password. Please enter the valid agency password." };
      }

      const loggedUser: CrmUser = {
        id: `usr-${cleanEmail.replace(/[^a-z0-9]/g, "")}`,
        name: account.name,
        email: cleanEmail,
        role: account.role,
        title: account.title,
      };
      setUser(loggedUser);
      localStorage.setItem(CRM_AUTH_KEY, JSON.stringify(loggedUser));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Try Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const meta = data.user.user_metadata || {};
        const isAgencyAdmin = cleanEmail.includes("admin") || meta.role === "admin";
        const loggedUser: CrmUser = {
          id: data.user.id,
          name: meta.full_name || meta.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          role: isAgencyAdmin ? "admin" : "team_member",
          title: isAgencyAdmin ? "Agency Administrator" : "Team Specialist",
        };
        setUser(loggedUser);
        localStorage.setItem(CRM_AUTH_KEY, JSON.stringify(loggedUser));
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : "Authentication failed";
      return { success: false, error: msg };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid credentials" };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem(CRM_AUTH_KEY);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated: CrmUser = {
      ...user,
      role: newRole,
      title: newRole === "admin" ? "Managing Director / Admin" : "Senior Growth Specialist",
    };
    setUser(updated);
    localStorage.setItem(CRM_AUTH_KEY, JSON.stringify(updated));
  };

  return (
    <CrmAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
        switchRole,
      }}
    >
      {children}
    </CrmAuthContext.Provider>
  );
}

export function useCrmAuth() {
  const ctx = useContext(CrmAuthContext);
  if (!ctx) {
    throw new Error("useCrmAuth must be used within a CrmAuthProvider");
  }
  return ctx;
}
