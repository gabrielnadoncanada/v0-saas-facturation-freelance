"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardChartsProps {
  userId: string | undefined
}

export function DashboardCharts({ userId }: DashboardChartsProps) {
  const [invoiceData, setInvoiceData] = useState<any[]>([])
  const [timeData, setTimeData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return

      setIsLoading(true)

      // Fetch invoice data for the last 6 months
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const { data: invoices } = await supabase
        .from("invoices")
        .select("issue_date, total, status")
        .eq("user_id", userId)
        .gte("issue_date", sixMonthsAgo.toISOString().split("T")[0])
        .order("issue_date", { ascending: true })

      // Fetch time entries for the last 6 months
      const { data: timeEntries } = await supabase
        .from("time_entries")
        .select("start_time, duration, hourly_rate")
        .eq("user_id", userId)
        .gte("start_time", sixMonthsAgo.toISOString())
        .order("start_time", { ascending: true })

      setInvoiceData(invoices || [])
      setTimeData(timeEntries || [])
      setIsLoading(false)
    }

    fetchData()
  }, [userId, supabase])

  // Process data for charts
  const processInvoiceData = () => {
    const months: { [key: string]: { total: number; paid: number } } = {}

    invoiceData.forEach((invoice) => {
      const date = new Date(invoice.issue_date)
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

      if (!months[monthYear]) {
        months[monthYear] = { total: 0, paid: 0 }
      }

      months[monthYear].total += invoice.total
      if (invoice.status === "paid") {
        months[monthYear].paid += invoice.total
      }
    })

    return Object.entries(months).map(([month, data]) => ({
      month,
      total: data.total,
      paid: data.paid,
      unpaid: data.total - data.paid,
    }))
  }

  const processTimeData = () => {
    const months: { [key: string]: { hours: number; revenue: number } } = {}

    timeData.forEach((entry) => {
      const date = new Date(entry.start_time)
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

      if (!months[monthYear]) {
        months[monthYear] = { hours: 0, revenue: 0 }
      }

      const hours = entry.duration ? entry.duration / 3600 : 0
      months[monthYear].hours += hours
      months[monthYear].revenue += hours * entry.hourly_rate
    })

    return Object.entries(months).map(([month, data]) => ({
      month,
      hours: Number.parseFloat(data.hours.toFixed(1)),
      revenue: data.revenue,
    }))
  }

  const chartData = processInvoiceData()
  const timeChartData = processTimeData()

  // Calculate invoice status distribution for pie chart
  const getInvoiceStatusData = () => {
    const statusCount = { paid: 0, sent: 0, draft: 0, overdue: 0 }

    invoiceData.forEach((invoice) => {
      if (statusCount[invoice.status as keyof typeof statusCount] !== undefined) {
        statusCount[invoice.status as keyof typeof statusCount]++
      }
    })

    return [
      { name: "Payées", value: statusCount.paid, color: "#10b981" },
      { name: "Envoyées", value: statusCount.sent, color: "#3b82f6" },
      { name: "Brouillons", value: statusCount.draft, color: "#6b7280" },
      { name: "En retard", value: statusCount.overdue, color: "#ef4444" },
    ]
  }

  const invoiceStatusData = getInvoiceStatusData()

  return (
    <Tabs defaultValue="invoices" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="invoices">Factures</TabsTrigger>
        <TabsTrigger value="time">Temps</TabsTrigger>
      </TabsList>
      <TabsContent value="invoices" className="space-y-4">
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          <Card className="rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b">
              <CardTitle>Aperçu des factures</CardTitle>
              <CardDescription>Montant total facturé et payé au cours des 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] p-5">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p>Chargement des données...</p>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    paid: {
                      label: "Payé",
                      color: "hsl(var(--chart-1))",
                    },
                    unpaid: {
                      label: "En attente",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-full overflow-hidden"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="unpaid" stackId="a" fill="var(--color-unpaid)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b">
              <CardTitle>Statut des factures</CardTitle>
              <CardDescription>Répartition des factures par statut</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] p-5">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p>Chargement des données...</p>
                </div>
              ) : invoiceData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {invoiceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value} facture${value !== 1 ? "s" : ""}`, "Quantité"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="time" className="space-y-4">
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          <Card className="rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b">
              <CardTitle>Suivi du temps</CardTitle>
              <CardDescription>Heures suivies au cours des 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] p-5">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p>Chargement des données...</p>
                </div>
              ) : timeChartData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    hours: {
                      label: "Heures",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-full overflow-hidden"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="var(--color-hours)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl overflow-hidden">
            <CardHeader className="p-5 border-b">
              <CardTitle>Revenus du temps</CardTitle>
              <CardDescription>Revenus générés par le temps suivi</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] p-5">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p>Chargement des données...</p>
                </div>
              ) : timeChartData.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenus",
                      color: "hsl(var(--chart-5))",
                    },
                  }}
                  className="h-full overflow-hidden"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip formatter={(value: number) => [formatCurrency(value), "Revenus"]} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
