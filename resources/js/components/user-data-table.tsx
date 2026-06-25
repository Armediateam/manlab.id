import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
    
    
    
} from '@tanstack/react-table';
import type {ColumnDef, SortingState, VisibilityState} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns,
    EllipsisVertical,
    Plus,
    Search,
    KeyRound,
    TriangleAlert,
    Shield,
    UserCheck,
} from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const userSchema = z.object({
    id: z.number(),
    loginId: z.string().min(3, 'ID must be at least 3 characters'),
    name: z.string().min(1, 'Name is required'),
    hp: z.string().min(8, 'Phone number is required'),
    authority: z.enum(['Admin', 'User']),
    createdAt: z.string(),
    passwordInitialized: z.boolean(),
});

export type UserRecord = z.infer<typeof userSchema>;

const sampleUsers: UserRecord[] = [
    {
        id: 1,
        loginId: 'admin_mandor',
        name: 'Super Admin',
        hp: '081234567890',
        authority: 'Admin',
        createdAt: '2026-06-01 10:00:00',
        passwordInitialized: true,
    },
    {
        id: 2,
        loginId: 'user_john',
        name: 'John Doe',
        hp: '085799887766',
        authority: 'User',
        createdAt: '2026-06-15 14:30:25',
        passwordInitialized: false,
    },
    {
        id: 3,
        loginId: 'user_jane',
        name: 'Jane Smith',
        hp: '081122334455',
        authority: 'User',
        createdAt: '2026-06-20 09:15:10',
        passwordInitialized: true,
    },
];

