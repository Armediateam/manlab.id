import EmptyModulePage, {
    createModuleBreadcrumbs,
} from '@/components/empty-module-page';

export default function Notification() {
    return <EmptyModulePage title="Notification" />;
}

Notification.layout = {
    breadcrumbs: createModuleBreadcrumbs(
        'Notification',
        '/dashboard/notifications',
    ),
};
