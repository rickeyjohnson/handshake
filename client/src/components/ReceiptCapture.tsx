import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/Button'
import { IconCamera } from '@tabler/icons-react'

const ReceiptCapture = ({
	onCapture,
}: {
	onCapture: (url: string) => void
}) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [status, setStatus] = useState<string>('REQUEST') // REQUEST, LOADING, SUCCESS, ERROR

	const loadCamera = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				if (videoRef.current) {
					videoRef.current.srcObject = stream
				}
				setStream(stream)
				setStatus('SUCCESS')
			})
			.catch((err) => {
				setStatus('DENIED')
				console.error('Error accessing camera', err)
			})
	}

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

	const handleRequestCameraClick = () => {
		setStatus('REQUEST')
		loadCamera()
	}

	const render = (status: string) => {
		switch (status) {
			case 'REQUEST':
				return <p>Requesting Camera ...</p>
			case 'LOADING':
				return <p>Loading Camera ...</p>
			case 'DENIED':
				return (
					<>
						<p>Failed to access camera</p>
						<Button onClick={handleRequestCameraClick}>
							Try Again
						</Button>
					</>
				)
			case 'SUCCESS':
				return (
					<>
						<h1>
							Capture Image of Your Receipt to Add as an Expense
						</h1>
						<video
							ref={videoRef}
							className="rounded-lg shadow-2xl"
							autoPlay
							playsInline
						/>
						<Button
							onClick={capture}
							className="flex gap-2 align-center items-center self-center"
						>
							<IconCamera size={18} />
							Capture Image
						</Button>
						<canvas
							ref={canvasRef}
							className="rounded-lg shadow-2xl"
							style={{ display: 'none' }}
						/>
					</>
				)

			default:
				return <p>Error</p>
		}
	}

	useEffect(() => {
		if (status === 'SUCCESS' && videoRef.current && stream) {
			videoRef.current.srcObject = stream
		}
	}, [status, stream])

	useEffect(() => {
		loadCamera()

		return () => {
			videoRef.current?.srcObject &&
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop())
		}
	}, [])

	return (
		<div className="flex flex-col gap-3 w-full h-full justify-center items-center">
			{render(status)}
		</div>
	)
}

export default ReceiptCapture
