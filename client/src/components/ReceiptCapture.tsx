import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'

const ReceiptCapture = ({
	onCapture,
}: {
	onCapture: (url: string) => void
}) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [cameraAccessed, setCameraAccessed] = useState<boolean>(false)

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

	const requestCameraAccess = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream
				}
				setCameraAccessed(true)
			})
			.catch((err) => console.error('Error accessing camera', err))
	}

	useEffect(() => {
		requestCameraAccess()

		return () => {
			videoRef.current?.srcObject &&
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop())
		}
	}, [])

	return (
		<div>
			{cameraAccessed ? (
				<>
					<video ref={videoRef} autoPlay playsInline />
					<Button onClick={capture}>Capture</Button>
					<canvas ref={canvasRef} />
				</>
			) : (
				<div>
					<p>Requesting camera...</p>
					<Button onClick={requestCameraAccess}>Request Camera</Button>
				</div>
			)}
		</div>
	)
}

export default ReceiptCapture
