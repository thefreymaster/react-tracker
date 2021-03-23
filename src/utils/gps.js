import { addUserLocation } from "../api/firebase";

export const getCoordinates = (setFieldValue, setIsGettingCoordinates, setGpsError) => {
    const options = {
        timeout: 10000,
        enableHighAccuracy: true,
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            setFieldValue("location.lat", lat);
            setFieldValue("location.long", long);
            setIsGettingCoordinates(false);
        },
        () => {
            setIsGettingCoordinates(false);
            setGpsError(true);
        },
        options
    );
}

export const getCoordinatesOutsideForm = (setIsGettingCoordinates, setGpsError, setViewport) => {
    const options = {
        timeout: 10000,
        enableHighAccuracy: true,
    }
    return navigator.geolocation.getCurrentPosition(
        (position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            setIsGettingCoordinates(false);
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
                latitude: lat,
                longitude: long,
                zoom: 14,
            })
        },
        () => {
            setGpsError(true);
            setIsGettingCoordinates(false);
        },
        options
    );
}

export const getGPSCoordinates = (dispatch, uid, hasCoordinates, setViewport) => {
    const options = {
        timeout: 10000, enableHighAccuracy: true, maximumAge: 0
    }
    return navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            addUserLocation({ postData: { latitude, longitude }, uid, dispatch })
            dispatch({ type: 'SET_GPS_COORDINATES', payload: { latitude, longitude } })
            console.log({ latitude, longitude })
        },
        (e) => {
            console.log(e)
        },
        options
    );
}