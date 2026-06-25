import { router, usePage } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
    
    
    
    
} from '@tanstack/react-table';
import type {ColumnDef, ColumnFiltersState, SortingState, VisibilityState} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns,
    EllipsisVertical,
    Plus,
    Search,
    ChevronDown,
    Mail,
    Phone,
    MessageSquare,
    FileText,
    X,
    UserPlus,
    Eye,
    Pencil,
    Trash2,
    TriangleAlert,
} from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';

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
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
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
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export const customerSchema = z.object({
    id: z.number(),
    no: z.number(),
    name: z.string(),
    nickOrCompany: z.string(),
    type: z.enum(['WA', 'Mail', 'WA/Mail']),
    hpForWa: z.string(),
    mail: z.string(),
    requestType: z.string(),
    requestQuotation: z.string(),
    consultingReply: z.string(),
    withdrawal: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>;

// ─── Badges ───────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: Customer['type'] }) {
    const map: Record<Customer['type'], { label: string; cls: string }> = {
        WA: {
            label: 'WA',
            cls: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
        },
        Mail: {
            label: 'Mail',
            cls: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
        },
        'WA/Mail': {
            label: 'WA/Mail',
            cls: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
        },
    };
    const { label, cls } = map[type];

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}
        >
            {label}
        </span>
    );
}

