import {InputHTMLAttributes, JSX} from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon: JSX.Element;
}