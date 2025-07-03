// src/app/pacientes/patient-data-table.tsx
'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { AddPatientDialog } from '@/components/pacientes/AddPatientDialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  showControls?: boolean; // ← nova prop opcional
}

export function PatientDataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  showControls = true, // ← valor padrão
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const currentPage = Number(searchParams.get('page')) || 1;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    pageCount: pageCount,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: 10,
      },
    },
  });

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      if (name !== 'page') params.set('page', '1');
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div>
      {showControls && (
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filtrar por nome..."
            defaultValue={searchParams.get('query') || ''}
            onChange={(event) => {
              const handler = setTimeout(() => {
                router.push(`${pathname}?${createQueryString('query', event.target.value)}`);
              }, 500);
              return () => clearTimeout(handler);
            }}
            className="max-w-sm"
          />
          <AddPatientDialog />
        </div>
      )}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`${pathname}?${createQueryString('page', String(currentPage - 1))}`)}
          disabled={currentPage <= 1}
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`${pathname}?${createQueryString('page', String(currentPage + 1))}`)}
          disabled={currentPage >= pageCount}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
