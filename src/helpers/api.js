
const fetchCurrentParkingSpace = async (id) => {
    return await fetch(`${import.meta.env.VITE_PARKLACEAPI}/spaces/one/${id}`)
        .then(response => response.json())
        .then(response => response)
}



export { fetchCurrentParkingSpace }
