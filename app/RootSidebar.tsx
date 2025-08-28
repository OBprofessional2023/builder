'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { QueueListIcon, NewspaperIcon, HomeIcon, DocumentDuplicateIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function RootSidebar() {
    const pathname = usePathname();

    const links = [
        { name: 'Home', href: '/dashboard', icon: HomeIcon },
        { name: 'Builder', href: '/dashboard/builder', icon: DocumentDuplicateIcon },
        { name: 'Lists', href: '/dashboard/lists', icon: UserGroupIcon },
        { name: 'Job Board', href: '/dashboard/jobboard', icon: QueueListIcon },
        { name: 'Applicatons', href: '/dashboard/applications', icon: NewspaperIcon },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <nav className="flex flex-col gap-3">
                {links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'flex items-center gap-2 rounded-md p-2 hover:text-yellow-400',
                                {
                                    'bg-gray-700 text-yellow-400': pathname?.startsWith(link.href),
                                    'text-white': !pathname?.startsWith(link.href)
                                }
                            )}
                        >
                            <LinkIcon className="w-5 h-5" />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
