import { IconCash, IconDashboard, IconMap, IconMoneybag, IconTable, IconTargetArrow, IconUsers, type Icon } from "@tabler/icons-react"
import { Button } from "../Button"

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
        <div className="w-40">
            <div className="flex gap-3">
                <IconUsers />
                <h1>Handshake</h1>
            </div>
            <div>
                {
                    nav.map((item) => {
                        return (
                            <Button className="flex gap-2" variant="ghost">
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Sidebar