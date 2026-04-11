"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MODERATOR";

export interface AdminUser {
    id: string;
    email: string;
    role: AdminRole;
}

interface AdminAuthContextValue {
    admin: AdminUser | null;
    isLoading: boolean;
    hasRole: (role: AdminRole | AdminRole[]) => boolean;
    logout: () => Promise<void>;
    setPassword: (password: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState("");

    useEffect(() => {
        async function fetchSession() {
            try {
                const res = await fetch("/api/admin/auth", {body: JSON.stringify({ password:password }), method: "POST" });
                if (res.ok) {
                    const data = await res.json();
                    setAdmin(data.admin);
                } else {
                    setAdmin(null);
                }
            } catch {
                setAdmin(null);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSession();
    }, []);

    function hasRole(role: AdminRole | AdminRole[]): boolean {
        if (!admin) return false;
        const roles = Array.isArray(role) ? role : [role];
        return roles.includes(admin.role);
    }

    async function logout() {
        await fetch("/api/admin/logout", { method: "POST" });
        setAdmin(null);
    }

    return (
        <AdminAuthContext.Provider value={{ admin, isLoading, hasRole, logout, setPassword }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
    return ctx;
}