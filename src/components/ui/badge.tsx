import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gaming: "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        wellness: "border-transparent bg-gradient-to-r from-green-500 to-emerald-500 text-white",
        mood: "border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white",
        energy: "border-transparent bg-gradient-to-r from-orange-400 to-red-500 text-white",
        stress: "border-transparent bg-gradient-to-r from-red-400 to-pink-500 text-white",
        focus: "border-transparent bg-gradient-to-r from-purple-400 to-indigo-500 text-white",
        social: "border-transparent bg-gradient-to-r from-blue-400 to-cyan-500 text-white",
        challenge: "border-transparent bg-gradient-to-r from-green-400 to-emerald-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

