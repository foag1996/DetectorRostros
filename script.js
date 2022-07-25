const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('models'),
  

]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  let labeledFaceDescriptors
  (async () => {
    labeledFaceDescriptors = await loadLabeledImages()
  })()

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
    //const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    if (labeledFaceDescriptors) {
      const maxDescriptorDistance = 0.55
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
      const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
      results.forEach((bestMatch, i) => {
        const box = resizedDetections[i].detection.box
        const text = bestMatch.toString()
        //cod para que parezca el nombre del usuario y la distancia
        const drawBox = new faceapi.draw.DrawBox(box, { label: text.toString() })
        console.log('Usuario:' + text)//muestra el nombre de la persona detectada
        drawBox.draw(canvas)
      })
    }

  }, 500)
})



function loadLabeledImages() {
  const labels = ['fabian', 'luis']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 1; i++) {
        const imgUrl = `../labeled_images/${label}/${i}.jpeg`
        const img = await faceapi.fetchImage(imgUrl)
        //const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpeg`)
        const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor()
        //const detections = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor()
        console.log(label + i + JSON.stringify(detections))//muestra los vectores de las imagenes 
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}