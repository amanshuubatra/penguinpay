"use client";
import { Button, ButtonProps } from "./ui/Button";

export function PaymentButton(props: ButtonProps) {
    return <Button {...props} className={`bg-brand-marigold hover:bg-amber-600 text-brand-black font-bold ${props.className}`} />;
}
