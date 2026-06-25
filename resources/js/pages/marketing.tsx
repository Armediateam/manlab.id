import EmptyModulePage, {
    createModuleBreadcrumbs,
} from '@/components/empty-module-page';

export default function Marketing() {
    return <EmptyModulePage title="Marketing" />;
}

Marketing.layout = {
    breadcrumbs: createModuleBreadcrumbs('Marketing', '/dashboard/marketing'),
};
