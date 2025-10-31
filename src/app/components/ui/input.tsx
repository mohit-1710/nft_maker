import * as React from "react"

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2",
      "text-white placeholder:text-white/40 backdrop-blur-sm",
      "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 focus:border-purple-400",
      "transition-all duration-200",
      className,
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }