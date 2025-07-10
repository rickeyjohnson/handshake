import { useEffect, useRef } from 'react'

const ReceiptCapture = () => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}
		})

		return () => {
			videoRef.current?.srcObject &&
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop())
		}
	}, [])
	return <div>
        <video ref={videoRef} autoPlay playsInline className=''/>
    </div>
}

export default ReceiptCapture
