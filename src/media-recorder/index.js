
import fixWebmDuration from "fix-webm-duration";
export function getMediaRecorder(stream, options, callback) {

    const mediaRecorder = new MediaRecorder(stream, options);
    let time = undefined;
    const blobs = []
    
    mediaRecorder.onstart = () => {
        time = time ?? Date.now()
        setTimeout(() => {
            mediaRecorder.stop()
        }, 10000)
    }
    mediaRecorder.ondataavailable = (event) => {
	
        blobs.push(event.data)
    }
    mediaRecorder.onstop = () => {
	
        time = Date.now() - time
        console.log(time)
        const fullBlob = new Blob(blobs, {
            type: options.mimeType //"video/webm"
        })
        fixWebmDuration(fullBlob, time).then (
            callback
        )
    }
    return mediaRecorder
}