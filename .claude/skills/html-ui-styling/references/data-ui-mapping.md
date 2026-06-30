# data-ui Mapping — shadcn Migration Layer

## Rule

Every structural element MUST carry a `data-ui` attribute alongside its Tailwind utility classes. Never replace utility classes — always ADD `data-ui` as a co-existing attribute.

```html
<!-- ✅ CORRECT -->
<div class="bg-card border border-border-primary p-4 flex flex-col gap-3" data-ui="card">
  <div class="flex items-start justify-between" data-ui="card-header">...</div>
  <div class="flex items-start justify-between grow" data-ui="card-content">...</div>
  <div class="flex items-center justify-between pt-1 border-t border-border-primary" data-ui="card-footer">...</div>
</div>

<!-- ❌ WRONG — utility classes removed -->
<div data-ui="card">

<!-- ❌ WRONG — surface token on card -->
<div class="bg-background-primary border border-border-primary p-4" data-ui="card">
```

## Mapping Table

| `data-ui` value | shadcn Component |
|---|---|
| `card` | `<Card>` |
| `card-header` | `<CardHeader>` |
| `card-content` | `<CardContent>` |
| `card-footer` | `<CardFooter>` |
| `card-title` | `<CardTitle>` |
| `card-description` | `<CardDescription>` |
| `btn-primary` | `<Button variant="default">` |
| `btn-secondary` | `<Button variant="secondary">` |
| `btn-outline` | `<Button variant="outline">` |
| `btn-ghost` | `<Button variant="ghost">` |
| `btn-destructive` | `<Button variant="destructive">` |
| `btn-icon` | `<Button size="icon">` |
| `input-field` | `<Input>` |
| `textarea-field` | `<Textarea>` |
| `select-field` | `<Select>` |
| `checkbox-field` | `<Checkbox>` |
| `switch-field` | `<Switch>` |
| `label-field` | `<Label>` |
| `form-item` | `<FormItem>` |
| `form-message` | `<FormMessage>` |
| `badge` | `<Badge>` |
| `badge-secondary` | `<Badge variant="secondary">` |
| `alert` | `<Alert>` |
| `alert-destructive` | `<Alert variant="destructive">` |
| `progress-bar` | `<Progress>` |
| `skeleton` | `<Skeleton>` |
| `separator` | `<Separator>` |
| `avatar` | `<Avatar>` |
| `tabs-root` | `<Tabs>` |
| `tab-trigger` | `<TabsTrigger>` |
| `tab-content` | `<TabsContent>` |
| `dialog` | `<Dialog>` |
| `dialog-content` | `<DialogContent>` |
| `dialog-header` | `<DialogHeader>` |
| `dialog-footer` | `<DialogFooter>` |
| `sheet` | `<Sheet>` |
| `popover` | `<Popover>` |
| `tooltip` | `<Tooltip>` |
| `dropdown-menu` | `<DropdownMenu>` |
| `nav-menu` | `<NavigationMenu>` |
| `breadcrumb` | `<Breadcrumb>` |
| `pagination` | `<Pagination>` |
| `accordion` | `<Accordion>` |
| `data-table` | `<Table>` |
| `table-head` | `<TableHead>` |
| `table-row` | `<TableRow>` |
| `table-cell` | `<TableCell>` |
| `sidebar` | `<Sidebar>` |

## Extra `data-*` for Props Mapping

Add these alongside `data-ui` to pre-declare shadcn props:

```html
<!-- variant & size hints -->
<button data-ui="btn-primary" data-variant="default" data-size="sm" class="...">Save</button>

<!-- state hints -->
<input data-ui="input-field" data-state="error" class="..." />
<div data-ui="alert-destructive" data-variant="destructive" class="...">

<!-- layout hints for complex components -->
<div data-ui="tabs-root" data-default-value="overview" class="...">
  <button data-ui="tab-trigger" data-value="overview" class="...">Overview</button>
  <div data-ui="tab-content" data-value="overview" class="...">...</div>
</div>
```

These attributes are stripped by the browser (no visual effect) but give the React converter exact props without guesswork.
