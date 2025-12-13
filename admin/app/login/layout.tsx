import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Login - Trustify",
    description: "Sign in to Trustify Admin Panel",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
