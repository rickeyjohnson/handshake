import type React from 'react'
import Sidebar from '../Sidebar'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className="min-w-screen min-h-dvh bg-stone-50 text-slate-950 grid gap-4 p-4 grid-cols-[16rem_1fr]">
			<Sidebar />

			<main className="box-border bg-white rounded-2xl shadow max-h-[200vh] min-h-[100vh-16px] w-full p-4 pt-5 flex flex-col">
				{children}
			</main>
		</div>
	)
}

export default MainLayout
