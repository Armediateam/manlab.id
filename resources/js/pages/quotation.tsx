import { Head } from '@inertiajs/react';
import { createModuleBreadcrumbs } from '@/components/empty-module-page';
import { QuotationDataTable } from '@/components/quotation-data-table';

export default function Quotation({ quotations, clients }: { quotations?: any[]; clients?: any[] }) {
    return (
        <>
            <Head title="Quotation Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Quotation Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage customer quotation requests, service details, and
                        visit schedules.
                    </p>
                </div>
                <QuotationDataTable serverQuotations={quotations} serverClients={clients} />
            </div>
        </>
    );
}

Quotation.layout = {
    breadcrumbs: createModuleBreadcrumbs(
        'Quotation Management',
        '/dashboard/quotation',
    ),
};
