"use client";

import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

type PasswordInputProps = {
  id: string;
  name: string;
  placeholder: string;
  hasError?: boolean;
  describedBy?: string;
};

export function PasswordInput({
  id,
  name,
  placeholder,
  hasError,
  describedBy
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? IoEyeOffOutline : IoEyeOutline;

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        className="h-12 w-full border-0 border-b border-neutral-300 bg-transparent px-0 pr-10 text-sm font-medium text-neutral-950 outline-none transition placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-0"
      />
      <button
        type="button"
        aria-label={isVisible ? "Hide password" : "Show password"}
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-0 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center text-neutral-400 transition hover:text-neutral-900"
      >
        <Icon aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
