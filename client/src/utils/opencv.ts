import cvReadyPromise from '@techstark/opencv-js'

export const getOpenCv = async () => {
    const cv = await cvReadyPromise
    console.log('OpenCV.js is ready!')
    return cv
}