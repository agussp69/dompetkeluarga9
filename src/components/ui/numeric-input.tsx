import * as React from "react";
import { Input } from "./input";
import { formatThousand } from "@/lib/format";

interface NumericInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const originalValue = input.value;
      
      // Calculate how many digits are before the cursor prior to formatting
      const cursorPosition = input.selectionStart ?? 0;
      const digitsBeforeCursor = originalValue.slice(0, cursorPosition).replace(/\D/g, "").length;

      const formatted = formatThousand(originalValue);
      
      onChange(formatted);

      // We need to restore the cursor position in a requestAnimationFrame/setTimeout
      // because after onChange triggers a re-render, React will update the input value
      // and reset the cursor position.
      requestAnimationFrame(() => {
        if (!input) return;
        let newCursorPosition = 0;
        let digitCount = 0;
        // Find the index in the new formatted value that corresponds to digitsBeforeCursor
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) {
            digitCount++;
          }
          newCursorPosition = i + 1;
          if (digitCount === digitsBeforeCursor) {
            break;
          }
        }
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    };

    // When value is modified from parent, format it.
    const formattedValue = formatThousand(value);

    return (
      <Input
        inputMode="numeric"
        {...props}
        ref={ref}
        value={formattedValue}
        onChange={handleChange}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";
