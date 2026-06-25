import { Head } from '@inertiajs/react';
import { createModuleBreadcrumbs } from '@/components/empty-module-page';
import { UserDataTable } from '@/components/user-data-table';

export default function User() {
    return (
        <>
            <Head title="Admin / User Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Admin / User Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage members, authority privileges, phone numbers, and password credentials.
                    </p>
                </div>
                <UserDataTable />
            </div>
        </>
    );
}

User.layout = {
    breadcrumbs: createModuleBreadcrumbs('Admin / User', '/dashboard/user'),
};
