import { IconDotsVertical } from "@tabler/icons-react"
import AccountMenu from "./AccountMenu"

type SidebarAccountInfoType = {
    className?: string
    name: string
    email: string
}

const SidebarAccountInfo = ({ className, name, email }: SidebarAccountInfoType) => {
  return (
    <>
        <div className={`flex gap-2.5 ${className} items-center w-full hover:bg-stone-200/50 p-2 rounded-lg`}>
            <img className='h-7 w-7 object-cover rounded-lg' src='https://baconmockup.com/250/250/'/>
            <div className="flex flex-col gap">
                <h1 className="font-medium text-sm">{name}</h1>
                <p className="text-gray-500 text-xs">{email}</p>
            </div>
            <IconDotsVertical className="ml-auto" size={16}/>
        </div>
        <AccountMenu />
    </>
  )
}

export default SidebarAccountInfo