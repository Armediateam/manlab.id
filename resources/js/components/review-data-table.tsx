import { router, usePage } from '@inertiajs/react';
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
    Star,
    TriangleAlert,
} from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

const CATEGORY_OPTIONS = [
    'Total Interior',
    'Floor',
    'Ceil',
    'Kitchen',
    'Bathroom',
] as const;

const VENDOR_OPTIONS = [
    'Manlab Direct',
    'Vendor A',
    'PT 1',
    'Mandor Studio',
] as const;

export const reviewSchema = z.object({
    id: z.number(),
    name: z.string(),
    nickOrCompany: z.string(),
    email: z.string(),
    selected: z.boolean(),
    top8: z.boolean(),
    thumbnailBefore: z.string(),
    thumbnailAfter: z.string(),
    registerStartDate: z.string(),
    registerEndDate: z.string(),
    category: z.enum(CATEGORY_OPTIONS),
    selectedVendor: z.enum(VENDOR_OPTIONS),
    like: z.number(),
    viewStatus: z.enum(['Viewing', 'Hidden']),
    notes: z.string(),
});

export type ReviewRecord = z.infer<typeof reviewSchema>;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getCategoryType(category: ReviewRecord['category']) {
    return category === 'Total Interior' ? 'Total' : 'Partial';
}

function ViewBadge({ value }: { value: ReviewRecord['viewStatus'] }) {
    return (
        <Badge variant={value === 'Viewing' ? 'default' : 'secondary'}>
            {value}
        </Badge>
    );
}

function ThumbnailPair({ review }: { review: ReviewRecord }) {
    return (
        <div className="flex items-center gap-2">
            <img
                src={review.thumbnailBefore}
                alt={`${review.name} before thumbnail`}
                className="size-10 rounded-md border object-cover"
            />
            <img
                src={review.thumbnailAfter}
                alt={`${review.name} after thumbnail`}
                className="size-10 rounded-md border object-cover"
            />
        </div>
    );
}

