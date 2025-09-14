"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2025-08-12", kelawalla: 1200, thalapath: 1800, balaya: 900, paraw: 1100, salaya: 600, hurulla: 500, linna: 700 },
  { date: "2025-08-13", kelawalla: 1250, thalapath: 1750, balaya: 950, paraw: 1150, salaya: 620, hurulla: 520, linna: 720 },
  { date: "2025-08-14", kelawalla: 1300, thalapath: 1900, balaya: 1000, paraw: 1200, salaya: 650, hurulla: 550, linna: 750 },
  { date: "2025-08-15", kelawalla: 1280, thalapath: 1850, balaya: 980, paraw: 1180, salaya: 630, hurulla: 540, linna: 740 },
  { date: "2025-08-16", kelawalla: 1350, thalapath: 1950, balaya: 1050, paraw: 1250, salaya: 670, hurulla: 560, linna: 760 },
  { date: "2025-08-17", kelawalla: 1400, thalapath: 2000, balaya: 1100, paraw: 1300, salaya: 700, hurulla: 580, linna: 780 },
  { date: "2025-08-18", kelawalla: 1450, thalapath: 2050, balaya: 1150, paraw: 1350, salaya: 720, hurulla: 600, linna: 800 },
  { date: "2025-08-19", kelawalla: 1420, thalapath: 1980, balaya: 1120, paraw: 1320, salaya: 710, hurulla: 590, linna: 790 },
  { date: "2025-08-20", kelawalla: 1380, thalapath: 1920, balaya: 1080, paraw: 1280, salaya: 680, hurulla: 570, linna: 770 },
  { date: "2025-08-21", kelawalla: 1500, thalapath: 2100, balaya: 1200, paraw: 1400, salaya: 750, hurulla: 620, linna: 820 },
  { date: "2025-08-22", kelawalla: 1550, thalapath: 2150, balaya: 1250, paraw: 1450, salaya: 780, hurulla: 650, linna: 850 },
  { date: "2025-08-23", kelawalla: 1600, thalapath: 2200, balaya: 1300, paraw: 1500, salaya: 800, hurulla: 670, linna: 870 },
  { date: "2025-08-24", kelawalla: 1580, thalapath: 2180, balaya: 1280, paraw: 1480, salaya: 790, hurulla: 660, linna: 860 },
  { date: "2025-08-25", kelawalla: 1650, thalapath: 2250, balaya: 1350, paraw: 1550, salaya: 820, hurulla: 680, linna: 880 },
  { date: "2025-08-26", kelawalla: 1700, thalapath: 2300, balaya: 1400, paraw: 1600, salaya: 850, hurulla: 700, linna: 900 },
  { date: "2025-08-27", kelawalla: 1680, thalapath: 2280, balaya: 1380, paraw: 1580, salaya: 830, hurulla: 690, linna: 890 },
  { date: "2025-08-28", kelawalla: 1750, thalapath: 2350, balaya: 1450, paraw: 1650, salaya: 870, hurulla: 720, linna: 920 },
  { date: "2025-08-29", kelawalla: 1800, thalapath: 2400, balaya: 1500, paraw: 1700, salaya: 900, hurulla: 750, linna: 950 },
  { date: "2025-08-30", kelawalla: 1780, thalapath: 2380, balaya: 1480, paraw: 1680, salaya: 880, hurulla: 740, linna: 940 },
  { date: "2025-08-31", kelawalla: 1850, thalapath: 2450, balaya: 1550, paraw: 1750, salaya: 920, hurulla: 770, linna: 970 },
  { date: "2025-09-01", kelawalla: 1900, thalapath: 2500, balaya: 1600, paraw: 1800, salaya: 950, hurulla: 800, linna: 1000 },
  { date: "2025-09-02", kelawalla: 1880, thalapath: 2480, balaya: 1580, paraw: 1780, salaya: 930, hurulla: 790, linna: 990 },
  { date: "2025-09-03", kelawalla: 1950, thalapath: 2550, balaya: 1650, paraw: 1850, salaya: 970, hurulla: 820, linna: 1020 },
  { date: "2025-09-04", kelawalla: 2000, thalapath: 2600, balaya: 1700, paraw: 1900, salaya: 1000, hurulla: 850, linna: 1050 },
  { date: "2025-09-05", kelawalla: 1980, thalapath: 2580, balaya: 1680, paraw: 1880, salaya: 980, hurulla: 840, linna: 1040 },
  { date: "2025-09-06", kelawalla: 2050, thalapath: 2650, balaya: 1750, paraw: 1950, salaya: 1020, hurulla: 870, linna: 1070 },
  { date: "2025-09-07", kelawalla: 2100, thalapath: 2700, balaya: 1800, paraw: 2000, salaya: 1050, hurulla: 900, linna: 1100 },
  { date: "2025-09-08", kelawalla: 2080, thalapath: 2680, balaya: 1780, paraw: 1980, salaya: 1030, hurulla: 890, linna: 1090 },
  { date: "2025-09-09", kelawalla: 2150, thalapath: 2750, balaya: 1850, paraw: 2050, salaya: 1080, hurulla: 920, linna: 1120 },
  { date: "2025-09-10", kelawalla: 2200, thalapath: 2800, balaya: 1900, paraw: 2100, salaya: 1100, hurulla: 950, linna: 1150 },
]

