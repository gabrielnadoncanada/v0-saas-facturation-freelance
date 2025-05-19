export interface TopNavProps {
  user: import("@supabase/supabase-js").User
  profile: any
}

export type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
}

export type QuickAction = {
  title: string
  href: string
  icon: React.ElementType
  description: string
  color: string
} 