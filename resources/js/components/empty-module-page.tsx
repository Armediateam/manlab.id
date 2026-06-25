import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type EmptyModulePageProps = {
    title: string;
};

export default function EmptyModulePage({ title }: EmptyModulePageProps) {
    return (
        <>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

export function createModuleBreadcrumbs(
    title: string,
    href: string,
): BreadcrumbItem[] {
    return [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title,
            href,
        },
    ];
}
