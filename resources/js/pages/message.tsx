import { Head } from '@inertiajs/react';
import { createModuleBreadcrumbs } from '@/components/empty-module-page';
import { MessageDataTable } from '@/components/message-data-table';

export default function Message({ messages }: { messages?: any[] }) {
    return (
        <>
            <Head title="Message Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Message Management
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor welcome, quotation, and other outbound email
                        messages with request, result, and send-time status.
                    </p>
                </div>
                <MessageDataTable serverMessages={messages} />
            </div>
        </>
    );
}

Message.layout = {
    breadcrumbs: createModuleBreadcrumbs(
        'Message Management',
        '/dashboard/message',
    ),
};