function ActionMenu({
    review,
    onView,
    onEdit,
    onDelete,
}: {
    review: ReviewRecord;
    onView: (review: ReviewRecord) => void;
    onEdit: (review: ReviewRecord) => void;
    onDelete: (review: ReviewRecord) => void;
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
            <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={() => onView(review)}
                >
                    View
                </DropdownMenuItem>
                {isAdmin && (
                    <>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => onEdit(review)}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer font-semibold text-red-600 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-400"
                            onSelect={() => onDelete(review)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function createColumns({
    onToggleSelected,
    onToggleTop8,
    onView,
    onEdit,
    onDelete,
}: {
    onToggleSelected: (review: ReviewRecord) => void;
    onToggleTop8: (review: ReviewRecord) => void;
    onView: (review: ReviewRecord) => void;
    onEdit: (review: ReviewRecord) => void;
    onDelete: (review: ReviewRecord) => void;
}): ColumnDef<ReviewRecord>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="min-w-44">
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-xs text-muted-foreground">
                        {row.original.nickOrCompany}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {row.original.email}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'selected',
            header: 'Select',
            cell: ({ row }) => (
                <Checkbox
                    checked={row.original.selected}
                    onCheckedChange={() => onToggleSelected(row.original)}
                    aria-label="Select for frontend viewing"
                />
            ),
        },
        {
            accessorKey: 'top8',
            header: 'Top 8',
            cell: ({ row }) => (
                <Button
                    type="button"
                    variant={row.original.top8 ? 'default' : 'outline'}
                    size="sm"
                    className="gap-1.5"
                    onClick={() => onToggleTop8(row.original)}
                >
                    <Star className="size-3.5" />
                    {row.original.top8 ? 'Top' : 'Set'}
                </Button>
            ),
        },
        {
            id: 'thumbnail',
            header: 'Thumbnail',
            cell: ({ row }) => <ThumbnailPair review={row.original} />,
        },
        {
            id: 'registerDate',
            header: 'Register Date',
            cell: ({ row }) => (
                <span className="block min-w-36 font-mono text-xs">
                    {row.original.registerStartDate} ~
                    <br />
                    {row.original.registerEndDate}
                </span>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => (
                <div className="min-w-32">
                    <div>{row.original.category}</div>
                    <div className="text-xs text-muted-foreground">
                        {getCategoryType(row.original.category)}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'selectedVendor',
            header: 'Selected Vendor',
            cell: ({ row }) => (
                <span className="block min-w-32">
                    {row.original.selectedVendor}
                </span>
            ),
        },
        {
            accessorKey: 'like',
            header: 'Like',
            cell: ({ row }) => (
                <span className="font-mono text-xs">{row.original.like}</span>
            ),
        },
        {
            accessorKey: 'viewStatus',
            header: 'View',
            cell: ({ row }) => <ViewBadge value={row.original.viewStatus} />,
        },
        {
            id: 'actions',
            header: () => null,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <ActionMenu
                        review={row.original}
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

function ReviewDetails({ review }: { review: ReviewRecord }) {
    const rows = [
        ['Name', review.name],
        ['NickName or Company', review.nickOrCompany],
        ['Email', review.email],
        [
            'Register Date',
            `${review.registerStartDate} ~ ${review.registerEndDate}`,
        ],
        [
            'Category',
            `${review.category} (${getCategoryType(review.category)})`,
        ],
        ['Selected Vendor', review.selectedVendor],
        ['Like', review.like.toString()],
        ['View', review.viewStatus],
        ['Notes', review.notes],
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <img
                    src={review.thumbnailBefore}
                    alt="Before thumbnail"
                    className="aspect-square w-full rounded-lg border object-cover"
                />
                <img
                    src={review.thumbnailAfter}
                    alt="After thumbnail"
                    className="aspect-square w-full rounded-lg border object-cover"
                />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                {rows.map(([label, value]) => (
                    <div key={label} className="rounded-md border p-3">
                        <div className="text-xs text-muted-foreground">
                            {label}
                        </div>
                        <div className="mt-1 text-sm font-medium">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ViewDialog({
    review,
    open,
    onOpenChange,
}: {
    review: ReviewRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    if (!review) {
return null;
}

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Review Detail</DialogTitle>
                    <DialogDescription>
                        Frontend viewing and project review information.
                    </DialogDescription>
                </DialogHeader>
                <ReviewDetails review={review} />
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ReviewPhoto {
    id: string;
    src: string;
    fileName: string;
    size?: string;
    width?: number;
    height?: number;
    isBefore: boolean;
    isAfter: boolean;
    file?: File;
}

function ReviewPhotoManager({
    photos,
    setPhotos,
    previewPhoto,
    setPreviewPhoto,
}: {
    photos: ReviewPhoto[];
    setPhotos: React.Dispatch<React.SetStateAction<ReviewPhoto[]>>;
    previewPhoto: ReviewPhoto | null;
    setPreviewPhoto: React.Dispatch<React.SetStateAction<ReviewPhoto | null>>;
}) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [filePath, setFilePath] = React.useState('');
    const [pendingPhoto, setPendingPhoto] = React.useState<ReviewPhoto | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setFilePath(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const src = event.target?.result as string;
            const img = new Image();
            img.onload = () => {
                const newPhoto: ReviewPhoto = {
                    id: Math.random().toString(),
                    src,
                    fileName: file.name,
                    size: `${(file.size / 1024).toFixed(1)} KB`,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    isBefore: false,
                    isAfter: false,
                    file: file,
                };
                setPendingPhoto(newPhoto);
                setPreviewPhoto(newPhoto);
            };
            img.src = src;
        };
        reader.readAsDataURL(file);
    };

    const handleFindClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAddClick = () => {
        if (!pendingPhoto) {
return;
}

        setPhotos((prev) => {
            const hasBefore = prev.some((p) => p.isBefore);
            const hasAfter = prev.some((p) => p.isAfter);
            const newPhoto = {
                ...pendingPhoto,
                isBefore: !hasBefore,
                isAfter: hasBefore && !hasAfter,
            };

            return [...prev, newPhoto];
        });
        setPendingPhoto(null);
        setFilePath('');
    };

    const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPhotos((prev) => prev.filter((p) => p.id !== id));

        if (previewPhoto?.id === id) {
            setPreviewPhoto(null);
        }
    };

    const handleToggleRadio = (id: string, type: 'isBefore' | 'isAfter') => {
        setPhotos((prev) =>
            prev.map((p) => {
                if (p.id === id) {
                    return {
                        ...p,
                        isBefore: type === 'isBefore',
                        isAfter: type === 'isAfter',
                    };
                } else {
                    return {
                        ...p,
                        isBefore: type === 'isBefore' ? false : p.isBefore,
                        isAfter: type === 'isAfter' ? false : p.isAfter,
                    };
                }
            })
        );
    };

    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <Input
                        placeholder="Choose photo for upload..."
                        value={filePath}
                        readOnly
                        className="bg-muted cursor-default"
                    />
                    <Button type="button" onClick={handleFindClick} variant="outline" className="shrink-0">
                        Find
                    </Button>
                    <Button
                        type="button"
                        onClick={handleAddClick}
                        disabled={!pendingPhoto}
                        className="shrink-0"
                    >
                        Add
                    </Button>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Photo Gallery</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => setPreviewPhoto(photo)}
                                className={`relative flex flex-col items-center gap-2 rounded-lg border p-2 cursor-pointer transition-all hover:bg-muted ${
                                    previewPhoto?.id === photo.id ? 'border-primary ring-1 ring-primary' : 'border-input'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow hover:bg-destructive/90"
                                >
                                    ×
                                </button>
                                <div className="aspect-square w-full overflow-hidden rounded-md border bg-muted">
                                    <img src={photo.src} alt={photo.fileName} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <label className="flex items-center gap-1 cursor-pointer font-medium">
                                        <input
                                            type="radio"
                                            name={`before-radio-${photo.id}`}
                                            checked={photo.isBefore}
                                            onChange={() => handleToggleRadio(photo.id, 'isBefore')}
                                            className="accent-primary"
                                        />
                                        <span>B</span>
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer font-medium">
                                        <input
                                            type="radio"
                                            name={`after-radio-${photo.id}`}
                                            checked={photo.isAfter}
                                            onChange={() => handleToggleRadio(photo.id, 'isAfter')}
                                            className="accent-primary"
                                        />
                                        <span>A</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                        {photos.length === 0 && (
                            <div className="col-span-full py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                                No photos added yet. Use "Find" and "Add" to upload photos.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-3 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-1.5 flex-1 flex flex-col">
                    <Label className="text-xs text-muted-foreground">Photo Preview & Specs</Label>
                    {previewPhoto ? (
                        <div className="flex-1 flex flex-col justify-between gap-2 mt-1">
                            <div className="aspect-square w-full max-h-[140px] overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                                <img src={previewPhoto.src} alt="Preview" className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="text-[11px] text-muted-foreground space-y-0.5">
                                <div className="font-semibold text-foreground truncate">{previewPhoto.fileName}</div>
                                {previewPhoto.size && <div>Size: {previewPhoto.size}</div>}
                                {previewPhoto.width && previewPhoto.height && (
                                    <div>Dimensions: {previewPhoto.width} × {previewPhoto.height} px</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                            Select a photo or upload one to preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function EditDialog({
    review,
    open,
    onOpenChange,
    onSave,
}: {
    review: ReviewRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (review: ReviewRecord, options?: any) => void;
}) {
    const [form, setForm] = React.useState<ReviewRecord | null>(review);
    const [photos, setPhotos] = React.useState<ReviewPhoto[]>([]);
    const [previewPhoto, setPreviewPhoto] = React.useState<ReviewPhoto | null>(null);
    const [clients, setClients] = React.useState<any[]>([]);
    const { errors: serverErrors } = usePage().props as any;

    const displayErrors = {
        name: serverErrors?.name,
        email: serverErrors?.email,
        registerStartDate: serverErrors?.register_start_date,
        registerEndDate: serverErrors?.register_end_date,
        category: serverErrors?.category,
        selectedVendor: serverErrors?.selected_vendor,
        nickOrCompany: serverErrors?.nick_or_company,
        notes: serverErrors?.notes,
    };

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

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm(review);

        if (review) {
            const initialPhotos: ReviewPhoto[] = [];

            if (review.thumbnailBefore) {
                initialPhotos.push({
                    id: 'before',
                    src: review.thumbnailBefore,
                    fileName: 'Before Thumbnail',
                    isBefore: true,
                    isAfter: false,
                });
            }

            if (review.thumbnailAfter) {
                initialPhotos.push({
                    id: 'after',
                    src: review.thumbnailAfter,
                    fileName: 'After Thumbnail',
                    isBefore: false,
                    isAfter: true,
                });
            }

            setPhotos(initialPhotos);
            setPreviewPhoto(initialPhotos[0] || null);
        } else {
            setPhotos([]);
            setPreviewPhoto(null);
        }
    }, [review]);

    if (!form) {
        return null;
    }

    const currentForm = form;

    function handleChange<K extends keyof ReviewRecord>(
        key: K,
        value: ReviewRecord[K],
    ) {
        setForm((prev) => {
            if (!prev) {
return prev;
}

            if (key === 'registerStartDate') {
                return {
                    ...prev,
                    registerStartDate: value as string,
                    registerEndDate: value as string,
                };
            }

            return { ...prev, [key]: value };
        });
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();
        const beforePhoto = photos.find((p) => p.isBefore);
        const afterPhoto = photos.find((p) => p.isAfter);
        const updatedRecord = {
            ...currentForm,
            thumbnailBefore: beforePhoto ? beforePhoto.src : dummyImage,
            thumbnailAfter: afterPhoto ? afterPhoto.src : dummyImage,
            thumbnail_before_file: beforePhoto ? beforePhoto.file : undefined,
            thumbnail_after_file: afterPhoto ? afterPhoto.file : undefined,
        };
        onSave(updatedRecord as any, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Review</DialogTitle>
                    <DialogDescription>
                        Update local UI review information and thumbnails.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <div className="flex flex-col gap-1.5 border-b pb-4 mb-2">
                        <Label htmlFor="edit-client-select">Select Existing Client (Autofill)</Label>
                        <Select
                            onValueChange={(val) => {
                                if (val === 'manual') return;
                                const client = clients.find((c) => c.id.toString() === val);
                                if (client) {
                                    handleChange('name', client.name);
                                    handleChange('email', client.mail !== '-' ? client.mail : '');
                                    handleChange('nickOrCompany', client.nickOrCompany !== '-' ? client.nickOrCompany : '');
                                }
                            }}
                        >
                            <SelectTrigger id="edit-client-select" className="w-full">
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

                    <ReviewPhotoManager
                        photos={photos}
                        setPhotos={setPhotos}
                        previewPhoto={previewPhoto}
                        setPreviewPhoto={setPreviewPhoto}
                    />

                    <div className="grid gap-3 sm:grid-cols-2 border-t pt-4">
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name">Nick Nama</Label>
                                <Input
                                    id="edit-name"
                                    value={form.name}
                                    onChange={(event) =>
                                        handleChange('name', event.target.value)
                                    }
                                    className={displayErrors.name ? 'border-destructive' : ''}
                                />
                                {displayErrors.name && (
                                    <span className="text-xs text-destructive">{displayErrors.name}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        handleChange('email', event.target.value)
                                    }
                                    className={displayErrors.email ? 'border-destructive' : ''}
                                />
                                {displayErrors.email && (
                                    <span className="text-xs text-destructive">{displayErrors.email}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-start-date">Register Date</Label>
                                <Input
                                    id="edit-start-date"
                                    type="date"
                                    value={form.registerStartDate}
                                    onChange={(event) =>
                                        handleChange('registerStartDate', event.target.value)
                                    }
                                    className={displayErrors.registerStartDate ? 'border-destructive' : ''}
                                />
                                {displayErrors.registerStartDate && (
                                    <span className="text-xs text-destructive">{displayErrors.registerStartDate}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-vendor">Selected Vendor</Label>
                                <Select
                                    value={form.selectedVendor}
                                    onValueChange={(value) =>
                                        handleChange(
                                            'selectedVendor',
                                            value as ReviewRecord['selectedVendor'],
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit-vendor" className={`w-full ${displayErrors.selectedVendor ? 'border-destructive' : ''}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VENDOR_OPTIONS.map((vendor) => (
                                            <SelectItem key={vendor} value={vendor}>
                                                {vendor}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {displayErrors.selectedVendor && (
                                    <span className="text-xs text-destructive">{displayErrors.selectedVendor}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(value) =>
                                        handleChange(
                                            'category',
                                            value as ReviewRecord['category'],
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit-category" className={`w-full ${displayErrors.category ? 'border-destructive' : ''}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_OPTIONS.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {displayErrors.category && (
                                    <span className="text-xs text-destructive">{displayErrors.category}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-project">Project Name</Label>
                                <Input
                                    id="edit-project"
                                    value={form.nickOrCompany}
                                    onChange={(event) =>
                                        handleChange('nickOrCompany', event.target.value)
                                    }
                                    className={displayErrors.nickOrCompany ? 'border-destructive' : ''}
                                />
                                {displayErrors.nickOrCompany && (
                                    <span className="text-xs text-destructive">{displayErrors.nickOrCompany}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 rounded-md border p-3">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                                checked={form.selected}
                                onCheckedChange={(checked) =>
                                    handleChange('selected', checked === true)
                                }
                            />
                            Select for viewing
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                                checked={form.top8}
                                onCheckedChange={(checked) =>
                                    handleChange('top8', checked === true)
                                }
                            />
                            Top 8
                        </label>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="edit-notes">Contents</Label>
                        <textarea
                            id="edit-notes"
                            className={`min-h-24 w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ${displayErrors.notes ? 'border-destructive' : ''}`}
                            value={form.notes}
                            onChange={(event) =>
                                handleChange('notes', event.target.value)
                            }
                        />
                        {displayErrors.notes && (
                            <span className="text-xs text-destructive">{displayErrors.notes}</span>
                        )}
                    </div>
                    <DialogFooter>
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

function DeleteDialog({
    review,
    open,
    onOpenChange,
    onConfirm,
}: {
    review: ReviewRecord | null;
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: () => void;
}) {
    if (!review) {
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
                            <DialogTitle>Delete Review</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Delete review from{' '}
                    <span className="font-semibold text-foreground">
                        {review.name}
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

// ─── Add Review Dialog ────────────────────────────────────────────────────────
const emptyForm = {
    name: '',
    nickOrCompany: '',
    email: '',
    selected: false,
    top8: false,
    thumbnailBefore: dummyImage,
    thumbnailAfter: dummyImage,
    registerStartDate: new Date().toISOString().split('T')[0],
    registerEndDate: new Date().toISOString().split('T')[0],
    category: 'Total Interior' as ReviewRecord['category'],
    selectedVendor: 'Manlab Direct' as ReviewRecord['selectedVendor'],
    like: 0,
    viewStatus: 'Hidden' as ReviewRecord['viewStatus'],
    notes: '',
};

function AddReviewDialog({
    onAdd,
}: {
    onAdd: (review: ReviewRecord, options?: any) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState(emptyForm);
    const [errors, setErrors] = React.useState<Partial<typeof emptyForm>>({});
    const [photos, setPhotos] = React.useState<ReviewPhoto[]>([]);
    const [previewPhoto, setPreviewPhoto] = React.useState<ReviewPhoto | null>(null);
    const [clients, setClients] = React.useState<any[]>([]);
    const { errors: serverErrors } = usePage().props as any;

    const displayErrors = {
        name: errors.name || serverErrors?.name,
        email: errors.email || serverErrors?.email,
        registerStartDate: serverErrors?.register_start_date,
        registerEndDate: serverErrors?.register_end_date,
        category: serverErrors?.category,
        selectedVendor: serverErrors?.selected_vendor,
        nickOrCompany: serverErrors?.nick_or_company,
        notes: serverErrors?.notes,
    };

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mandorlab_clients');
            if (saved) {
                try {
                    setClients(JSON.parse(saved));
                } catch (e) {}
            }
        }
    }, [open]);

    function handleChange<K extends keyof typeof emptyForm>(
        field: K,
        value: (typeof emptyForm)[K],
    ) {
        setForm((prev) => {
            if (field === 'registerStartDate') {
                return {
                    ...prev,
                    registerStartDate: value as string,
                    registerEndDate: value as string,
                };
            }

            return { ...prev, [field]: value };
        });
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate() {
        const errs: Partial<typeof emptyForm> = {};

        if (!form.name.trim()) {
            errs.name = 'Name is required' as any;
        }

        if (!form.email.trim()) {
            errs.email = 'Email is required' as any;
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

        const beforePhoto = photos.find((p) => p.isBefore);
        const afterPhoto = photos.find((p) => p.isAfter);

        onAdd({
            ...form,
            id: Date.now(),
            thumbnailBefore: beforePhoto ? beforePhoto.src : dummyImage,
            thumbnailAfter: afterPhoto ? afterPhoto.src : dummyImage,
            thumbnail_before_file: beforePhoto ? beforePhoto.file : undefined,
            thumbnail_after_file: afterPhoto ? afterPhoto.file : undefined,
            viewStatus: form.selected ? 'Viewing' : 'Hidden',
        } as any, {
            onSuccess: () => {
                setForm(emptyForm);
                setErrors({});
                setPhotos([]);
                setPreviewPhoto(null);
                setOpen(false);
            }
        });
    }

    function handleOpenChange(v: boolean) {
        setOpen(v);

        if (!v) {
            setForm(emptyForm);
            setErrors({});
            setPhotos([]);
            setPreviewPhoto(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                    <Plus className="size-4" />
                    <span className="hidden sm:inline">Add Review</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Star className="size-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle>Add New Review</DialogTitle>
                            <DialogDescription>
                                Fill in the review details below.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="flex flex-col gap-1.5 border-b pb-4 mb-2">
                        <Label htmlFor="add-client-select">Select Existing Client (Autofill)</Label>
                        <Select
                            onValueChange={(val) => {
                                if (val === 'manual') return;
                                const client = clients.find((c) => c.id.toString() === val);
                                if (client) {
                                    handleChange('name', client.name);
                                    handleChange('email', client.mail !== '-' ? client.mail : '');
                                    handleChange('nickOrCompany', client.nickOrCompany !== '-' ? client.nickOrCompany : '');
                                }
                            }}
                        >
                            <SelectTrigger id="add-client-select" className="w-full">
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
                    <ReviewPhotoManager
                        photos={photos}
                        setPhotos={setPhotos}
                        previewPhoto={previewPhoto}
                        setPreviewPhoto={setPreviewPhoto}
                    />

                    <div className="grid gap-3 sm:grid-cols-2 border-t pt-4">
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-name">
                                    Nick Nama <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="add-name"
                                    placeholder="Masukkan Nick Nama..."
                                    value={form.name}
                                    onChange={(event) =>
                                        handleChange('name', event.target.value)
                                    }
                                    className={displayErrors.name ? 'border-destructive' : ''}
                                />
                                {displayErrors.name && (
                                    <span className="text-xs text-destructive">{displayErrors.name}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="add-email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="add-email"
                                    type="email"
                                    placeholder="Masukkan Email..."
                                    value={form.email}
                                    onChange={(event) =>
                                        handleChange('email', event.target.value)
                                    }
                                    className={displayErrors.email ? 'border-destructive' : ''}
                                />
                                {displayErrors.email && (
                                    <span className="text-xs text-destructive">{displayErrors.email}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="add-start-date">Register Date</Label>
                                <Input
                                    id="add-start-date"
                                    type="date"
                                    value={form.registerStartDate}
                                    onChange={(event) =>
                                        handleChange('registerStartDate', event.target.value)
                                    }
                                    className={displayErrors.registerStartDate ? 'border-destructive' : ''}
                                />
                                {displayErrors.registerStartDate && (
                                    <span className="text-xs text-destructive">{displayErrors.registerStartDate}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="add-vendor">Selected Vendor</Label>
                                <Select
                                    value={form.selectedVendor}
                                    onValueChange={(value) =>
                                        handleChange(
                                            'selectedVendor',
                                            value as ReviewRecord['selectedVendor'],
                                        )
                                    }
                                >
                                    <SelectTrigger id="add-vendor" className={`w-full ${displayErrors.selectedVendor ? 'border-destructive' : ''}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VENDOR_OPTIONS.map((vendor) => (
                                            <SelectItem key={vendor} value={vendor}>
                                                {vendor}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {displayErrors.selectedVendor && (
                                    <span className="text-xs text-destructive">{displayErrors.selectedVendor}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="add-category">Category</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(value) =>
                                        handleChange(
                                            'category',
                                            value as ReviewRecord['category'],
                                        )
                                    }
                                >
                                    <SelectTrigger id="add-category" className={`w-full ${displayErrors.category ? 'border-destructive' : ''}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORY_OPTIONS.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {displayErrors.category && (
                                    <span className="text-xs text-destructive">{displayErrors.category}</span>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="add-project">Project Name</Label>
                                <Input
                                    id="add-project"
                                    placeholder="Masukkan Project Name..."
                                    value={form.nickOrCompany}
                                    onChange={(event) =>
                                        handleChange('nickOrCompany', event.target.value)
                                    }
                                    className={displayErrors.nickOrCompany ? 'border-destructive' : ''}
                                />
                                {displayErrors.nickOrCompany && (
                                    <span className="text-xs text-destructive">{displayErrors.nickOrCompany}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 rounded-md border p-3">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                                checked={form.selected}
                                onCheckedChange={(checked) =>
                                    handleChange('selected', checked === true)
                                }
                            />
                            Select for viewing
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                                checked={form.top8}
                                onCheckedChange={(checked) =>
                                    handleChange('top8', checked === true)
                                }
                            />
                            Top 8
                        </label>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="add-notes">Contents</Label>
                        <textarea
                            id="add-notes"
                            className={`min-h-24 w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 ${displayErrors.notes ? 'border-destructive' : ''}`}
                            placeholder="Masukkan detail review..."
                            value={form.notes}
                            onChange={(event) =>
                                handleChange('notes', event.target.value)
                            }
                        />
                        {displayErrors.notes && (
                            <span className="text-xs text-destructive">{displayErrors.notes}</span>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Add Review</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function ReviewDataTable({
    serverReviews = [],
}: {
    serverReviews?: ReviewRecord[];
}) {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    const [data, setData] = React.useState<ReviewRecord[]>(serverReviews);

    React.useEffect(() => {
        setData(serverReviews);
    }, [serverReviews]);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [viewTarget, setViewTarget] = React.useState<ReviewRecord | null>(
        null,
    );
    const [editTarget, setEditTarget] = React.useState<ReviewRecord | null>(
        null,
    );
    const [deleteTarget, setDeleteTarget] = React.useState<ReviewRecord | null>(
        null,
    );

    function updateReview(updated: ReviewRecord, options?: any) {
        router.post(`/dashboard/review/${updated.id}`, {
            ...updated,
            _method: 'PUT',
        } as any, options);
    }

    function handleAdd(newReview: ReviewRecord, options?: any) {
        router.post('/dashboard/review', newReview as any, options);
    }

    function toggleSelected(review: ReviewRecord) {
        updateReview({
            ...review,
            selected: !review.selected,
            viewStatus: !review.selected ? 'Viewing' : 'Hidden',
        });
    }

    function toggleTop8(review: ReviewRecord) {
        const activeTopCount = data.filter((item) => item.top8).length;

        if (!review.top8 && activeTopCount >= 8) {
            return;
        }

        updateReview({ ...review, top8: !review.top8 });
    }

    function deleteReview() {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/dashboard/review/${deleteTarget.id}`);
        setDeleteTarget(null);
    }

    const columns = React.useMemo(
        () =>
            createColumns({
                onToggleSelected: toggleSelected,
                onToggleTop8: toggleTop8,
                onView: setViewTarget,
                onEdit: setEditTarget,
                onDelete: setDeleteTarget,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data],
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
                        onChange={(event) =>
                            setGlobalFilter(event.target.value)
                        }
                        placeholder="Search reviews..."
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
                    {isAdmin && <AddReviewDialog onAdd={handleAdd} />}
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
                                        className="h-24 text-center"
                                    >
                                        No reviews found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} review(s)
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
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="size-4" />
                    </Button>
                </div>
            </div>

            <ViewDialog
                review={viewTarget}
                open={Boolean(viewTarget)}
                onOpenChange={(open) => !open && setViewTarget(null)}
            />
            <EditDialog
                review={editTarget}
                open={Boolean(editTarget)}
                onOpenChange={(open) => !open && setEditTarget(null)}
                onSave={updateReview}
            />
            <DeleteDialog
                review={deleteTarget}
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={deleteReview}
            />
        </div>
    );
}