function RequestTypeBadge({ value }: { value: string }) {
    const isAuto = value.includes('AUTO');

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${
                isAuto
                    ? 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400'
            }`}
        >
            {isAuto ? (
                <MessageSquare className="size-3" />
            ) : (
                <FileText className="size-3" />
            )}
            {value}
        </span>
    );
}

// ─── View Dialog ──────────────────────────────────────────────────────────────
function ViewDialog({
    customer,
    open,
    onOpenChange,
}: {
    customer: Customer | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    if (!customer) {
return null;
}

    const rows: { label: string; value: React.ReactNode }[] = [
        {
            label: 'NO',
            value: <span className="font-mono">{customer.no}</span>,
        },
        {
            label: 'Name',
            value: <span className="font-medium">{customer.name}</span>,
        },
        {
            label: 'Nick or Company',
            value: customer.nickOrCompany || (
                <span className="text-muted-foreground italic">—</span>
            ),
        },
        { label: 'Type', value: <TypeBadge type={customer.type} /> },
        {
            label: 'HP for WA',
            value: (
                <span className="font-mono text-sm">
                    {customer.hpForWa === '-' ? '—' : customer.hpForWa}
                </span>
            ),
        },
        {
            label: 'Mail',
            value: (
                <a
                    href={`mailto:${customer.mail}`}
                    className="text-primary hover:underline"
                >
                    {customer.mail}
                </a>
            ),
        },
        {
            label: 'Request Type',
            value: <RequestTypeBadge value={customer.requestType} />,
        },
        {
            label: 'Request Quotation',
            value: (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {customer.requestQuotation}
                </span>
            ),
        },
        {
            label: 'Consulting/Reply',
            value: (
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {customer.consultingReply}
                </span>
            ),
        },
        {
            label: 'Withdrawal',
            value: customer.withdrawal ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <X className="size-3" />
                    {customer.withdrawal}
                </span>
            ) : (
                <span className="text-xs text-muted-foreground italic">—</span>
            ),
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                            <Eye className="size-5 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                            <DialogTitle>Customer Detail</DialogTitle>
                            <DialogDescription>
                                Viewing record #{customer.no}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="flex flex-col gap-3 py-1">
                    {rows.map(({ label, value }) => (
                        <div
                            key={label}
                            className="grid grid-cols-[10rem_1fr] items-start gap-2 text-sm"
                        >
                            <span className="text-muted-foreground">
                                {label}
                            </span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Edit Dialog ──────────────────────────────────────────────────────────────
function EditDialog({
    customer,
    open,
    onOpenChange,
    onSave,
}: {
    customer: Customer | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (updated: Customer, options?: any) => void;
}) {
    const [form, setForm] = React.useState<Partial<Customer>>({});
    const [errors, setErrors] = React.useState<{
        name?: string;
        mail?: string;
    }>({});
    const { errors: serverErrors } = usePage().props as any;

    const displayErrors = {
        name: errors.name || serverErrors?.name,
        mail: errors.mail || serverErrors?.mail || serverErrors?.email,
        hpForWa: serverErrors?.hp_for_wa,
        nickOrCompany: serverErrors?.nick_or_company,
        type: serverErrors?.type,
    };

    React.useEffect(() => {
        if (customer) {
            setForm({ ...customer });
        }
    }, [customer]);

    if (!customer) {
        return null;
    }

    function handleChange(field: keyof Customer, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate() {
        const errs: { name?: string; mail?: string } = {};

        if (!form.name?.trim()) {
            errs.name = 'Name is required';
        }

        if (!form.mail?.trim()) {
            errs.mail = 'Email is required';
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

        onSave({ ...customer, ...form } as Customer, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <Pencil className="size-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <DialogTitle>Edit Customer</DialogTitle>
                            <DialogDescription>
                                Editing record #{customer.no} — {customer.name}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 pt-1"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={form.name ?? ''}
                                onChange={(e) =>
                                    handleChange('name', e.target.value)
                                }
                                className={
                                    displayErrors.name ? 'border-destructive' : ''
                                }
                            />
                            {displayErrors.name && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-nick">Nick or Company</Label>
                            <Input
                                id="edit-nick"
                                value={form.nickOrCompany ?? ''}
                                onChange={(e) =>
                                    handleChange(
                                        'nickOrCompany',
                                        e.target.value,
                                    )
                                }
                                className={
                                    displayErrors.nickOrCompany ? 'border-destructive' : ''
                                }
                            />
                            {displayErrors.nickOrCompany && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.nickOrCompany}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-type">Type</Label>
                            <Select
                                value={form.type ?? 'WA'}
                                onValueChange={(v) => handleChange('type', v)}
                            >
                                <SelectTrigger
                                    id="edit-type"
                                    className={`w-full ${displayErrors.type ? 'border-destructive' : ''}`}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WA">WA</SelectItem>
                                    <SelectItem value="Mail">Mail</SelectItem>
                                    <SelectItem value="WA/Mail">
                                        WA/Mail
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {displayErrors.type && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.type}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-hp">HP for WA</Label>
                            <Input
                                id="edit-hp"
                                value={form.hpForWa ?? ''}
                                onChange={(e) =>
                                    handleChange('hpForWa', e.target.value)
                                }
                                className={
                                    displayErrors.hpForWa ? 'border-destructive' : ''
                                }
                            />
                            {displayErrors.hpForWa && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.hpForWa}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-mail">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-mail"
                            type="email"
                            value={form.mail ?? ''}
                            onChange={(e) =>
                                handleChange('mail', e.target.value)
                            }
                            className={displayErrors.mail ? 'border-destructive' : ''}
                        />
                        {displayErrors.mail && (
                            <p className="text-xs text-destructive">
                                {displayErrors.mail}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="edit-req-type">Request Type</Label>
                        <Select
                            value={form.requestType ?? 'Admin Direct'}
                            onValueChange={(v) =>
                                handleChange('requestType', v)
                            }
                        >
                            <SelectTrigger
                                id="edit-req-type"
                                className="w-full"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin Direct">
                                    Admin Direct
                                </SelectItem>
                                <SelectItem value="Request Consulting(AUTO)">
                                    Request Consulting (AUTO)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-quotation">
                                Request Quotation
                            </Label>
                            <Input
                                id="edit-quotation"
                                value={form.requestQuotation ?? ''}
                                onChange={(e) =>
                                    handleChange(
                                        'requestQuotation',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="edit-reply">
                                Consulting / Reply
                            </Label>
                            <Input
                                id="edit-reply"
                                value={form.consultingReply ?? ''}
                                onChange={(e) =>
                                    handleChange(
                                        'consultingReply',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-1.5">
                            <Pencil className="size-4" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────
function DeleteDialog({
    customer,
    open,
    onOpenChange,
    onConfirm,
}: {
    customer: Customer | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: () => void;
}) {
    if (!customer) {
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
                            <DialogTitle>Delete Customer</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">
                        {customer.name}
                    </span>
                    {customer.nickOrCompany
                        ? ` (${customer.nickOrCompany})`
                        : ''}
                    ?
                </p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        className="gap-1.5"
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Add Customer Dialog ──────────────────────────────────────────────────────
const emptyForm = {
    name: '',
    nickOrCompany: '',
    type: 'WA' as Customer['type'],
    hpForWa: '',
    mail: '',
    requestType: 'Admin Direct',
    requestQuotation: '1EA',
    consultingReply: '0EA',
};

function AddCustomerDialog({ onAdd }: { onAdd: (customer: Customer, options?: any) => void }) {
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState(emptyForm);
    const [errors, setErrors] = React.useState<Partial<typeof emptyForm>>({});
    const { errors: serverErrors } = usePage().props as any;

    const displayErrors = {
        name: errors.name || serverErrors?.name,
        mail: errors.mail || serverErrors?.mail || serverErrors?.email,
        hpForWa: serverErrors?.hp_for_wa,
        nickOrCompany: serverErrors?.nick_or_company,
        type: serverErrors?.type,
    };

    function handleChange(field: keyof typeof emptyForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate() {
        const errs: Partial<typeof emptyForm> = {};

        if (!form.name.trim()) {
            errs.name = 'Name is required';
        }

        if (!form.mail.trim()) {
            errs.mail = 'Email is required';
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

        onAdd(
            {
                id: Date.now(),
                no: Date.now() % 10000,
                ...form,
                withdrawal: undefined,
            } as any,
            {
                onSuccess: () => {
                    setForm(emptyForm);
                    setErrors({});
                    setOpen(false);
                }
            }
        );
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
                    <span className="hidden sm:inline">Add Customer</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Add New Customer</DialogTitle>
                            <DialogDescription>
                                Fill in the customer details below.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 pt-2"
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="add-name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="add-name"
                                placeholder="e.g. John Doe"
                                value={form.name}
                                onChange={(e) =>
                                    handleChange('name', e.target.value)
                                }
                                className={
                                    displayErrors.name ? 'border-destructive' : ''
                                }
                            />
                            {displayErrors.name && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="add-nick">Nick or Company</Label>
                            <Input
                                id="add-nick"
                                placeholder="e.g. PT. Abadi"
                                value={form.nickOrCompany}
                                onChange={(e) =>
                                    handleChange(
                                        'nickOrCompany',
                                        e.target.value,
                                    )
                                }
                                className={
                                    displayErrors.nickOrCompany ? 'border-destructive' : ''
                                }
                            />
                            {displayErrors.nickOrCompany && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.nickOrCompany}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="add-type">Type</Label>
                            <Select
                                value={form.type}
                                onValueChange={(v) => handleChange('type', v)}
                            >
                                <SelectTrigger id="add-type" className={`w-full ${displayErrors.type ? 'border-destructive' : ''}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WA">WA</SelectItem>
                                    <SelectItem value="Mail">Mail</SelectItem>
                                    <SelectItem value="WA/Mail">
                                        WA/Mail
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {displayErrors.type && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.type}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="add-hp">HP for WA</Label>
                            <Input
                                id="add-hp"
                                placeholder="e.g. 081-2345-6789"
                                value={form.hpForWa}
                                onChange={(e) =>
                                    handleChange('hpForWa', e.target.value)
                                }
                                className={
                                    displayErrors.hpForWa ? 'border-destructive' : ''
                                }
                            />
                            {displayErrors.hpForWa && (
                                <p className="text-xs text-destructive">
                                    {displayErrors.hpForWa}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="add-mail">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="add-mail"
                            type="email"
                            placeholder="e.g. customer@example.com"
                            value={form.mail}
                            onChange={(e) =>
                                handleChange('mail', e.target.value)
                            }
                            className={displayErrors.mail ? 'border-destructive' : ''}
                        />
                        {displayErrors.mail && (
                            <p className="text-xs text-destructive">
                                {displayErrors.mail}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="add-req-type">Request Type</Label>
                        <Select
                            value={form.requestType}
                            onValueChange={(v) =>
                                handleChange('requestType', v)
                            }
                        >
                            <SelectTrigger id="add-req-type" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin Direct">
                                    Admin Direct
                                </SelectItem>
                                <SelectItem value="Request Consulting(AUTO)">
                                    Request Consulting (AUTO)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="add-quotation">
                                Request Quotation
                            </Label>
                            <Input
                                id="add-quotation"
                                placeholder="e.g. 1EA"
                                value={form.requestQuotation}
                                onChange={(e) =>
                                    handleChange(
                                        'requestQuotation',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="add-reply">
                                Consulting / Reply
                            </Label>
                            <Input
                                id="add-reply"
                                placeholder="e.g. 0EA"
                                value={form.consultingReply}
                                onChange={(e) =>
                                    handleChange(
                                        'consultingReply',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-1.5">
                            <UserPlus className="size-4" />
                            Add Customer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Action Menu Cell ─────────────────────────────────────────────────────────
function ActionMenu({
    customer,
    onView,
    onEdit,
    onDelete,
}: {
    customer: Customer;
    onView: (c: Customer) => void;
    onEdit: (c: Customer) => void;
    onDelete: (c: Customer) => void;
}) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

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
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => onView(customer)}
                >
                    View
                </DropdownMenuItem>
                {isAdmin && (
                    <>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => onEdit(customer)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer font-semibold text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-400"
                            onSelect={() => onDelete(customer)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ─── Columns factory ─────────────────────────────────────────────────────────
function createColumns(
    onView: (c: Customer) => void,
    onEdit: (c: Customer) => void,
    onDelete: (c: Customer) => void,
): ColumnDef<Customer>[] {
    return [
        {
            accessorKey: 'no',
            header: 'NO',
            cell: ({ row }) => (
                <span className="font-mono text-xs font-medium text-muted-foreground">
                    {row.original.no}
                </span>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-foreground">
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: 'nickOrCompany',
            header: 'Nick or Company',
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.nickOrCompany || (
                        <span className="italic opacity-40">—</span>
                    )}
                </span>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => <TypeBadge type={row.original.type} />,
        },
        {
            accessorKey: 'hpForWa',
            header: () => (
                <div className="flex items-center gap-1">
                    <Phone className="size-3.5 text-muted-foreground" />
                    HP for WA
                </div>
            ),
            cell: ({ row }) => (
                <span className="font-mono text-xs">
                    {row.original.hpForWa === '-' ? (
                        <span className="text-muted-foreground italic">—</span>
                    ) : (
                        row.original.hpForWa
                    )}
                </span>
            ),
        },
        {
            accessorKey: 'mail',
            header: () => (
                <div className="flex items-center gap-1">
                    <Mail className="size-3.5 text-muted-foreground" />
                    Mail
                </div>
            ),
            cell: ({ row }) => (
                <a
                    href={`mailto:${row.original.mail}`}
                    className="text-xs text-primary hover:underline"
                >
                    {row.original.mail}
                </a>
            ),
        },
        {
            accessorKey: 'requestType',
            header: 'Type',
            cell: ({ row }) => (
                <RequestTypeBadge value={row.original.requestType} />
            ),
        },
        {
            accessorKey: 'requestQuotation',
            header: () => <div className="text-center">Request Quotation</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {row.original.requestQuotation}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'consultingReply',
            header: () => <div className="text-center">Consulting / Reply</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.original.consultingReply}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'withdrawal',
            header: () => (
                <div className="text-center">Withdrawal (Delete)</div>
            ),
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.withdrawal ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <X className="size-3" />
                            {row.original.withdrawal}
                        </span>
                    ) : (
                        <span className="text-xs text-muted-foreground/40 italic">
                            —
                        </span>
                    )}
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => null,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <ActionMenu
                        customer={row.original}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            ),
            enableHiding: false,
        },
    ];
}

// ─── Main DataTable Component ─────────────────────────────────────────────────
export function CustomerDataTable({
    serverClients = [],
}: {
    serverClients?: Customer[];
}) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    const [data, setData] = React.useState<Customer[]>(serverClients);

    React.useEffect(() => {
        setData(serverClients);
    }, [serverClients]);

    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Dialog state
    const [viewTarget, setViewTarget] = React.useState<Customer | null>(null);
    const [editTarget, setEditTarget] = React.useState<Customer | null>(null);
    const [deleteTarget, setDeleteTarget] = React.useState<Customer | null>(
        null,
    );

    function handleAdd(customer: Customer, options?: any) {
        router.post('/dashboard/client', customer as any, options);
    }

    function handleSave(updated: Customer, options?: any) {
        router.put(`/dashboard/client/${updated.id}`, updated as any, options);
    }

    function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/dashboard/client/${deleteTarget.id}`);
        setDeleteTarget(null);
    }

    const columns = React.useMemo(
        () => createColumns(setViewTarget, setEditTarget, setDeleteTarget),
        [],
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
            globalFilter,
        },
        getRowId: (row) => row.id.toString(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <>
            {/* ── Dialogs (rendered outside table to avoid nesting issues) ── */}
            <ViewDialog
                customer={viewTarget}
                open={!!viewTarget}
                onOpenChange={(v) => !v && setViewTarget(null)}
            />
            <EditDialog
                customer={editTarget}
                open={!!editTarget}
                onOpenChange={(v) => !v && setEditTarget(null)}
                onSave={handleSave}
            />
            <DeleteDialog
                customer={deleteTarget}
                open={!!deleteTarget}
                onOpenChange={(v) => !v && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />

            <div className="flex flex-col gap-4">
                {/* ── Toolbar ── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="customer-search"
                            placeholder="Search customers…"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="h-9 pl-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5"
                                >
                                    <Columns className="size-4" />
                                    <span className="hidden sm:inline">
                                        Columns
                                    </span>
                                    <ChevronDown className="size-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (col) =>
                                            typeof col.accessorFn !==
                                                'undefined' && col.getCanHide(),
                                    )
                                    .map((col) => (
                                        <DropdownMenuCheckboxItem
                                            key={col.id}
                                            className="capitalize"
                                            checked={col.getIsVisible()}
                                            onCheckedChange={(v) =>
                                                col.toggleVisibility(!!v)
                                            }
                                        >
                                            {col.id
                                                .replace(/([A-Z])/g, ' $1')
                                                .trim()}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {isAdmin && <AddCustomerDialog onAdd={handleAdd} />}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow
                                    key={hg.id}
                                    className="bg-muted/60 hover:bg-muted/60"
                                >
                                    {hg.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
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
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* ── Pagination ── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} total
                        customers
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="rows-per-page"
                                className="text-xs whitespace-nowrap text-muted-foreground"
                            >
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(v) =>
                                    table.setPageSize(Number(v))
                                }
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="h-8 w-16"
                                    id="rows-per-page"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 50].map((ps) => (
                                        <SelectItem key={ps} value={`${ps}`}>
                                            {ps}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">
                            Page {table.getState().pagination.pageIndex + 1} /{' '}
                            {table.getPageCount()}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronsLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() =>
                                    table.setPageIndex(table.getPageCount() - 1)
                                }
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronsRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
