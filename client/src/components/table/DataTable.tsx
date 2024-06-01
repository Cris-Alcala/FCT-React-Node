import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import React, { useState } from "react";

type DataTableProps = {
  data: any[];
  pages?: number;
  page?: number;
  columns: any[];
  description?: string;
  label?: string;
  name: string | React.ReactNode;
  searchable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  rowHeight?: string;
  onSearch?: (search: string) => void;
  onRowClick?: (row: any) => void;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  emptyLogo?: React.ReactNode;
  extraButtons?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

const DataTable = ({
  name,
  data,
  pages,
  page,
  searchable,
  loading,
  emptyMessage,
  columns,
  rowHeight,
  extraButtons,
  onNextPage,
  onPreviousPage,
  onSearch,
  onRowClick,
  emptyLogo,
}: DataTableProps) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    { id: string; direction: "asc" | "desc" } | undefined
  >(undefined);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        {typeof name === "string" ? (
          <div className="flex flex-row items-center flex-1">
            <h1 className="font-cal text-2xl font-bold dark:text-white">
              {name}
            </h1>
          </div>
        ) : name ? (
          name
        ) : null}
        <div className="flex-1 relative">
          {searchable ? (
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                onSearch && onSearch(search);
              }}
              className="relative"
            >
              <Button
                type="submit"
                variant={"ghost"}
                size="icon"
                className="absolute top-0 left-0 z-10"
              >
                <Search size={16} />
              </Button>

              <Input
                value={search}
                onChange={(ev) => setSearch(ev.target.value)}
                id="search"
                name="search"
                type="text"
                className="relative z-0 w-full px-8"
                placeholder={"Buscar..."}
              />
              {search ? (
                <Button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    onSearch && onSearch("");
                  }}
                  variant={"ghost"}
                  size="icon"
                  className="absolute top-0 right-0 z-10"
                >
                  <X size={16} />
                </Button>
              ) : null}
            </form>
          ) : null}
        </div>

        {extraButtons ? <div>{extraButtons}</div> : null}
      </div>
      <Card>
        <CardContent className="p-0">
          <Table className="table-auto">
            <TableHeader>
              <TableRow>
                {columns.map((x, index) => {
                  return (
                    <TableHead
                      onClick={() => {
                        if (x.onSort) {
                          const id = x.id || x.accessor;
                          if (sort?.id === id) {
                            if (sort?.direction === "asc") {
                              setSort({ id: id, direction: "desc" });
                            } else {
                              setSort(undefined);
                            }
                          } else {
                            setSort({ id: id, direction: "asc" });
                          }
                          x.onSort(sort?.direction === "asc" ? "desc" : "asc");
                        }
                      }}
                      {...x.headerProps}
                      className={cn(
                        x.headerProps?.className || "",
                        x.onSort ? "cursor-pointer" : ""
                      )}
                      key={index}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex-1">{x.header}</div>
                        {x.onSort && (
                          <SortIndicator
                            selected={sort?.id === (x.id || x.accessor)}
                            direction={sort?.direction || "asc"}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center"
                  >
                    <div className="flex flex-col items-center justify-center py-40 gap-3">
                      {emptyLogo}
                      {emptyMessage ? (
                        <p className="text-gray-500">{emptyMessage}</p>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ) : loading ? (
                Array.from(Array(10).keys()).map((_, index) => {
                  return (
                    <TableRow key={index}>
                      {columns.map((y, index) => {
                        return (
                          <TableCell {...y.cellProps} key={index}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                data?.map((x) => {
                  return (
                    <TableRow
                      onClick={() => (onRowClick ? onRowClick(x) : null)}
                      className={cn(onRowClick ? "cursor-pointer" : "")}
                      key={x.id}
                    >
                      {columns.map((y, index) => {
                        return (
                          <TableCell
                            style={{
                              height: rowHeight,
                              minHeight: rowHeight,
                              maxHeight: rowHeight,
                            }}
                            {...y.cellProps}
                            key={`row:${x.id}:col:${index}`}
                          >
                            {y.cell ? y.cell(x) : x[y.accessor]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* PAGINATION BLOCK */}

          {pages ? (
            <div className="flex flex-row border-t-2 p-2">
              <div className="flex-1"></div>
              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="select-none text-sm">
                  {page || 1} / {pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={page === pages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTable;

const SortIndicator = ({
  direction,
  selected,
}: {
  selected: boolean;
  direction: "asc" | "desc";
}) => {
  return direction === "asc" ? (
    <ArrowUp size={16} className={selected ? "opacity-100" : "opacity-0"} />
  ) : (
    <ArrowDown size={16} className={selected ? "opacity-100" : "opacity-0"} />
  );
};
