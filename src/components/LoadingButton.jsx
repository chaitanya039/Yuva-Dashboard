// src/components/ui/LoadingButton.jsx
import { forwardRef } from "react";
import { ClipLoader } from "react-spinners";
import clsx from "clsx";

/*
  LoadingButton  – 100 % controlled by props
  -----------------------------------------------------------
  Props
    loading        boolean   – set true while your request runs
    baseClass      string    – Tailwind / CSS classes for the button
    spinnerClass   string    – classes just for the <ClipLoader/>
    spinnerSize    number    – px size (default 18)
    fullWidth      boolean   – make the button 100 % width
    disabled       boolean   – additional disabled reason
    …rest          – any native <button> props (type, onClick, etc.)
*/

const LoadingButton = forwardRef(
  (
    {
      loading = false,
      baseClass = "",
      spinnerClass = "",
      spinnerSize = 18,
      fullWidth = false,
      disabled,
      children,
      ...rest
    },
    ref
  ) => {
    const skeleton =
      "inline-flex items-center justify-center rounded-md transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const width = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(skeleton, width, baseClass)}
        {...rest}
      >
        {loading && (
          <ClipLoader
            size={spinnerSize}
            color="currentColor"
            className={clsx("mr-2", spinnerClass)}
          />
        )}

        {/* Keep label from shifting when spinner shows */}
        <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
      </button>
    );
  }
);

export default LoadingButton;
