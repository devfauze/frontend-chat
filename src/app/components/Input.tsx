import {InputProps} from "@/app/types/input-types";

export function Input({ icon, ...rest }: InputProps) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>
            <input
                {...rest}
                className="w-full pl-12 pr-4 py-3 text-gray-500 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
        </div>
    );
}
