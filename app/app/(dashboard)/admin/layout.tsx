import { ReactNode, Suspense } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {children}
        </div>
    );
}
