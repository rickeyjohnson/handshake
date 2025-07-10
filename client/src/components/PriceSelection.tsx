import { useEffect, useRef } from "react"

// remove any before pushing
const PriceSelection = ({ prices, image_url }: { prices: any, image_url: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const displayProcessedImage = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')

        if (!canvas || !ctx) return

        const image = new Image()
        image.src = image_url

        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height

            ctx.drawImage(image, 0, 0)
        }
    }

    useEffect(() => {
        displayProcessedImage()
    }, [])

	return <div>
        <div>{prices.text}</div>
        <canvas ref={canvasRef}/>
        <br />
        <pre>{JSON.stringify(prices, null, "\t")}</pre>
    </div>
}

export default PriceSelection
