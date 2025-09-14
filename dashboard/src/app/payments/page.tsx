'use client';

import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, CreditCard, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'mobile_payment';
  transactionDate: string;
  description: string;
}

const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    customerId: "CUST-001",
    customerName: "John Silva",
    amount: 15000,
    currency: "LKR",
    status: "completed",
    paymentMethod: "card",
    transactionDate: "2025-09-13T14:30:00Z",
    description: "Payment for fresh tuna delivery"
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    customerId: "CUST-002",
    customerName: "Mary Fernando",
    amount: 8500,
    currency: "LKR",
    status: "pending",
    paymentMethod: "bank_transfer",
    transactionDate: "2025-09-13T12:15:00Z",
    description: "Payment for mixed fish order"
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    customerId: "CUST-003",
    customerName: "David Perera",
    amount: 12300,
    currency: "LKR",
    status: "completed",
    paymentMethod: "mobile_payment",
    transactionDate: "2025-09-12T16:45:00Z",
    description: "Payment for bulk fish order"
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    customerId: "CUST-004",
    customerName: "Sarah Jayawardene",
    amount: 5200,
    currency: "LKR",
    status: "failed",
    paymentMethod: "card",
    transactionDate: "2025-09-12T09:20:00Z",
    description: "Payment for small fish selection"
  },
  {
    id: "PAY-005",
    orderId: "ORD-005",
    customerId: "CUST-005",
    customerName: "Michael Rodrigo",
    amount: 18700,
    currency: "LKR",
    status: "refunded",
    paymentMethod: "card",
    transactionDate: "2025-09-11T11:30:00Z",
    description: "Refunded - quality issues"
  }
];

const getStatusColor = (status: string) => {
  const colors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getMethodIcon = (method: string) => {
  switch (method) {
    case 'card': return '💳';
    case 'bank_transfer': return '🏦';
    case 'cash': return '💵';
    case 'mobile_payment': return '📱';
    default: return '💰';
  }
};

export default function PaymentsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredPayments = mockPayments.filter(payment => {
    const statusMatch = statusFilter === 'all' || payment.status === statusFilter;
    const methodMatch = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return statusMatch && methodMatch;
  });

  const stats = {
    total: mockPayments.length,
    completed: mockPayments.filter(p => p.status === 'completed').length,
    pending: mockPayments.filter(p => p.status === 'pending').length,
    failed: mockPayments.filter(p => p.status === 'failed').length,
    refunded: mockPayments.filter(p => p.status === 'refunded').length,
    totalAmount: mockPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
          <p className="text-muted-foreground">
            Track and manage all payment transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalAmount, 'LKR')}
            </div>
            <p className="text-xs text-muted-foreground">From completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Transaction errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.refunded}</div>
            <p className="text-xs text-muted-foreground">Money returned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.completed / stats.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest payment transactions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getMethodIcon(payment.paymentMethod)}</span>
                    <div>
                      <div className="font-medium">{payment.id}</div>
                      <div className="text-sm text-muted-foreground">
                        Order: {payment.orderId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <div className="font-medium">{payment.customerName}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(payment.transactionDate)}
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.toUpperCase()}
                  </Badge>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    {payment.status === 'failed' && (
                      <Button variant="outline" size="sm">
                        Retry
                      </Button>
                    )}
                    {payment.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Refund
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution of payment methods used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['card', 'bank_transfer', 'mobile_payment', 'cash'].map(method => {
                const count = mockPayments.filter(p => p.paymentMethod === method).length;
                const percentage = (count / mockPayments.length * 100).toFixed(1);
                return (
                  <div key={method} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{getMethodIcon(method)}</span>
                      <span className="capitalize">{method.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest payment-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span>Payment PAY-001 completed successfully</span>
                <span className="text-muted-foreground ml-auto">2h ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                <span>Bank transfer PAY-002 pending verification</span>
                <span className="text-muted-foreground ml-auto">4h ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                <span>Card payment PAY-004 failed</span>
                <span className="text-muted-foreground ml-auto">1d ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <span>Refund processed for PAY-005</span>
                <span className="text-muted-foreground ml-auto">2d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}