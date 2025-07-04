import { IconCash, IconDashboard, IconMap, IconMoneybag, IconTable, IconTargetArrow, IconUsers, type Icon } from "@tabler/icons-react"

type navItem = {
    title: string
    url: string
    icon?: Icon
}

const Sidebar = () => {
    const nav: navItem[] = [
        {
            title: 'Dashboard',
            url: '#',
            icon:  IconDashboard,
        },
        {
            title: 'Transactions',
            url: '#',
            icon:  IconTable,
        },
        {
            title: 'Spending',
            url: '#',
            icon:  IconCash,
        },
        {
            title: 'Budget',
            url: '#',
            icon:  IconMoneybag,
        },
        {
            title: 'Goals',
            url: '#',
            icon:  IconTargetArrow,
        }
    ]
    return (
        <div className="w-40">
            <div className="flex gap-3">
                <IconUsers />
                <h1>Handshake</h1>
            </div>
            <div>
                <div className="flex gap-2 hover:bg-gray-200">
                    <IconMap />
                    <h1>Maps</h1>
                </div>
                <div className="flex gap-2 hover:bg-gray-200">
                    <IconMap />
                    <h1>Maps</h1>
                </div>
                <div className="flex gap-2 hover:bg-gray-200">
                    <IconMap />
                    <h1>Maps</h1>
                </div>
                <div className="flex gap-2 hover:bg-gray-200">
                    <IconMap />
                    <h1>Maps</h1>
                </div>
            </div>
        </div>
    )
}

export default Sidebar