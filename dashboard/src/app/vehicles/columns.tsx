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

export type Truck = {
  id: string;
  licensePlate: string;
  capacityKg: number;
  costPerKm: number;
  ownerName: string;
  maintenanceDueDate: string;
  fuelType: "diesel" | "petrol";
  isRefrigerated: boolean;
  availabilityStatus: "available" | "in-use" | "maintenance";
};

export const columns: ColumnDef<Truck>[] = [
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
    accessorKey: "id",
    header: "Truck ID",
  },
  {
    accessorKey: "licensePlate",
    header: "License Plate",
  },
  {
    accessorKey: "capacityKg",
    header: "Capacity (kg)",
    cell: ({ row }) => {
      const capacity = parseFloat(row.getValue("capacityKg"));
      return <div>{capacity.toLocaleString()} kg</div>;
    },
  },
  {
    accessorKey: "costPerKm",
    header: () => <div className="text-right">Cost per Km</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("costPerKm"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "LKR",
      }).format(cost);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
  },
  {
    accessorKey: "maintenanceDueDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Maintenance Due
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("maintenanceDueDate"));
      return <div>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>;
    },
  },
  {
    accessorKey: "fuelType",
    header: "Fuel Type",
    cell: ({ row }) => {
      const fuelType = row.getValue("fuelType") as string;
      return <div>{fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}</div>;
    },
  },
  {
    accessorKey: "isRefrigerated",
    header: "Refrigerated",
    cell: ({ row }) => {
      const isRefrigerated = row.getValue("isRefrigerated");
      return <div>{isRefrigerated ? "Yes" : "No"}</div>;
    },
  },
  {
    accessorKey: "availabilityStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("availabilityStatus");
      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "available" && "bg-green-500/40",
            status === "in-use" && "bg-yellow-500/40",
            status === "maintenance" && "bg-red-500/40"
          )}
        >
          {status as string}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const truck = row.original;
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
              onClick={() => navigator.clipboard.writeText(truck.id)}
            >
              Copy Truck ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View truck details</DropdownMenuItem>
            <DropdownMenuItem>Update truck status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
