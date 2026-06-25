import EmptyModulePage, {
    createModuleBreadcrumbs,
} from '@/components/empty-module-page';

export default function AppSettings() {
    return <EmptyModulePage title="Settings" />;
}

AppSettings.layout = {
    breadcrumbs: createModuleBreadcrumbs('Settings', '/dashboard/settings'),
};
