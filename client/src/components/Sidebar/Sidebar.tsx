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
        <nav className="">
            <ul className="">
                <li className="">
                    <h1 className="">Handshake</h1>
                </li>
                {
                    nav.map((item) => {
                        return (
                            <li className="flex gap-2">
                                 {item.icon && <item.icon />}
                                 {item.title}
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    )
}

export default Sidebar