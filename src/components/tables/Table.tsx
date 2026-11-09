import React from 'react';
import { EmptyState } from '../common/EmptyState';

export interface Column<T> {
  header: string;
  headerTe?: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching this criteria.',
  isLoading = false,
  onRowClick,
  className = '',
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-forest-100 p-8 text-center">
        <div className="inline-block w-8 h-8 border-3 border-forest-800 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-ink-muted">Loading table records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-forest-100 p-6">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden bg-white rounded-2xl border border-forest-100 shadow-nature ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-forest-50/70 border-b border-forest-100 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-4 sm:px-6 py-3.5 ${col.className || ''}`}
                >
                  <div className="flex flex-col">
                    <span>{col.header}</span>
                    {col.headerTe && (
                      <span className="text-[11px] font-telugu text-forest-700 font-medium normal-case tracking-normal">
                        {col.headerTe}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-100/60 text-sm">
            {data.map((item) => {
              const key = keyExtractor(item);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors hover:bg-forest-50/40 ${
                    onRowClick ? 'cursor-pointer active:bg-forest-100/50' : ''
                  }`}
                >
                  {columns.map((col, cIndex) => (
                    <td
                      key={cIndex}
                      className={`px-4 sm:px-6 py-4 text-ink ${col.className || ''}`}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? (item[col.accessorKey] as unknown as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
