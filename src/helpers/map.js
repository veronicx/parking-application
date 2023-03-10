


const pointerType = (type) => {
        if(type < 9.4) {
            return 'point'
        }
        else {
            return 'regional'
        }
}


const fetchMarkers = async (zoomLevel = 11) =>  {
    return await fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/regional/${zoomLevel}`)
        .then(response => response.json())
        .then(data => data)
}

const googleRoute = (lng,lat, zoom = 8) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&zoom=${zoom}`
}

const zoomType = (zoom) => {
    if(zoom < 8) {
        return 'country'
    } else if (zoom < 10 ) {
        return 'regional'
    } else {
        return 'all'
    }
}
const checkZoomLevel = (current, next)  => {
     const currentState = zoomType(current)
     const previousState = zoomType(next)
        return currentState !== previousState;

}

export { pointerType, fetchMarkers, googleRoute, checkZoomLevel }
