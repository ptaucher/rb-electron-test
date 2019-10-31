// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const { desktopCapturer } = require('electron')


document.getElementById('screenshot-button').addEventListener('click', () => {
    console.log('Click')
    console.log('desktopCapturer')

    desktopCapturer.getSources({
        types: ['window']
    }).then(() => {
        desktopCapturer.getSources(
            { types:['screen'], thumbnailSize: {width:1920, height:1080} },
            (error, sources) => {
                console.log(sources)
                document.getElementById('screenshot').src = sources[0].thumbnail.toDataURL()
            })
    })
})
