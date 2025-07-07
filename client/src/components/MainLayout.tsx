import type React from 'react'
import Sidebar from './Sidebar'

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className="min-w-screen min-h-dvh bg-stone-50 text-slate-950 grid gap-4 p-4 grid-cols-[16rem_1fr]">
			<Sidebar />

			<main className="box-border bg-white rounded-2xl pb-4 shadow max-h-[200vh] min-h-[screen - 16px]">
				{children}
			</main>
		</div>
	)
}

export default MainLayout
