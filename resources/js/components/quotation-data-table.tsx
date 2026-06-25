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
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ClipboardList,
    Columns,
    EllipsisVertical,
    Eye,
    Pencil,
    Plus,
    Search,
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
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const ROUTE_OPTIONS = ['D', 'A'] as const;
const VISIT_OPTIONS = ['N', 'Y'] as const;
const TOTAL_PARTIAL_OPTIONS = ['Total', 'Partial'] as const;
const OWNERSHIP_OPTIONS = ['Owner', 'Tenant'] as const;
const BUILDING_TYPE_OPTIONS = ['House', 'Mall', 'Comercial'] as const;
const PREFERRED_CONTACT_OPTIONS = ['WA', 'Email'] as const;
const CATEGORY_OPTIONS = [
    'Flooring',
    'Ceiling',
    'Door & Window',
    'Wall',
    'AC',
    'Electricity',
    'Plumbing',
    'Renovation',
    'Furniture',
] as const;
const REPLY_QUO_OPTIONS = ['Replied', 'Not Yet'] as const;
const DUMMY_PHOTO_URL = 'https://dummyimage.com/512x512/000/fff';

const routeLabels: Record<(typeof ROUTE_OPTIONS)[number], string> = {
    D: 'Admin Direct',
    A: 'Request Quotation (Auto)',
};

const visitLabels: Record<(typeof VISIT_OPTIONS)[number], string> = {
    N: 'No',
    Y: 'Yes',
};

export const quotationSchema = z.object({
    id: z.number(),
    no: z.number(),
    name: z.string(),
    nickOrCompany: z.string(),
    photoUrl: z.string(),
    preferredContact: z.enum(PREFERRED_CONTACT_OPTIONS),
    route: z.enum(ROUTE_OPTIONS),
    visit: z.enum(VISIT_OPTIONS),
    visitDateTime: z.string().optional(),
    totalPartial: z.enum(TOTAL_PARTIAL_OPTIONS),
    cate: z.string(),
    budget: z.string(),
    ownership: z.enum(OWNERSHIP_OPTIONS),
    buildingType: z.enum(BUILDING_TYPE_OPTIONS),
    location: z.string(),
    specialReq: z.string(),
    requestDate: z.string(),
    replyQuo: z.enum(REPLY_QUO_OPTIONS),
});

export type Quotation = z.infer<typeof quotationSchema>;

// ─── Badges ───────────────────────────────────────────────────────────────────

function RouteBadge({ value }: { value: Quotation['route'] }) {
    const className =
        value === 'D'
            ? 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            : 'border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400';

    return (
        <span
            title={routeLabels[value]}
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${className}`}
        >
            {value}
        </span>
    );
}

function VisitBadge({
    value,
    dateTime,
}: {
    value: Quotation['visit'];
    dateTime?: string;
}) {
    if (value === 'N') {
        return (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                N
            </span>
        );
    }

    return (
        <div className="flex flex-col gap-0.5">
            <span className="inline-flex w-fit items-center rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
                Y
            </span>
            {dateTime && (
                <span className="font-mono text-[11px] text-muted-foreground">
                    {dateTime}
                </span>
            )}
        </div>
    );
}

function ReplyBadge({ value }: { value: Quotation['replyQuo'] }) {
    const isReplied = value === 'Replied';

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                isReplied
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            }`}
        >
            {value}
        </span>
    );
}

function TypeBadge({ value }: { value: Quotation['totalPartial'] }) {
    return (
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {value}
        </span>
    );
}