const chartConfig = {
  visitors: {
    label: "Fish Prices",
  },
  kelawalla: {
    label: "Yellowfin Tuna (Kelawalla)",
    color: "var(--chart-1)",
  },
  thalapath: {
    label: "Sailfish (Thalapath)",
    color: "var(--chart-2)",
  },
  balaya: {
    label: "Skipjack Tuna (Balaya)",
    color: "var(--chart-3)",
  },
  paraw: {
    label: "Trevally (Paraw)",
    color: "var(--chart-4)",
  },
  salaya: {
    label: "Sardinella (Salaya)",
    color: "var(--chart-5)",
  },
  hurulla: {
    label: "Herrings (Hurulla)",
    color: "var(--chart-6)",
  },
  linna: {
    label: "Indian Scad (Linna)",
    color: "var(--chart-7)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2025-09-10")
    let daysToSubtract = 30
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "14d") {
      daysToSubtract = 14
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Fish Prices</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 30 days
          </span>
          <span className="@[540px]/card:hidden">Last 30 days</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="14d">Last 14 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                Last 14 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillKelawalla" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-kelawalla)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-kelawalla)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillThalapath" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-thalapath)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-thalapath)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBalaya" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-balaya)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-balaya)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillParaw" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-paraw)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-paraw)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSalaya" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-salaya)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-salaya)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillHurulla" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-hurulla)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-hurulla)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillLinna" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-linna)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-linna)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="kelawalla"
              type="natural"
              fill="url(#fillKelawalla)"
              stroke="var(--color-kelawalla)"
              stackId="a"
            />
            <Area
              dataKey="thalapath"
              type="natural"
              fill="url(#fillThalapath)"
              stroke="var(--color-thalapath)"
              stackId="a"
            />
            <Area
              dataKey="balaya"
              type="natural"
              fill="url(#fillBalaya)"
              stroke="var(--color-balaya)"
              stackId="a"
            />
            <Area
              dataKey="paraw"
              type="natural"
              fill="url(#fillParaw)"
              stroke="var(--color-paraw)"
              stackId="a"
            />
            <Area
              dataKey="salaya"
              type="natural"
              fill="url(#fillSalaya)"
              stroke="var(--color-salaya)"
              stackId="a"
            />
            <Area
              dataKey="hurulla"
              type="natural"
              fill="url(#fillHurulla)"
              stroke="var(--color-hurulla)"
              stackId="a"
            />
            <Area
              dataKey="linna"
              type="natural"
              fill="url(#fillLinna)"
              stroke="var(--color-linna)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}