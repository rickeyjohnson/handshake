import { IconCash, IconDashboard, IconMoneybag, IconTable, IconTargetArrow, type Icon } from "@tabler/icons-react"
import { LogoutButton } from "../LogoutButton"
import SidebarAccountInfo from "./SidebarAccountInfo"
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
        <nav className="overflow-y-scroll sticky top-4 h-[calc(100dvh-2rem)] flex flex-col">
            <div className="grow-1">
                <h1 className="text-lg font-medium px-2 py-2 border-b-1 border-b-stone-300 mb-2">Handshake</h1>
                
                {
                    nav.map(item => {
                        return (
                            <Button variant="dashboard" className="my-0.5">
                                <item.icon size={18}/>
                                {item.title}
                            </Button>
                        )
                    })
                }
            </div>

            <div className="">
                <LogoutButton />
                <SidebarAccountInfo name={"John Doe"} email={"johndoe@example.com"}/>
            </div>
        </nav>
    )
}

export default Sidebar