import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import React, { Key, useCallback, useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { Tables } from "~/types/supabase";
import { capitalize } from "../utils/client";

const columns = [
  //   { name: "ID", uid: "id", sortable: true },
  //   { name: "URL", uid: "url", sortable: true },
  { name: "DETAILS", uid: "url_details", sortable: true },
  { name: "URL", uid: "url", sortable: true },
  { name: "STATUS", uid: "draft", sortable: true },
  { name: "TYPE", uid: "store_type", sortable: true },
  { name: "", uid: "actions" },
];

const statusOptions = [
  { name: "PUBLISHED", uid: "false" },
  { name: "DRAFT", uid: "true" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  false: "success",
  true: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "url_details",
  "url",
  "type",
  "draft",
  "actions",
];

type Url = Tables<"urls"> & { url_details: Tables<"url_details"> | null };

export type DashboardTableProps = {
  urls: Url[];
};

export default function DashboardTable({ urls }: DashboardTableProps) {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const navigate = useNavigate();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUrls = [...urls];

    if (hasSearchFilter) {
      filteredUrls = filteredUrls.filter((url) =>
        url.url.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUrls = filteredUrls.filter((url) =>
        Array.from(statusFilter).includes(url.draft.toString())
      );
    }

    return filteredUrls;
  }, [urls, hasSearchFilter, statusFilter, filterValue]);

  const items = filteredItems;

  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a: Omit<Url, "url_details">, b: Omit<Url, "url_details">) => {
        const first =
          a[sortDescriptor.column as keyof Omit<Url, "url_details">];
        const second =
          b[sortDescriptor.column as keyof Omit<Url, "url_details">];
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
      }
    );
  }, [sortDescriptor, items]);

  const renderCell = useCallback((url: Url, columnKey: Key) => {
    const cellValue = url[columnKey as keyof Url];

    const urlDetails = url.url_details;

    switch (columnKey) {
      case "url":
        return (
          <Link
            isExternal
            href={`/page/${cellValue}`}
            showAnchorIcon
            isDisabled={url.draft}
          >
            {cellValue as string}.link.go
          </Link>
        );
      case "url_details":
        return urlDetails ? (
          <User
            avatarProps={{
              radius: "lg",
              src: urlDetails.homepage_logo,
            }}
            description={urlDetails.description.substring(0, 50).concat("...")}
            name={urlDetails.store_name}
          >
            {urlDetails.store_name}
          </User>
        ) : (
          <p>None</p>
        );
      case "draft":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[url.draft.toString()]}
            size="sm"
            variant="flat"
          >
            {cellValue ? "Draft" : "Published"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <BsThreeDotsVertical
                    color="currentColor"
                    className="text-default-300"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
                <DropdownItem>Publish</DropdownItem>
                {/* <DropdownItem>Delete</DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue?.toString();
    }
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<IoSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FiChevronDown className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<FiChevronDown className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<FiPlus />}>
              Add New
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, statusFilter, visibleColumns, onClear]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
      onRowAction={(key) => navigate(`${key}/details`)}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No urls found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
