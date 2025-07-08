import React from 'react'

const MainHeader = ({
	title,
	caption,
	children,
}: {
	title: String
	caption?: string
	children?: React.ReactNode
}) => {
	return (
		<div className="px-5 p-4 flex w-full">
			<div className="grow">
				<h1 className="font-medium text-3xl">{title}</h1>
				<p className="text-gray-500 capitalize">{caption}</p>
			</div>
			{children}
		</div>
	)
}

export default MainHeader
