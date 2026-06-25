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

const MESSAGE_MODE_OPTIONS = ['Auto', 'Manual'] as const;
const FORMAT_TYPE_OPTIONS = ['Greeting', 'Quotation', 'Others'] as const;
const RESULT_OPTIONS = ['Send Mail Successed', 'Send Mail Fail'] as const;

export const messageSchema = z.object({
    id: z.number(),
    no: z.number(),
    manualAuto: z.enum(MESSAGE_MODE_OPTIONS),
    formatType: z.enum(FORMAT_TYPE_OPTIONS),
    name: z.string(),
    nick: z.string(),
    companyName: z.string(),
    mail: z.string(),
    messageSubject: z.string(),
    requestDateTime: z.string(),
    result: z.enum(RESULT_OPTIONS),
    sendTime: z.string(),
});

export type MessageRecord = z.infer<typeof messageSchema>;

// ─── Badges ───────────────────────────────────────────────────────────────────

function ManualAutoBadge({ value }: { value: MessageRecord['manualAuto'] }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                value === 'Auto'
                    ? 'border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            }`}
        >
            {value}
        </span>
    );
}

function FormatTypeBadge({ value }: { value: MessageRecord['formatType'] }) {
    const className =
        value === 'Greeting'
            ? 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
            : value === 'Quotation'
              ? 'border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-400'
              : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400';

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${className}`}
        >
            {value}
        </span>
    );
}

function ResultBadge({ value }: { value: MessageRecord['result'] }) {
    const success = value === 'Send Mail Successed';

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${
                success
                    ? 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
        >
            {value}
        </span>
    );
}

type MessagePopupMode = 'edit' | 'view' | 'resend';
type MessageTemplate =
    | 'greeting-new-quotation'
    | 'change-quotation'
    | 'conclusion';
type ComparisonRow = {
    vendor: string;
    category: string;
    normalPrice: string;
    specialPrice: string;
};

const messageTemplateContent: Record<
    MessageTemplate,
    { title: string; lines: string[] }
> = {
    'greeting-new-quotation': {
        title: 'Greeting with New Quotation',
        lines: [
            'Welcome to Manlab Quotation Comparison System',
            'This is the Quotation and pamphlet',
        ],
    },
    'change-quotation': {
        title: 'Change Quotation for Client Request',
        lines: ['As a Your Request we provide changed Quotation'],
    },
    conclusion: {
        title: 'Conclusion',
        lines: [
            'Kindly check Comparison by Manlab and Request Project with Attached Files Manlab hope this helps you make the most reasonable choice.',
            'Thank you and Regards',
            'Manlab',
        ],
    },
};

function MessageQuotationPopup({
    message,
    mode,
    open,
    onOpenChange,
    onSave,
}: {
    message: MessageRecord | null;
    mode: MessagePopupMode;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (updated: MessageRecord, options?: any) => void;
}) {
    const readOnly = mode === 'view';
    const titlePrefix =
        mode === 'resend' ? 'Re-Send' : mode === 'edit' ? 'Edit' : 'View';
    const [selectedTemplate, setSelectedTemplate] =
        React.useState<MessageTemplate>('greeting-new-quotation');
    const [editorText, setEditorText] = React.useState('');
    const [selectedCategory, setSelectedCategory] =
        React.useState('Total Interior');
    const [normalPrice, setNormalPrice] = React.useState('');
    const [specialPrice, setSpecialPrice] = React.useState('');
    const [formalFileName, setFormalFileName] = React.useState('');
    const [otherFileName, setOtherFileName] = React.useState('');
    const [comparisonRows, setComparisonRows] = React.useState<ComparisonRow[]>(
        [],
    );
    const previewTemplate = messageTemplateContent[selectedTemplate];

    React.useEffect(() => {
        if (!open || !message) {
return;
}

        const template: MessageTemplate =
            message.formatType === 'Quotation'
                ? 'change-quotation'
                : message.formatType === 'Others'
                  ? 'conclusion'
                  : 'greeting-new-quotation';

        setSelectedTemplate(template);
        setEditorText('');
        setSelectedCategory('Total Interior');
        setNormalPrice('');
        setSpecialPrice('');
        setFormalFileName('');
        setOtherFileName('');
        setComparisonRows([
            {
                vendor: 'Vendor A',
                category: 'Total Interior',
                normalPrice: '200',
                specialPrice: '180',
            },
            {
                vendor: 'PT 1',
                category: 'Total Interior',
                normalPrice: '250',
                specialPrice: '200',
            },
            {
                vendor: 'Manlab Recommended',
                category: 'Renovation',
                normalPrice: '450',
                specialPrice: '380',
            },
        ]);
    }, [message, open]);

    if (!message) {
return null;
}

    const currentMessage = message;

    function formatCurrentDateTime() {
        return new Date().toISOString().slice(0, 16).replace('T', ' ');
    }

    function getFormatTypeFromTemplate(): MessageRecord['formatType'] {
        if (selectedTemplate === 'greeting-new-quotation') {
return 'Greeting';
}

        if (selectedTemplate === 'change-quotation') {
return 'Quotation';
}

        return 'Others';
    }

    function addComparisonRow() {
        if (!normalPrice.trim() && !specialPrice.trim()) {
return;
}

        setComparisonRows((prev) => [
            ...prev,
            {
                vendor: `Vendor ${prev.length + 1}`,
                category: selectedCategory,
                normalPrice: normalPrice || '-',
                specialPrice: specialPrice || '-',
            },
        ]);
        setNormalPrice('');
        setSpecialPrice('');
    }

    function saveMessage(nextResult?: MessageRecord['result'], options?: any) {
        onSave({
            ...currentMessage,
            formatType: getFormatTypeFromTemplate(),
            messageSubject: previewTemplate.title,
            result: nextResult ?? currentMessage.result,
            sendTime: nextResult
                ? formatCurrentDateTime()
                : currentMessage.sendTime,
        }, options);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] max-w-none overflow-x-hidden overflow-y-auto p-0 sm:w-[calc(100vw-2rem)] xl:max-w-6xl">
                <DialogHeader>
                    <div className="border-b px-4 py-4 sm:px-6">
                        <DialogTitle>
                            {titlePrefix} Message #{currentMessage.no}
                        </DialogTitle>
                        <DialogDescription>
                            Edit the quotation message content, comparison rows,
                            attachments, and preview before resending.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="grid min-w-0 gap-0 xl:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.95fr)]">
                    <div className="min-w-0 space-y-5 px-4 py-4 sm:px-6 sm:py-5">
                        <section className="space-y-3">
                            <div className="space-y-1">
                                <Label>Format</Label>
                                <Select
                                    value={selectedTemplate}
                                    disabled={readOnly}
                                    onValueChange={(value) =>
                                        setSelectedTemplate(
                                            value as MessageTemplate,
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="greeting-new-quotation">
                                            Greeting with New Quotation
                                        </SelectItem>
                                        <SelectItem value="change-quotation">
                                            Change Quotation for Client Request
                                        </SelectItem>
                                        <SelectItem value="conclusion">
                                            Conclusion
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="rounded-lg border bg-muted/20 p-4">
                                <div className="text-sm font-medium">
                                    Template content
                                </div>
                                <div className="mt-3 space-y-2 text-sm leading-relaxed break-words text-muted-foreground">
                                    {previewTemplate.lines.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <div>
                                <h3 className="text-sm font-medium">
                                    Category calculation
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Customer selected category is required.
                                    Normal and special prices can be added to
                                    the comparison.
                                </p>
                            </div>
                            <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
                                <Select
                                    value={selectedCategory}
                                    disabled={readOnly}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Total Interior">
                                            Total Interior
                                        </SelectItem>
                                        <SelectItem value="Renovation">
                                            Renovation
                                        </SelectItem>
                                        <SelectItem value="Furniture">
                                            Furniture
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Normal Price"
                                    disabled={readOnly}
                                    value={normalPrice}
                                    onChange={(event) =>
                                        setNormalPrice(event.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Special Price"
                                    disabled={readOnly}
                                    value={specialPrice}
                                    onChange={(event) =>
                                        setSpecialPrice(event.target.value)
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    disabled={readOnly}
                                    onClick={addComparisonRow}
                                    aria-label="Add comparison row"
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                            <div className="grid gap-2 md:hidden">
                                {comparisonRows.map((row) => (
                                    <div
                                        key={`mobile-${row.vendor}-${row.category}`}
                                        className="rounded-md border p-3 text-sm"
                                    >
                                        <div className="font-medium">
                                            {row.vendor}
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <div className="text-muted-foreground">
                                                    Category
                                                </div>
                                                <div>{row.category}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground">
                                                    Normal Price
                                                </div>
                                                <div>{row.normalPrice}</div>
                                            </div>
                                            <div>
                                                <div className="text-muted-foreground">
                                                    Special Price
                                                </div>
                                                <div>{row.specialPrice}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="hidden overflow-hidden rounded-md border md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/60">
                                            <TableHead>Vendor/Tukang</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Normal Price</TableHead>
                                            <TableHead>Special Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {comparisonRows.map((row) => (
                                            <TableRow
                                                key={`${row.vendor}-${row.category}`}
                                            >
                                                <TableCell className="font-medium">
                                                    {row.vendor}
                                                </TableCell>
                                                <TableCell>
                                                    {row.category}
                                                </TableCell>
                                                <TableCell>
                                                    {row.normalPrice}
                                                </TableCell>
                                                <TableCell>
                                                    {row.specialPrice}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-medium">Attachments</h3>
                            <div className="grid gap-3 lg:grid-cols-2">
                                <div className="space-y-2 rounded-lg border p-4">
                                    <Label className="text-xs">
                                        Formal quotation
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Required for detailed comparison.
                                    </p>
                                    <Input
                                        type="file"
                                        className="w-full"
                                        disabled={readOnly}
                                        onChange={(event) =>
                                            setFormalFileName(
                                                event.target.files?.[0]?.name ??
                                                    '',
                                            )
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        disabled={readOnly || !formalFileName}
                                    >
                                        Upload
                                    </Button>
                                    {formalFileName && (
                                        <p className="truncate text-xs text-muted-foreground">
                                            {formalFileName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 rounded-lg border p-4">
                                    <Label className="text-xs">
                                        Other files
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Optional introductions, drawings, or
                                        quotation notes.
                                    </p>
                                    <Input
                                        type="file"
                                        className="w-full"
                                        disabled={readOnly}
                                        onChange={(event) =>
                                            setOtherFileName(
                                                event.target.files?.[0]?.name ??
                                                    '',
                                            )
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        disabled={readOnly || !otherFileName}
                                    >
                                        Upload
                                    </Button>
                                    {otherFileName && (
                                        <p className="truncate text-xs text-muted-foreground">
                                            {otherFileName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-2">
                            <Label className="block">Editor</Label>
                            <textarea
                                className="block min-h-32 w-full resize-y rounded-md border bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={readOnly}
                                value={editorText}
                                onChange={(event) =>
                                    setEditorText(event.target.value)
                                }
                                placeholder="Add vendor explanation for WhatsApp message or email."
                            />
                        </section>
                    </div>

                    <aside className="border-t bg-muted/20 px-4 py-4 sm:px-6 sm:py-5 xl:border-t-0 xl:border-l">
                        <div className="min-w-0 space-y-3 xl:sticky xl:top-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-medium">Preview</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={readOnly}
                                    onClick={() => saveMessage()}
                                >
                                    Save & Refresh
                                </Button>
                            </div>

                            <div className="min-w-0 rounded-lg border bg-background p-4 text-sm leading-relaxed break-words shadow-sm sm:p-5">
                                <p>Dear Customer,</p>
                                <div className="mt-4 space-y-2">
                                    {previewTemplate.lines.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                                {editorText.trim() && (
                                    <div className="mt-6 rounded-md bg-muted/40 p-3 break-words whitespace-pre-line">
                                        {editorText}
                                    </div>
                                )}

                                <div className="mt-6 grid gap-2 md:hidden">
                                    {comparisonRows.map((row) => (
                                        <div
                                            key={`preview-mobile-${row.vendor}-${row.category}`}
                                            className="rounded-md border p-3"
                                        >
                                            <div className="font-medium">
                                                {row.vendor}
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <div className="text-muted-foreground">
                                                        Category
                                                    </div>
                                                    <div>{row.category}</div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">
                                                        Normal Price
                                                    </div>
                                                    <div>{row.normalPrice}</div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground">
                                                        Special Price
                                                    </div>
                                                    <div>
                                                        {row.specialPrice}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 hidden overflow-hidden rounded-md border md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/60 hover:bg-muted/60">
                                                <TableHead>
                                                    Vendor/Mandor
                                                </TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>
                                                    Normal Price
                                                </TableHead>
                                                <TableHead>
                                                    Special Price
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {comparisonRows.map((row) => (
                                                <TableRow
                                                    key={`preview-${row.vendor}-${row.category}`}
                                                >
                                                    <TableCell>
                                                        {row.vendor}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.category}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.normalPrice}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.specialPrice}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                <p className="mt-8">
                                    Kindly check Comparison by Manlab and
                                    Request Project with Attached Files Manlab
                                    hope this helps you make the most reasonable
                                    choice.
                                </p>
                                <p className="mt-5">
                                    Thank you and Regards
                                    <br />
                                    Manlab
                                </p>
                                <p className="mt-8 break-words text-muted-foreground">
                                    Attachment file name:{' '}
                                    {[formalFileName, otherFileName]
                                        .filter(Boolean)
                                        .join(', ') ||
                                        'XXXX.pdf, Design Sample.pdf'}
                                </p>
                                <p className="mt-6">..</p>
                            </div>
                        </div>
                    </aside>
                </div>

                <DialogFooter className="border-t bg-background px-4 py-4 sm:px-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button
                        type="button"
                        disabled={readOnly}
                        onClick={() => {
                            saveMessage('Send Mail Successed', {
                                onSuccess: () => {
                                    onOpenChange(false);
                                }
                            });
                        }}
                    >
                        Resend
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ViewDialog({
    message,
    open,
    onOpenChange,
}: {
    message: MessageRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    if (!message) {
return null;
}

    const rows: { label: string; value: React.ReactNode }[] = [
        { label: 'No', value: <span className="font-mono">{message.no}</span> },
        {
            label: 'Manual / Auto',
            value: <ManualAutoBadge value={message.manualAuto} />,
        },
        {
            label: 'Format Type',
            value: <FormatTypeBadge value={message.formatType} />,
        },
        { label: 'Name', value: message.name },
        { label: 'Nick', value: message.nick },
        { label: 'Company Name', value: message.companyName },
        { label: 'Mail', value: message.mail },
        { label: 'Message [Subject]', value: message.messageSubject },
        { label: 'Request Date/Time', value: message.requestDateTime },
        { label: 'Result', value: <ResultBadge value={message.result} /> },
        { label: 'Send Time', value: message.sendTime },
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
                            <DialogTitle>Message Detail</DialogTitle>
                            <DialogDescription>
                                Viewing record #{message.no}
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

function MessageFormFields({
    form,
    errors,
    onChange,
}: {
    form: Partial<MessageRecord>;
    errors: Partial<Record<keyof MessageRecord, string>>;
    onChange: (field: keyof MessageRecord, value: string) => void;
}) {
    const [clients, setClients] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mandorlab_clients');
            if (saved) {
                try {
                    setClients(JSON.parse(saved));
                } catch (e) {}
            }
        }
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 border-b pb-4 mb-2">
                <Label htmlFor="m-client-select">Select Existing Client (Autofill)</Label>
                <Select
                    onValueChange={(val) => {
                        if (val === 'manual') return;
                        const client = clients.find((c) => c.id.toString() === val);
                        if (client) {
                            onChange('name', client.name);
                            onChange('nick', client.name);
                            onChange('companyName', client.nickOrCompany !== '-' ? client.nickOrCompany : '');
                            onChange('mail', client.mail !== '-' ? client.mail : '');
                        }
                    }}
                >
                    <SelectTrigger id="m-client-select" className="w-full">
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
                    <Label htmlFor="m-mode">Manual / Auto</Label>
                    <Select
                        value={form.manualAuto ?? 'Auto'}
                        onValueChange={(v) => onChange('manualAuto', v)}
                    >
                        <SelectTrigger id="m-mode" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MESSAGE_MODE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-format">Format Type</Label>
                    <Select
                        value={form.formatType ?? 'Greeting'}
                        onValueChange={(v) => onChange('formatType', v)}
                    >
                        <SelectTrigger id="m-format" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {FORMAT_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-name">
                        Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="m-name"
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
                    <Label htmlFor="m-nick">Nick</Label>
                    <Input
                        id="m-nick"
                        value={form.nick ?? ''}
                        onChange={(e) => onChange('nick', e.target.value)}
                        className={errors.nick ? 'border-destructive' : ''}
                    />
                    {errors.nick && (
                        <p className="text-xs text-destructive">
                            {errors.nick}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-company">Company Name</Label>
                    <Input
                        id="m-company"
                        value={form.companyName ?? ''}
                        onChange={(e) =>
                            onChange('companyName', e.target.value)
                        }
                        className={errors.companyName ? 'border-destructive' : ''}
                    />
                    {errors.companyName && (
                        <p className="text-xs text-destructive">
                            {errors.companyName}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-mail">Mail</Label>
                    <Input
                        id="m-mail"
                        type="email"
                        value={form.mail ?? ''}
                        onChange={(e) => onChange('mail', e.target.value)}
                        className={errors.mail ? 'border-destructive' : ''}
                    />
                    {errors.mail && (
                        <p className="text-xs text-destructive">
                            {errors.mail}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-subject">Message [Subject]</Label>
                    <Input
                        id="m-subject"
                        value={form.messageSubject ?? ''}
                        onChange={(e) =>
                            onChange('messageSubject', e.target.value)
                        }
                        className={errors.messageSubject ? 'border-destructive' : ''}
                    />
                    {errors.messageSubject && (
                        <p className="text-xs text-destructive">
                            {errors.messageSubject}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-request">Request Date/Time</Label>
                    <Input
                        id="m-request"
                        type="datetime-local"
                        value={form.requestDateTime ?? ''}
                        onChange={(e) =>
                            onChange('requestDateTime', e.target.value)
                        }
                        className={errors.requestDateTime ? 'border-destructive' : ''}
                    />
                    {errors.requestDateTime && (
                        <p className="text-xs text-destructive">
                            {errors.requestDateTime}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-result">Result</Label>
                    <Select
                        value={form.result ?? 'Send Mail Successed'}
                        onValueChange={(v) => onChange('result', v)}
                    >
                        <SelectTrigger id="m-result" className={`w-full ${errors.result ? 'border-destructive' : ''}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {RESULT_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.result && (
                        <p className="text-xs text-destructive">
                            {errors.result}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="m-send-time">Send Time</Label>
                    <Input
                        id="m-send-time"
                        type="datetime-local"
                        value={form.sendTime ?? ''}
                        onChange={(e) => onChange('sendTime', e.target.value)}
                        className={errors.sendTime ? 'border-destructive' : ''}
                    />
                    {errors.sendTime && (
                        <p className="text-xs text-destructive">
                            {errors.sendTime}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditDialog({
    message,
    open,
    onOpenChange,
    onSave,
}: {
    message: MessageRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (updated: MessageRecord) => void;
}) {
    const [form, setForm] = React.useState<Partial<MessageRecord>>({});
    const [errors, setErrors] = React.useState<
        Partial<Record<keyof MessageRecord, string>>
    >({});

    React.useEffect(() => {
        if (message) {
            setForm({
                ...message,
                requestDateTime: message.requestDateTime.replace(' ', 'T'),
                sendTime: message.sendTime.replace(' ', 'T'),
            });
        }
    }, [message]);

    if (!message) {
return null;
}

    function handleChange(field: keyof MessageRecord, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name?.trim()) {
            setErrors({ name: 'Name is required' });

            return;
        }

        onSave({
            ...message,
            ...form,
            requestDateTime: (form.requestDateTime ?? '').replace('T', ' '),
            sendTime: (form.sendTime ?? '').replace('T', ' '),
        } as MessageRecord);
        onOpenChange(false);
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
                            <DialogTitle>Edit Message</DialogTitle>
                            <DialogDescription>
                                Editing record #{message.no}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                    <MessageFormFields
                        form={form}
                        errors={errors}
                        onChange={handleChange}
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
    message,
    open,
    onOpenChange,
    onConfirm,
}: {
    message: MessageRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: () => void;
}) {
    if (!message) {
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
                            <DialogTitle>Delete Message</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete message for{' '}
                    <span className="font-semibold text-foreground">
                        {message.name}
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

const emptyForm: Partial<MessageRecord> = {
    manualAuto: 'Auto',
    formatType: 'Greeting',
    name: '',
    nick: '',
    companyName: '',
    mail: '',
    messageSubject: '',
    requestDateTime: '',
    result: 'Send Mail Successed',
    sendTime: '',
};

function AddMessageDialog({
    onAdd,
}: {
    onAdd: (message: MessageRecord, options?: any) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState<Partial<MessageRecord>>(emptyForm);
    const [errors, setErrors] = React.useState<
        Partial<Record<keyof MessageRecord, string>>
    >({});
    const { errors: serverErrors } = usePage().props as any;

    const displayErrors = {
        name: errors.name || serverErrors?.name,
        nick: serverErrors?.nick,
        companyName: serverErrors?.companyName || serverErrors?.company_name,
        mail: serverErrors?.mail,
        messageSubject: serverErrors?.messageSubject || serverErrors?.message_subject,
        requestDateTime: serverErrors?.requestDateTime || serverErrors?.request_date_time,
        result: serverErrors?.result,
        sendTime: serverErrors?.sendTime || serverErrors?.send_time,
    };

    function handleChange(field: keyof MessageRecord, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.name?.trim()) {
            setErrors({ name: 'Name is required' });

            return;
        }

        onAdd({
            id: Date.now(),
            no: Date.now() % 10000,
            manualAuto: form.manualAuto ?? 'Auto',
            formatType: form.formatType ?? 'Greeting',
            name: form.name,
            nick: form.nick || '-',
            companyName: form.companyName || '-',
            mail: form.mail || '-',
            messageSubject: form.messageSubject || '-',
            requestDateTime: (
                form.requestDateTime || new Date().toISOString().slice(0, 16)
            ).replace('T', ' '),
            result: form.result ?? 'Send Mail Successed',
            sendTime: (
                form.sendTime || new Date().toISOString().slice(0, 16)
            ).replace('T', ' '),
        } as MessageRecord, {
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
                    <span className="hidden sm:inline">Add Message</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <ClipboardList className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Add New Message</DialogTitle>
                            <DialogDescription>
                                Fill in the message details below.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-1 pt-1"
                >
                    <MessageFormFields
                        form={form}
                        errors={displayErrors}
                        onChange={handleChange}
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
                            Add Message
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ActionMenu({
    message,
    onView,
    onEdit,
    onResend,
    onDelete,
}: {
    message: MessageRecord;
    onView: (message: MessageRecord) => void;
    onEdit: (message: MessageRecord) => void;
    onResend: (message: MessageRecord) => void;
    onDelete: (message: MessageRecord) => void;
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
                    onSelect={() => onView(message)}
                >
                    View
                </DropdownMenuItem>
                {isAdmin && (
                    <>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => onEdit(message)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => onResend(message)}
                        >
                            Resend
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer font-semibold text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-400"
                            onSelect={() => onDelete(message)}
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
    onView: (message: MessageRecord) => void,
    onEdit: (message: MessageRecord) => void,
    onResend: (message: MessageRecord) => void,
    onDelete: (message: MessageRecord) => void,
): ColumnDef<MessageRecord>[] {
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
            accessorKey: 'manualAuto',
            header: 'Manual / Auto',
            cell: ({ row }) => (
                <ManualAutoBadge value={row.original.manualAuto} />
            ),
        },
        {
            accessorKey: 'formatType',
            header: 'Format Type',
            cell: ({ row }) => (
                <FormatTypeBadge value={row.original.formatType} />
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
            accessorKey: 'nick',
            header: 'Nick',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.nick}</span>
            ),
        },
        {
            accessorKey: 'companyName',
            header: '(Company Name)',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.companyName}</span>
            ),
        },
        {
            accessorKey: 'mail',
            header: 'Mail',
            cell: ({ row }) => (
                <span className="text-sm text-primary">
                    {row.original.mail}
                </span>
            ),
        },
        {
            accessorKey: 'messageSubject',
            header: 'Message [Subject]',
            cell: ({ row }) => (
                <span
                    className="block max-w-44 truncate text-sm"
                    title={row.original.messageSubject}
                >
                    {row.original.messageSubject}
                </span>
            ),
        },
        {
            accessorKey: 'requestDateTime',
            header: 'Request Date/Time',
            cell: ({ row }) => (
                <span className="font-mono text-xs">
                    {row.original.requestDateTime}
                </span>
            ),
        },
        {
            accessorKey: 'result',
            header: 'Result',
            cell: ({ row }) => <ResultBadge value={row.original.result} />,
        },
        {
            accessorKey: 'sendTime',
            header: 'Send Time',
            cell: ({ row }) => (
                <span className="font-mono text-xs">
                    {row.original.sendTime}
                </span>
            ),
        },
        {
            id: 'actions',
            header: () => null,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <ActionMenu
                        message={row.original}
                        onView={onView}
                        onEdit={onEdit}
                        onResend={onResend}
                        onDelete={onDelete}
                    />
                </div>
            ),
            enableHiding: false,
        },
    ];
}

export function MessageDataTable({
    serverMessages = [],
}: {
    serverMessages?: MessageRecord[];
}) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    const [data, setData] = React.useState<MessageRecord[]>(serverMessages);

    React.useEffect(() => {
        setData(serverMessages);
    }, [serverMessages]);

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

    const [popupTarget, setPopupTarget] = React.useState<MessageRecord | null>(
        null,
    );
    const [popupMode, setPopupMode] = React.useState<MessagePopupMode>('view');
    const [deleteTarget, setDeleteTarget] =
        React.useState<MessageRecord | null>(null);

    function handleAdd(message: MessageRecord, options?: any) {
        router.post('/dashboard/message', message as any, options);
    }

    function handleSave(updated: MessageRecord, options?: any) {
        router.put(`/dashboard/message/${updated.id}`, updated as any, options);
    }

    function handleDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/dashboard/message/${deleteTarget.id}`);
        setDeleteTarget(null);
    }

    function openMessagePopup(message: MessageRecord, mode: MessagePopupMode) {
        setPopupTarget(message);
        setPopupMode(mode);
    }

    const columns = React.useMemo(
        () =>
            createColumns(
                (message) => openMessagePopup(message, 'view'),
                (message) => openMessagePopup(message, 'edit'),
                (message) => openMessagePopup(message, 'resend'),
                setDeleteTarget,
            ),
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
            <MessageQuotationPopup
                message={popupTarget}
                mode={popupMode}
                open={!!popupTarget}
                onOpenChange={(v) => !v && setPopupTarget(null)}
                onSave={handleSave}
            />
            <DeleteDialog
                message={deleteTarget}
                open={!!deleteTarget}
                onOpenChange={(v) => !v && setDeleteTarget(null)}
                onConfirm={handleDelete}
            />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="message-search"
                            placeholder="Search messages..."
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
                        {isAdmin && <AddMessageDialog onAdd={handleAdd} />}
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
                                        No messages found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        {table.getFilteredRowModel().rows.length} total messages
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label
                                htmlFor="m-rows-per-page"
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
                                    id="m-rows-per-page"
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
