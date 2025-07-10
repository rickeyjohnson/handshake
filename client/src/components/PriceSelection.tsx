// remove any before pushing
const PriceSelection = ({ prices }: { prices: any }) => {
	return <div>
        <div>{prices.text}</div>
        <br />
        <pre>{JSON.stringify(prices, null, "\t")}</pre>
    </div>
}

export default PriceSelection
