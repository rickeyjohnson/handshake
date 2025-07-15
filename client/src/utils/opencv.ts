import cvReadyPromise from '@techstark/opencv-js'

export const getOpenCv = async () => {
    const cv = await cvReadyPromise
    console.log('OpenCV.js is ready!')
    return cv
}

export const preprocessImage = async (canvas: HTMLCanvasElement) => {
    const cv = await getOpenCv()
    const src = cv.imread(canvas)

    // 1. grayscale image
    const gray = new cv.Mat()
    cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY, 0)

    // 2. threshold
    const bw = new cv.Mat()
    cv.threshold(gray, bw, 150, 255, cv.THRESH_BINARY)

    const url = canvas.toDataURL('image/png')
    
    gray.delete()
    bw.delete()

    return url
}