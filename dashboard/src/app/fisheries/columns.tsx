"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type FishPrice = {
  fishPriceId: string;
  fishTypeId: string;
  fishName: string;
  priceDate: string;
  retailPrice: number;
  wholesalePrice: number;
  marketDemandLevel: "high" | "medium" | "low";
  supplyAvailability: number;
};

export const columns: ColumnDef<FishPrice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "fishTypeId",
    header: "Fish Type ID",
  },
  {
    accessorKey: "fishName",
    header: "Fish Name",
  },
  {
    accessorKey: "priceDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("priceDate"));
      return <div>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>;
    },
  },
  {
    accessorKey: "retailPrice",
    header: () => <div className="text-right">Retail Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("retailPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "LKR",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "wholesalePrice",
    header: () => <div className="text-right">Wholesale Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("wholesalePrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "LKR",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "marketDemandLevel",
    header: "Demand Level",
    cell: ({ row }) => {
      const demand = row.getValue("marketDemandLevel");
      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            demand === "high" && "bg-green-500/40",
            demand === "medium" && "bg-yellow-500/40",
            demand === "low" && "bg-red-500/40"
          )}
        >
          {demand as string}
        </div>
      );
    },
  },
  {
    accessorKey: "supplyAvailability",
    header: () => <div className="text-right">Supply (kg)</div>,
    cell: ({ row }) => {
      const supply = parseFloat(row.getValue("supplyAvailability"));
      return <div className="text-right font-medium">{supply.toLocaleString()} kg</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fishPrice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(fishPrice.fishPriceId)}
            >
              Copy Price ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View fish details</DropdownMenuItem>
            <DropdownMenuItem>Update price</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];