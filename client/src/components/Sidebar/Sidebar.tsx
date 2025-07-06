import { IconCash, IconDashboard, IconMoneybag, IconTable, IconTargetArrow, IconUsers, type Icon } from "@tabler/icons-react"
import { LogoutButton } from "../LogoutButton"
import SidebarAccountInfo from "./SidebarAccountInfo"

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
        <nav className="overflow-y-scroll sticky top-4 h-screen flex flex-col">
            <div className="">
                <h1>Handshake</h1>
            </div>

            {
                nav.map(item => {
                    return (
                        <div>
                            {item.title}
                        </div>
                    )
                })
            }

            <div className="">
                <SidebarAccountInfo name={"John Doe"} email={"johndoe@example.com"}/>
                <LogoutButton />
            </div>
        </nav>
    )
}

export default Sidebar