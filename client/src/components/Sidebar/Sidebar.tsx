import { IconCash, IconDashboard, IconMoneybag, IconTable, IconTargetArrow, IconUsers, type Icon } from "@tabler/icons-react"

type navItem = {
    title: string
    url: string
    icon: Icon
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
        <aside className="box-border w-xs mx-6">
            <div className="flex gap-3 mt-5 mb-2">
                <h1 className="text-xl font-medium tracking-wide">Handshake</h1>
            </div>
            <div className="">
                {
                    nav.map((item) => {
                        return (
                            <div className="rounded-xl flex gap-2 hover:bg-neutral-200 p-2 my-1">
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </div>
                        )
                    })
                }
            </div>
        </aside>
    )
}

export default Sidebar