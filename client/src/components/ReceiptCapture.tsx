import { useEffect, useRef } from 'react'

const ReceiptCapture = () => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}
		}).catch((err) => console.error("Error accessing camera", err))

		return () => {
			videoRef.current?.srcObject &&
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach((track) => track.stop())
		}
	}, [])
	return <div>
        { videoRef ? (<video ref={videoRef} autoPlay playsInline className=''/>) : (<p>Requesting camera</p>)}
    </div>
}

export default ReceiptCapture
