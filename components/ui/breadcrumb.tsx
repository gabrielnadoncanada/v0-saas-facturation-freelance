"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/shared/lib/utils"

const Breadcrumb = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
)
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
)
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return <Comp ref={ref} className={cn("transition-colors hover:text-foreground", className)} {...props} />
})
BreadcrumbLink.displayName = "BreadcrumbLink"

// Change this from an <li> to a <span> to avoid nesting <li> elements
const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "span"

  return <Comp ref={ref} className={cn("[&>svg]:h-3.5 [&>svg]:w-3.5", className)} {...props} />
})
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("font-normal text-foreground", className)} {...props} />
  ),
)
BreadcrumbPage.displayName = "BreadcrumbPage"

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage }
