'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FisheriesDataTable from './data-table';

export default function FisheriesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Fish Types</h1>
          <p className="text-muted-foreground">Manage fish types</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Fish Type
        </Button>
      </div>
      <div className="bg-white rounded-lg border">
        <FisheriesDataTable />
      </div>
    </div>
  );
}