function ViewDialog({
    quotation,
    open,
    onOpenChange,
}: {
    quotation: Quotation | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    if (!quotation) {
return null;
}

    const rows: { label: string; value: React.ReactNode }[] = [
        {
            label: 'No',
            value: <span className="font-mono">{quotation.no}</span>,
        },
        { label: 'Name', value: quotation.name },
        { label: 'Nick or Company', value: quotation.nickOrCompany || '-' },
        { label: 'Preferred Contact', value: quotation.preferredContact },
        {
            label: 'Photo',
            value: (
                <img
                    src={quotation.photoUrl}
                    alt={`${quotation.name} thumbnail`}
                    className="size-14 rounded-md border object-cover"
                />
            ),
        },
        {
            label: 'Route',
            value: (
                <div className="flex items-center gap-2">
                    <RouteBadge value={quotation.route} />
                    <span>{routeLabels[quotation.route]}</span>
                </div>
            ),
        },
        {
            label: 'Visit',
            value: (
                <div className="flex items-center gap-2">
                    <VisitBadge
                        value={quotation.visit}
                        dateTime={quotation.visitDateTime}
                    />
                    <span>{visitLabels[quotation.visit]}</span>
                </div>
            ),
        },
        {
            label: 'Total / Partial',
            value: <TypeBadge value={quotation.totalPartial} />,
        },
        ...(quotation.totalPartial === 'Partial'
            ? [{ label: 'Cate', value: quotation.cate }]
            : []),
        { label: 'Budget', value: quotation.budget },
        { label: 'Ownership', value: quotation.ownership },
        { label: 'Building Type', value: quotation.buildingType },
        { label: 'Location', value: quotation.location },
        { label: 'Special Req', value: quotation.specialReq || '-' },
        { label: 'Request Date', value: quotation.requestDate },
        {
            label: 'Reply Quo',
            value: <ReplyBadge value={quotation.replyQuo} />,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30">
                            <Eye className="size-5 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                            <DialogTitle>Quotation Detail</DialogTitle>
                            <DialogDescription>
                                Viewing record #{quotation.no}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <Separator />
                <div className="flex flex-col gap-3 py-1">
                    {rows.map(({ label, value }) => (
                        <div
                            key={label}
                            className="grid grid-cols-[9rem_1fr] items-start gap-2 text-sm"
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

function QuotationFormFields({
    form,
    errors,
    onChange,
    clients = [],
}: {
    form: Partial<Quotation> & { photo?: File };
    errors: any;
    onChange: (field: string, value: any) => void;
    clients?: any[];
}) {

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 border-b pb-4 mb-2">
                <Label htmlFor="q-client-select">Select Existing Client (Autofill)</Label>
                <Select
                    onValueChange={(val) => {
                        if (val === 'manual') return;
                        const client = clients.find((c) => c.id.toString() === val);
                        if (client) {
                            onChange('name', client.name);
                            onChange('nickOrCompany', client.nickOrCompany || '');
                            if (client.type === 'Mail') {
                                onChange('preferredContact', 'Email');
                            } else {
                                onChange('preferredContact', 'WA');
                            }
                        }
                    }}
                >
                    <SelectTrigger id="q-client-select" className="w-full">
                        <SelectValue placeholder="Choose a client..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="manual">-- Type Manually --</SelectItem>
                        {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                                {client.name} {client.nickOrCompany ? `(${client.nickOrCompany})` : ''} - {client.mail !== '-' ? client.mail : client.hpForWa}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-name">
                        Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="q-name"
                        value={form.name ?? ''}
                        onChange={(e) => onChange('name', e.target.value)}
                        className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-company">Nick or Company</Label>
                    <Input
                        id="q-company"
                        value={form.nickOrCompany ?? ''}
                        onChange={(e) =>
                            onChange('nickOrCompany', e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-preferred-contact">
                        Preferred Contact
                    </Label>
                    <Select
                        value={form.preferredContact ?? 'WA'}
                        onValueChange={(v) => onChange('preferredContact', v)}
                    >
                        <SelectTrigger
                            id="q-preferred-contact"
                            className="w-full"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PREFERRED_CONTACT_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-budget">Budget</Label>
                    <Input
                        id="q-budget"
                        value={form.budget ?? ''}
                        onChange={(e) => onChange('budget', e.target.value)}
                        placeholder="e.g. Rp 50.000.000"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="q-photo">Photo</Label>
                <div className="flex items-center gap-3">
                    <img
                        src={form.photoUrl ?? DUMMY_PHOTO_URL}
                        alt="Quotation thumbnail preview"
                        className="size-14 rounded-md border object-cover"
                    />
                    <Input
                        id="q-photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (!file) {
                                return;
                            }

                            onChange('photoUrl', URL.createObjectURL(file));
                            onChange('photo', file);
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-route">Route</Label>
                    <Select
                        value={form.route ?? 'D'}
                        onValueChange={(v) => onChange('route', v)}
                    >
                        <SelectTrigger id="q-route" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="D">D - Admin Direct</SelectItem>
                            <SelectItem value="A">
                                A - Request Quotation (Auto)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-visit">Visit</Label>
                    <Select
                        value={form.visit ?? 'N'}
                        onValueChange={(v) => onChange('visit', v)}
                    >
                        <SelectTrigger id="q-visit" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="N">N - No</SelectItem>
                            <SelectItem value="Y">Y - Yes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {form.visit === 'Y' && (
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-visit-date">Visit Date & Time</Label>
                    <Input
                        id="q-visit-date"
                        type="datetime-local"
                        value={form.visitDateTime ?? ''}
                        onChange={(e) =>
                            onChange('visitDateTime', e.target.value)
                        }
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-total-partial">Total / Partial</Label>
                    <Select
                        value={form.totalPartial ?? 'Total'}
                        onValueChange={(v) => onChange('totalPartial', v)}
                    >
                        <SelectTrigger id="q-total-partial" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TOTAL_PARTIAL_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-building-type">Building Type</Label>
                    <Select
                        value={form.buildingType ?? 'House'}
                        onValueChange={(v) => onChange('buildingType', v)}
                    >
                        <SelectTrigger id="q-building-type" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {BUILDING_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {form.totalPartial === 'Partial' && (
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-cate">Cate</Label>
                    <Select
                        value={form.cate ?? CATEGORY_OPTIONS[0]}
                        onValueChange={(v) => onChange('cate', v)}
                    >
                        <SelectTrigger id="q-cate" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORY_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-ownership">Ownership</Label>
                    <Select
                        value={form.ownership ?? 'Owner'}
                        onValueChange={(v) => onChange('ownership', v)}
                    >
                        <SelectTrigger id="q-ownership" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {OWNERSHIP_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-location">Location</Label>
                    <Input
                        id="q-location"
                        value={form.location ?? ''}
                        onChange={(e) => onChange('location', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-request-date">Request Date</Label>
                    <Input
                        id="q-request-date"
                        type="date"
                        value={form.requestDate ?? ''}
                        onChange={(e) =>
                            onChange('requestDate', e.target.value)
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-special-req">Special Req</Label>
                    <Input
                        id="q-special-req"
                        value={form.specialReq ?? ''}
                        onChange={(e) => onChange('specialReq', e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="q-reply">Reply Quo</Label>
                    <Select
                        value={form.replyQuo ?? 'Not Yet'}
                        onValueChange={(v) => onChange('replyQuo', v)}
                    >
                        <SelectTrigger id="q-reply" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Replied">Replied</SelectItem>
                            <SelectItem value="Not Yet">Not Yet</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

function EditDialog({
    quotation,
    open,
    onOpenChange,
    onSave,
    clients = [],
}: {
    quotation: Quotation | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (updated: Quotation, options?: any) => void;
    clients?: any[];
}) {
    const [form, setForm] = React.useState<Partial<Quotation> & { photo?: File }>({});
    const [errors, setErrors] = React.useState<
        Partial<Record<keyof Quotation, string>>
    >({});
    const { errors: serverErrors } = usePage().props as any;

    const displayErrors = {
        name: errors.name || serverErrors?.name,
        preferredContact: serverErrors?.preferred_contact,
        route: serverErrors?.route,
        visit: serverErrors?.visit,
        totalPartial: serverErrors?.total_partial,
        cate: serverErrors?.cate,
        budget: serverErrors?.budget,
        ownership: serverErrors?.ownership,
        buildingType: serverErrors?.building_type,
        location: serverErrors?.location,
        requestDate: serverErrors?.request_date,
    };

    React.useEffect(() => {
        if (quotation) {
            setForm({ ...quotation });
        }
    }, [quotation]);

    if (!quotation) {
        return null;
    }

    function handleChange(field: string, value: any) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field as any]: undefined }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name?.trim()) {
            setErrors({ name: 'Name is required' });

            return;
        }

        onSave({
            ...quotation,
            ...form,
            visitDateTime: form.visit === 'Y' ? form.visitDateTime : undefined,
            cate:
                form.totalPartial === 'Partial'
                    ? (form.cate ?? CATEGORY_OPTIONS[0])
                    : '-',
        } as any, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <Pencil className="size-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <DialogTitle>Edit Quotation</DialogTitle>
                            <DialogDescription>
                                Editing record #{quotation.no}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                    <QuotationFormFields
                        form={form}
                        errors={displayErrors}
                        onChange={handleChange}
                        clients={clients}
                    />
                    <DialogFooter className="pt-4">
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

function DeleteDialog({
    quotation,
    open,
    onOpenChange,
    onConfirm,
}: {
    quotation: Quotation | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: () => void;
}) {
    if (!quotation) {
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
                            <DialogTitle>Delete Quotation</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete quotation from{' '}
                    <span className="font-semibold text-foreground">
                        {quotation.name}
                    </span>
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

const emptyForm: Partial<Quotation> = {
    name: '',
    nickOrCompany: '',
    photoUrl: DUMMY_PHOTO_URL,
    preferredContact: 'WA',
    route: 'D',
    visit: 'N',
    visitDateTime: '',
    totalPartial: 'Total',
    cate: '-',
    budget: '',
    ownership: 'Owner',
    buildingType: 'House',
    location: '',
    specialReq: '',
    requestDate: '',
    replyQuo: 'Not Yet',
};

function AddQuotationDialog({
    onAdd,
    clients = [],
}: {
    onAdd: (q: Quotation, options?: any) => void;
    clients?: any[];
}) {
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState<Partial<Quotation> & { photo?: File }>(emptyForm);
    const [errors, setErrors] = React.useState<
        Partial<Record<keyof Quotation, string>>
    >({});
    const { errors: serverErrors } = usePage().props as any;

    const displayErrors = {
        name: errors.name || serverErrors?.name,
        preferredContact: serverErrors?.preferred_contact,
        route: serverErrors?.route,
        visit: serverErrors?.visit,
        totalPartial: serverErrors?.total_partial,
        cate: serverErrors?.cate,
        budget: serverErrors?.budget,
        ownership: serverErrors?.ownership,
        buildingType: serverErrors?.building_type,
        location: serverErrors?.location,
        requestDate: serverErrors?.request_date,
    };

    function handleChange(field: string, value: any) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field as any]: undefined }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name?.trim()) {
            setErrors({ name: 'Name is required' });

            return;
        }

        onAdd({
            ...form,
            id: Date.now(),
            no: Date.now() % 10000,
            name: form.name,
            nickOrCompany: form.nickOrCompany || '-',
            photoUrl: form.photoUrl || DUMMY_PHOTO_URL,
            preferredContact: form.preferredContact ?? 'WA',
            route: form.route ?? 'D',
            visit: form.visit ?? 'N',
            visitDateTime: form.visit === 'Y' ? form.visitDateTime : undefined,
            totalPartial: form.totalPartial ?? 'Total',
            cate:
                form.totalPartial === 'Partial'
                    ? (form.cate ?? CATEGORY_OPTIONS[0])
                    : '-',
            budget: form.budget || '-',
            ownership: form.ownership ?? 'Owner',
            buildingType: form.buildingType ?? 'House',
            location: form.location || '-',
            specialReq: form.specialReq || '-',
            requestDate:
                form.requestDate || new Date().toISOString().slice(0, 10),
            replyQuo: form.replyQuo ?? 'Not Yet',
        } as any, {
            onSuccess: () => {
                setForm(emptyForm);
                setErrors({});
                setOpen(false);
            }
        });
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
                    <span className="hidden sm:inline">Add Quotation</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <ClipboardList className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Add New Quotation</DialogTitle>
                            <DialogDescription>
                                Fill in the quotation details below.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-1 pt-1"
                >
                    <QuotationFormFields
                        form={form}
                        errors={displayErrors}
                        onChange={handleChange}
                        clients={clients}
                    />
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-1.5">
                            <ClipboardList className="size-4" />
                            Add Quotation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ActionMenu({
    quotation,
    onView,
    onEdit,
    onDelete,
}: {
    quotation: Quotation;
    onView: (q: Quotation) => void;
    onEdit: (q: Quotation) => void;
    onDelete: (q: Quotation) => void;
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
                    onSelect={() => onView(quotation)}
                >
                    View
                </DropdownMenuItem>
                {isAdmin && (
                    <>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => onEdit(quotation)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer font-semibold text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-400"
                            onSelect={() => onDelete(quotation)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function createColumns(
    onView: (q: Quotation) => void,
    onEdit: (q: Quotation) => void,
    onDelete: (q: Quotation) => void,
): ColumnDef<Quotation>[] {
    return [
        {
            accessorKey: 'no',
            header: 'No',
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
                <span className="font-medium">{row.original.name}</span>
            ),
        },
        {
            accessorKey: 'nickOrCompany',
            header: 'Nick or Company',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.nickOrCompany}</span>
            ),
        },
        {
            accessorKey: 'photoUrl',
            header: 'Photo',
            cell: ({ row }) => (
                <img
                    src={row.original.photoUrl}
                    alt={`${row.original.name} thumbnail`}
                    className="size-10 rounded-md border object-cover"
                />
            ),
        },
        {
            accessorKey: 'preferredContact',
            header: 'Preferred Contact',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.preferredContact}</span>
            ),
        },
        {
            accessorKey: 'route',
            header: 'Route',
            cell: ({ row }) => <RouteBadge value={row.original.route} />,
        },
        {
            accessorKey: 'visit',
            header: 'Visit',
            cell: ({ row }) => (
                <VisitBadge
                    value={row.original.visit}
                    dateTime={row.original.visitDateTime}
                />
            ),
        },
        {
            accessorKey: 'totalPartial',
            header: 'Total / Partial',
            cell: ({ row }) => <TypeBadge value={row.original.totalPartial} />,
        },
        {
            accessorKey: 'cate',
            header: 'Cate',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.cate}</span>
            ),
        },
        {
            accessorKey: 'budget',
            header: 'Budget',
            cell: ({ row }) => (
                <span className="text-sm font-semibold">
                    {row.original.budget}
                </span>
            ),
        },
        {
            accessorKey: 'ownership',
            header: 'Ownership',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.ownership}</span>
            ),
        },
        {
            accessorKey: 'buildingType',
            header: 'Building Type',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.buildingType}</span>
            ),
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.location}</span>
            ),
        },
        {
            accessorKey: 'specialReq',
            header: 'Special Req',
            cell: ({ row }) => (
                <span
                    className="block max-w-36 truncate text-sm"
                    title={row.original.specialReq}
                >
                    {row.original.specialReq}
                </span>
            ),
        },
        {
            accessorKey: 'requestDate',
            header: 'Request Date',
            cell: ({ row }) => (
                <span className="font-mono text-xs">
                    {row.original.requestDate}
                </span>
            ),
        },
        {
            accessorKey: 'replyQuo',
            header: 'Reply Quo',
            cell: ({ row }) => <ReplyBadge value={row.original.replyQuo} />,
        },
        {
            id: 'actions',
            header: () => null,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <ActionMenu
                        quotation={row.original}
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

export function QuotationDataTable({
    serverQuotations = [],
    serverClients = [],
}: {
    serverQuotations?: Quotation[];
    serverClients?: any[];
}) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';
    const [data, setData] = React.useState<Quotation[]>(serverQuotations);

    React.useEffect(() => {
        setData(serverQuotations);
    }, [serverQuotations]);

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

    const [viewTarget, setViewTarget] = React.useState<Quotation | null>(null);
    const [editTarget, setEditTarget] = React.useState<Quotation | null>(null);
    const [deleteTarget, setDeleteTarget] = React.useState<Quotation | null>(
        null,
    );

    function handleAdd(q: Quotation, options?: any) {
        router.post('/dashboard/quotation', q as any, options);
    }

    function handleSave(updated: Quotation, options?: any) {
        router.post(`/dashboard/quotation/${updated.id}`, {
            ...updated,
            _method: 'PUT',
        } as any, options);
    }

    function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/dashboard/quotation/${deleteTarget.id}`);
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
            <ViewDialog
                quotation={viewTarget}
                open={!!viewTarget}
                onOpenChange={(v) => !v && setViewTarget(null)}
            />
            <EditDialog
                quotation={editTarget}
                open={!!editTarget}
                onOpenChange={(v) => !v && setEditTarget(null)}
                onSave={handleSave}
                clients={serverClients}
            />
            <DeleteDialog
                quotation={deleteTarget}
                open={!!deleteTarget}
                onOpenChange={(v) => !v && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="quotation-search"
                            placeholder="Search quotations..."
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
                        {isAdmin && <AddQuotationDialog onAdd={handleAdd} clients={serverClients} />}
                    </div>
                </div>

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
                                        No quotations found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} total
                        quotations
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="q-rows-per-page"
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
                                    id="q-rows-per-page"
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
