# Repair Tracker

A repair tracking app for managing customer repair tickets. Built with React, Supabase, and Tailwind CSS.

## Getting Started

1. Click `New Repair` to create a ticket
2. Fill in the ticket ID (e.g. `TKT-100`), pick a date, enter the customer name, and list the items being repaired (*comma-separated*)
3. Optionally add specs and set a status
4. Click `Create Repair` to save

## Managing Repairs

- **Edit** a repair by hovering over a row and clicking the pencil icon
- **Delete** a repair by hovering over a row and clicking the trash icon — you'll be asked to confirm
- **Change status** directly from the table by clicking the status badge on any row and selecting from the dropdown

### Statuses

| Status | Meaning |
| --- | --- |
| `Pending` | Repair has been received but not started |
| `In Progress` | Actively being worked on |
| `Done` | Repair is complete, awaiting pickup |
| `Picked Up` | Customer has collected their items |

When a repair is marked as `Picked Up`, the pickup date is recorded automatically.

## Filtering and Search

- Click any status card at the top to filter the table to that status.
  - Click the pill next to the search bar to clear the filter.
- Type in the search bar to search across ticket IDs, customer names, items, and specs.

## Bulk Actions

- Click anywhere on a row to select it, or use the checkbox
- Use the checkbox in the header to select/deselect all visible rows
- When rows are selected, a `Remove Row` / `Remove All` button appears to delete them all at once (*with confirmation*)

## Date Picker

The date field uses a calendar picker. Navigate between months with the arrow buttons. If you've scrolled away from the current month, a `Today` button appears to jump back.

## Export to Spreadsheet

By selecting the `Export to Spreadsheet` button, if on Chrome/Edge, you'll be prompted to choose a location and filename for a spreadsheet export of the currently visible repairs (*respecting any filters/search*). If your browser doesn't support the file picker API (*Firefox, Safari*), the spreadsheet file will be downloaded to your default downloads folder, with the name of `repair-tracker-<timestamp>.xlsx`.
