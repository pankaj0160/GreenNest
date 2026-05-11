import cn from "@/utils/cn";

/**
 * Button.jsx
 * Reusable button component with variant + loading state support.
 */
const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  className,
  disabled,
  type = "button",
  ...props
}) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(variants[variant], "w-full justify-center py-2.5", className)}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;