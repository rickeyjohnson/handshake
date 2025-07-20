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
		<div className="flex flex-wrap w-full mb-4 relative gap-2">
			<div className="grow">
				<h1 className="font-medium text-3xl capitalize">{title}</h1>
				<p className="text-gray-500 capitalize">{caption}</p>
			</div>
			{children}
		</div>
	)
}

export default MainHeader
