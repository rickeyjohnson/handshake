import type React from "react"
import { useUser } from "../../contexts/UserContext"
import Sidebar from "../Sidebar/Sidebar"
import { useLocation } from "react-router"

const MainLayout = ({ children }: { children?: React.ReactNode}) => {
    const location = useLocation()

    return (
        <div className='min-w-screen min-h-dvh bg-stone-50 text-slate-950 grid gap-4 p-4 grid-cols-[250px_1fr]'>
            <Sidebar />

            <main className='box-border bg-white rounded-2xl pb-4 shadow h-[200vh]'>
                {children}
            </main>
        </div>
    )
}

export default MainLayout