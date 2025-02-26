import {AuthCardProps} from "@/app/types/auth-types";

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                <p className="text-gray-500 mt-2">{subtitle}</p>
            </div>
            {children}
        </div>
    );
}
