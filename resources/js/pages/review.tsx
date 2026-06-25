import { Head } from '@inertiajs/react';
import { createModuleBreadcrumbs } from '@/components/empty-module-page';
import { ReviewDataTable } from '@/components/review-data-table';

export default function Review({ reviews }: { reviews?: any[] }) {
    return (
        <>
            <Head title="Review Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Review Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage selected review items, top 8 placement,
                        thumbnails, category, vendor, and frontend visibility.
                    </p>
                </div>
                <ReviewDataTable serverReviews={reviews} />
            </div>
        </>
    );
}

Review.layout = {
    breadcrumbs: createModuleBreadcrumbs(
        'Review Management',
        '/dashboard/review',
    ),
};
