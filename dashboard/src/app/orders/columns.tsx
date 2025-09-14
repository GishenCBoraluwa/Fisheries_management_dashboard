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

export type FishOrder = {
  orderId: string;
  fishTypeId: string;
  quantityKg: number;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: "confirmed" | "pending" | "delivered" | "cancelled";
};

const fishTypeMap: { [key: string]: string } = {
  "1": "Yellowfin Tuna (Kelawalla)",
  "2": "Sailfish (Thalapath)",
  "3": "Skipjack Tuna (Balaya)",
  "4": "Trevally (Paraw)",
  "5": "Sardinella (Salaya)",
  "6": "Herrings (Hurulla)",
  "7": "Indian Scad (Linna)",
};

export const columns: ColumnDef<FishOrder>[] = [
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
    accessorKey: "orderId",
    header: "Order ID",
  },
  {
    accessorKey: "fishTypeId",
    header: "Fish Type",
    cell: ({ row }) => {
      const fishTypeId = row.getValue("fishTypeId") as string;
      return <div>{fishTypeMap[fishTypeId] || fishTypeId}</div>;
    },
  },
  {
    accessorKey: "quantityKg",
    header: "Quantity (kg)",
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantityKg"));
      return <div>{quantity.toFixed(2)} kg</div>;
    },
  },
  {
    accessorKey: "orderDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Order Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("orderDate"));
      return <div>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>;
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date",
    cell: ({ row }) => {
      const date = row.getValue("deliveryDate");
      return <div>{date as string}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "LKR",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            status === "confirmed" && "bg-green-500/40",
            status === "delivered" && "bg-blue-500/40",
            status === "cancelled" && "bg-orange-500/40",
            status === "pending" && "bg-yellow-500/40"
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
      const order = row.original;
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
              onClick={() => navigator.clipboard.writeText(order.orderId)}
            >
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View order details</DropdownMenuItem>
            <DropdownMenuItem>View customer details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];