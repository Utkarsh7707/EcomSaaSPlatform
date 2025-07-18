"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string
  name: string
  value : string
  createdAt : string
}

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell : ({row}) => (
      <div className="flex items-center gap-x-2">
        <div className="h-6 w-6 rounded-full border" style={{backgroundColor : row.original.value}}/>
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id :"actions",
    cell : ({row})=><CellAction data={row.original}/>
  }
]
