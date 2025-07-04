import { IconCash, IconDashboard, IconMoneybag, IconTable, IconTargetArrow, type Icon } from "@tabler/icons-react"

type navItem = {
    title: string
    url: string
    icon?: Icon
}

const Sidebar = () => {
    const nav = [
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
        <div>
            
        </div>
    )
}

export default Sidebar