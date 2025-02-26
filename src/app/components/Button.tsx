import {ButtonProps} from "@/app/types/button-types";

export function Button({ children, onClick, type = "button", className }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${className}`}
        >
            {children}
        </button>
    );
}
