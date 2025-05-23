# DataTable Component

A reusable table component that can be used across different features to maintain DRY principles.

## Features

- Customizable columns with various display options
- Search functionality with configurable search fields
- Row actions (view, edit, delete) with dropdown menu
- Delete confirmation dialog with error handling and loading states
- Responsive design with desktop and mobile views
- Empty state customization
- Row click handling for navigation

## Usage

```tsx
import { DataTable } from "@/components/ui/data-table"
import { Edit, Trash } from "lucide-react"

// Define your columns
const columns = [
  {
    header: "Name",
    accessorKey: "name",
    className: "font-medium"
  },
  {
    header: "Email",
    accessorKey: "email"
  },
  // Add more columns as needed
]

// Define your actions
const actions = [
  {
    label: "Edit",
    icon: <Edit className="h-4 w-4" />,
    onClick: (item) => router.push(`/dashboard/items/${item.id}/edit`)
  },
  {
    label: "Delete",
    icon: <Trash className="h-4 w-4" />,
    className: "text-red-600",
    onClick: (item) => {
      setItemToDelete(item.id)
      setDeleteDialogOpen(true)
    }
  }
]

// Use the DataTable component
return (
  <DataTable
    data={items}
    columns={columns}
    actions={actions}
    searchPlaceholder="Search items..."
    searchFields={["name", "email"]}
    onRowClick={(item) => router.push(`/dashboard/items/${item.id}`)}
    deleteAction={{
      title: "Are you sure?",
      description: "This action cannot be undone. This will permanently delete the item and all associated data.",
      onDelete: handleDelete,
      isDeleting: isDeleting,
      deleteError: deleteError
    }}
  />
)
```

## Props

### DataTableProps<T>

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | The data to display in the table |
| `columns` | `Column<T>[]` | The columns to display in the table |
| `actions` | `Action<T>[]` | The actions to display for each row |
| `idField` | `keyof T` | The field to use as the unique identifier for each row (default: "id") |
| `onRowClick` | `(item: T) => void` | The function to call when a row is clicked |
| `searchPlaceholder` | `string` | The placeholder text for the search input |
| `searchFields` | `(keyof T)[]` | The fields to search when filtering the data |
| `emptyState` | `React.ReactNode` | The content to display when there is no data |
| `deleteAction` | `DeleteAction` | The configuration for the delete action |

### Column<T>

| Prop | Type | Description |
|------|------|-------------|
| `header` | `string` | The header text for the column |
| `accessorKey` | `keyof T \| ((item: T) => React.ReactNode)` | The key to access the data or a function to render the cell |
| `cell` | `(item: T) => React.ReactNode` | A function to render the cell content |
| `className` | `string` | Additional CSS classes for the cell |
| `hide` | `"mobile" \| "never" \| "always"` | When to hide the column |

### Action<T>

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | The label for the action |
| `icon` | `React.ReactNode` | The icon to display for the action |
| `onClick` | `(item: T) => void` | The function to call when the action is clicked |
| `className` | `string` | Additional CSS classes for the action |

### DeleteAction

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | The title for the delete confirmation dialog |
| `description` | `string` | The description for the delete confirmation dialog |
| `onDelete` | `(id: string) => Promise<void> \| void` | The function to call when the delete action is confirmed |
| `isDeleting` | `boolean` | Whether the delete action is in progress |
| `deleteError` | `string \| null` | The error message to display if the delete action fails |