import { Head } from '@inertiajs/react';
import { CustomerDataTable } from '@/components/customer-data-table';
import { createModuleBreadcrumbs } from '@/components/empty-module-page';

export default function Client({ clients }: { clients?: any[] }) {
    return (
        <>
            <Head title="Client Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Client Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and monitor all client records, quotations, and
                        consulting replies.
                    </p>
                </div>
                <CustomerDataTable serverClients={clients} />
            </div>
        </>
    );
}

Client.layout = {
    breadcrumbs: createModuleBreadcrumbs(
        'Client Management',
        '/dashboard/client',
    ),
};
