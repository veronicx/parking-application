


const PointerTypes = (type) => {
        if(type < 9.4) {
            return 'point'
        }
        else {
            return 'regional'
        }
}

const RemoveMarkers = (markers) => {
        markers.forEach((marker,idx) => {
            const elm = document.getElementById('location-' + idx)
                elm.remove()
        })
}

const FetchMarkers = async (zoomLevel = 11) =>  {
    return await fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/regional/${zoomLevel}`)
        .then(response => response.json())
        .then(data => data)
}

const GoogleRoute = (lng,lat, zoom = 8) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&zoom=${zoom}`
}

export { PointerTypes, RemoveMarkers, FetchMarkers, GoogleRoute }
