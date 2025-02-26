import { AuthCardProps } from "@/app/types/auth-types";

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-gray-200 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">{title}</h2>
            <p className="text-sm text-gray-600 text-center">{subtitle}</p>
            <div className="mt-6">{children}</div>
        </div>
    );
}
