import EmptyModulePage, {
    createModuleBreadcrumbs,
} from '@/components/empty-module-page';

export default function MultiLanguage() {
    return <EmptyModulePage title="Multi Language" />;
}

MultiLanguage.layout = {
    breadcrumbs: createModuleBreadcrumbs(
        'Multi Language',
        '/dashboard/multi-language',
    ),
};
