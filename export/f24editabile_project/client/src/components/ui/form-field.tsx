import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, labelClassName, inputClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        {label && (
          <label className={cn("block text-sm font-medium text-gray-900 mb-1", labelClassName)}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "form-field bg-transparent border border-gray-200 rounded p-2 w-full focus:outline-none focus:ring-1 focus:ring-black",
            error && "border-red-500",
            inputClassName
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField };
