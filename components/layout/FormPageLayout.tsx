import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

export interface FormPageLayoutProps {
  title: string
  subtitle?: string
  backHref: string
  children: ReactNode
}

export function FormPageLayout({ title, subtitle, backHref, children }: FormPageLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href={backHref}>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="grid gap-6">{children}</div>
    </div>
  )
}

export default FormPageLayout 