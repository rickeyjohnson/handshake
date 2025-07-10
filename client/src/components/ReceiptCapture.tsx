import { useEffect, useRef } from 'react'
import { Button } from './Button'

const ReceiptCapture = ({
	onCapture,
}: {
	onCapture: (url: string) => void
}) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream
				}
			})
			.catch((err) => console.error('Error accessing camera', err))

		return () => {
			videoRef.current?.srcObject &&
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop())
		}
	}, [])

	const capture = () => {
		const video = videoRef.current
		const canvas = canvasRef.current

		if (!video || !canvas) return

		canvas.width = video.videoWidth
		canvas.height = video.videoHeight

		const ctx = canvas.getContext('2d')
		if (ctx) {
			ctx.drawImage(video, 0, 0)
			onCapture(canvas.toDataURL('image/png'))
		}
	}

	return (
		<div>
			{videoRef.current ? (
				<div>
					<video ref={videoRef} autoPlay playsInline className="" />
					<Button onClick={capture}>Capture</Button>
					<canvas ref={canvasRef} />
				</div>
			) : (
				<p>Requesting camera</p>
			)}
		</div>
	)
}

export default ReceiptCapture
