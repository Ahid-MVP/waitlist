"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminRole, useAdminAuth } from "./context/AdminAuthContext";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AdminRole[];
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = "/admin/login",
}: RoleGuardProps) {
  const { admin, isLoading, hasRole } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!admin || !hasRole(allowedRoles))) {
      router.replace(redirectTo);
    }
  }, [admin, isLoading, allowedRoles, redirectTo, router, hasRole]);

  if (isLoading) return <div>Loading...</div>;
  if (!admin || !hasRole(allowedRoles)) return null;

  return <>{children}</>;
}