function AuthorityBadge({ value }: { value: UserRecord['authority'] }) {
    if (value === 'Admin') {
        return (
            <Badge variant="outline" className="border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 gap-1 font-semibold">
                <Shield className="size-3" />
                Admin
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 gap-1 font-semibold">
            <UserCheck className="size-3" />
            User
        </Badge>
    );
}

function ActionMenu({
    user,
    onEdit,
    onInitializePassword,
    onDelete,
}: {
    user: UserRecord;
    onEdit: (user: UserRecord) => void;
    onInitializePassword: (user: UserRecord) => void;
    onDelete: (user: UserRecord) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground"
                >
                    <EllipsisVertical className="size-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => onEdit(user)}
                >
                    Edit User
                </DropdownMenuItem>
                {!user.passwordInitialized && (
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => onInitializePassword(user)}
                    >
                        Initialize Password (0000)
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer font-semibold text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-400"
                    onSelect={() => onDelete(user)}
                >
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function createColumns({
    onEdit,
    onInitializePassword,
    onDelete,
}: {
    onEdit: (user: UserRecord) => void;
    onInitializePassword: (user: UserRecord) => void;
    onDelete: (user: UserRecord) => void;
}): ColumnDef<UserRecord>[] {
    return [
        {
            accessorKey: 'loginId',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono font-medium">{row.original.loginId}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Nama',
            cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
        },
        {
            accessorKey: 'hp',
            header: 'HP',
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.hp}</span>,
        },
        {
            accessorKey: 'authority',
            header: 'Authority',
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center">
                        <AuthorityBadge value={row.original.authority} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                        {row.original.authority === 'Admin'
                            ? 'Can add new Member'
                            : 'Can control all Menu'}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'passwordInitialized',
            header: 'Password Status',
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex items-center gap-2">
                        {user.passwordInitialized ? (
                            <Badge variant="outline" className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 font-semibold">
                                Initialized (0000)
                            </Badge>
                        ) : (
                            <>
                                <Badge variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 font-semibold">
                                    Customized
                                </Badge>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onInitializePassword(user)}
                                    className="h-7 text-xs px-2 gap-1"
                                >
                                    <KeyRound className="size-3" />
                                    Init to 0000
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Register Date',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.createdAt}</span>,
        },
        {
            id: 'actions',
            header: () => null,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <ActionMenu
                        user={row.original}
                        onEdit={onEdit}
                        onInitializePassword={onInitializePassword}
                        onDelete={onDelete}
                    />
                </div>
            ),
            enableHiding: false,
        },
    ];
}

// ─── Add User Dialog ──────────────────────────────────────────────────────────
const emptyForm = {
    loginId: '',
    name: '',
    hp: '',
    authority: 'User' as UserRecord['authority'],
};

function AddUserDialog({ onAdd }: { onAdd: (user: UserRecord) => void }) {
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState(emptyForm);
    const [errors, setErrors] = React.useState<Partial<typeof emptyForm>>({});

    function handleChange<K extends keyof typeof emptyForm>(
        field: K,
        value: (typeof emptyForm)[K],
    ) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate() {
        const errs: Partial<typeof emptyForm> = {};

        if (!form.loginId.trim() || form.loginId.length < 3) {
            errs.loginId = 'ID must be at least 3 characters' as any;
        }

        if (!form.name.trim()) {
            errs.name = 'Name is required' as any;
        }

        if (!form.hp.trim() || form.hp.length < 8) {
            errs.hp = 'HP must be at least 8 digits' as any;
        }

        return errs;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const errs = validate();

        if (Object.keys(errs).length > 0) {
            setErrors(errs);

            return;
        }

        const now = new Date();
        const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);

        onAdd({
            id: Date.now(),
            ...form,
            createdAt: formattedDate,
            passwordInitialized: true, // New user password initialized to "0000" by default
        });
        setForm(emptyForm);
        setErrors({});
        setOpen(false);
    }

    function handleOpenChange(v: boolean) {
        setOpen(v);

        if (!v) {
            setForm(emptyForm);
            setErrors({});
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Add User</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new member. Default password is "0000".
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="add-loginId">ID <span className="text-destructive">*</span></Label>
                        <Input
                            id="add-loginId"
                            placeholder="e.g. user_john"
                            value={form.loginId}
                            onChange={(e) => handleChange('loginId', e.target.value)}
                        />
                        {errors.loginId && (
                            <span className="text-xs text-destructive">{errors.loginId}</span>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="add-name">Nama <span className="text-destructive">*</span></Label>
                        <Input
                            id="add-name"
                            placeholder="e.g. John Doe"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-xs text-destructive">{errors.name}</span>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="add-hp">HP <span className="text-destructive">*</span></Label>
                        <Input
                            id="add-hp"
                            placeholder="e.g. 08123456789"
                            value={form.hp}
                            onChange={(e) => handleChange('hp', e.target.value)}
                        />
                        {errors.hp && (
                            <span className="text-xs text-destructive">{errors.hp}</span>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="add-authority">Authority</Label>
                        <Select
                            value={form.authority}
                            onValueChange={(val) => handleChange('authority', val as UserRecord['authority'])}
                        >
                            <SelectTrigger id="add-authority" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin (Can add new Member)</SelectItem>
                                <SelectItem value="User">User (Can control all Menu)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Add User</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Edit User Dialog ─────────────────────────────────────────────────────────
function EditUserDialog({
    user,
    open,
    onOpenChange,
    onSave,
}: {
    user: UserRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (user: UserRecord) => void;
}) {
    const [form, setForm] = React.useState<UserRecord | null>(user);

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(user);
    }, [user]);

    if (!form) {
return null;
}

    function handleChange<K extends keyof UserRecord>(key: K, value: UserRecord[K]) {
        setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (form) {
            onSave(form);
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Modify user details and authority roles.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label>ID (Read-only)</Label>
                        <Input value={form.loginId} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-name">Nama</Label>
                        <Input
                            id="edit-name"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-hp">HP</Label>
                        <Input
                            id="edit-hp"
                            value={form.hp}
                            onChange={(e) => handleChange('hp', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-authority">Authority</Label>
                        <Select
                            value={form.authority}
                            onValueChange={(val) => handleChange('authority', val as UserRecord['authority'])}
                        >
                            <SelectTrigger id="edit-authority" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin (Can add new Member)</SelectItem>
                                <SelectItem value="User">User (Can control all Menu)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────
function DeleteDialog({
    user,
    open,
    onOpenChange,
    onConfirm,
}: {
    user: UserRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: () => void;
}) {
    if (!user) {
return null;
}

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <TriangleAlert className="size-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Delete user{' '}
                    <span className="font-semibold text-foreground">
                        {user.name} ({user.loginId})
                    </span>
                    ?
                </p>
                <DialogFooter className="pt-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function UserDataTable({
    data: initialData = sampleUsers,
}: {
    data?: UserRecord[];
}) {
    const [data, setData] = React.useState<UserRecord[]>(initialData);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [editTarget, setEditTarget] = React.useState<UserRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = React.useState<UserRecord | null>(null);

    function handleAdd(newUser: UserRecord) {
        setData((prev) => [newUser, ...prev]);
    }

    function handleSave(updated: UserRecord) {
        setData((prev) =>
            prev.map((user) => (user.id === updated.id ? updated : user))
        );
    }

    function handleInitializePassword(user: UserRecord) {
        setData((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, passwordInitialized: true } : u))
        );
    }

    function handleDelete() {
        if (!deleteTarget) {
return;
}

        setData((prev) => prev.filter((user) => user.id !== deleteTarget.id));
        setDeleteTarget(null);
    }

    const columns = React.useMemo(
        () =>
            createColumns({
                onEdit: setEditTarget,
                onInitializePassword: handleInitializePassword,
                onDelete: setDeleteTarget,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                    <Input
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        placeholder="Search users..."
                        className="pl-8"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Columns className="size-4" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AddUserDialog onAdd={handleAdd} />
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-card">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} user(s)
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="size-4" />
                    </Button>
                </div>
            </div>

            <EditUserDialog
                user={editTarget}
                open={Boolean(editTarget)}
                onOpenChange={(open) => !open && setEditTarget(null)}
                onSave={handleSave}
            />
            <DeleteDialog
                user={deleteTarget}
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
