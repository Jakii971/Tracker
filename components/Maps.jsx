import React, {
	useState,
	useImperativeHandle,
	forwardRef,
	useEffect,
	useRef,
} from "react";
import { Image, Alert } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { images } from "../constants";

const Maps = forwardRef(({ onDistanceUpdate }, ref) => {
	const [location, setLocation] = useState(null);
	const [totalDistance, setTotalDistance] = useState(0);
	const [routeCoordinates, setRouteCoordinates] = useState([]);
	const [trackingStatus, setTrackingStatus] = useState("stopped"); // "started", "paused", ato "stopped"
	const locationUnsubscriptionRef = useRef(null);

	const haversineDistance = (coords1, coords2) => {
		const toRad = (x) => (x * Math.PI) / 180;
		const R = 6371; // Radius bumi dalam kilometer
		const dLat = toRad(coords2.latitude - coords1.latitude);
		const dLon = toRad(coords2.longitude - coords1.longitude);
		const lat1 = toRad(coords1.latitude);
		const lat2 = toRad(coords2.latitude);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Jarak dalam kilometer
	};

	useEffect(() => {
		const startTracking = async () => {
			if (locationUnsubscriptionRef.current) {
				locationUnsubscriptionRef.current.remove(); // Hapus listener sebelumnya jika ada
			}

			const subscription = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.High,
					timeInterval: 1000,
					distanceInterval: 1,
				},
				(newLocation) => {
					const { latitude, longitude } = newLocation.coords;
					const newCoordinate = { latitude, longitude };

					setRouteCoordinates((prevCoords) => {
						if (prevCoords.length > 0) {
							const lastCoordinate = prevCoords[prevCoords.length - 1];
							const distance = haversineDistance(lastCoordinate, newCoordinate);

							setTotalDistance((prevTotal) => {
								const newTotalDistance = prevTotal + distance;
								onDistanceUpdate(newTotalDistance);
								return newTotalDistance;
							});
						}
						return [...prevCoords, newCoordinate];
					});

					setLocation(newCoordinate);
				}
			);

			locationUnsubscriptionRef.current = subscription;
		};

		if (trackingStatus === "started") {
			startTracking();
		} else if (trackingStatus === "paused" || trackingStatus === "stopped") {
			if (locationUnsubscriptionRef.current) {
				locationUnsubscriptionRef.current.remove();
				locationUnsubscriptionRef.current = null;
			}
		}

		return () => {
			if (locationUnsubscriptionRef.current) {
				locationUnsubscriptionRef.current.remove();
				locationUnsubscriptionRef.current = null;
			}
		};
	}, [trackingStatus]);

	const startTracking = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission Denied",
				"Location permission is required to track your activity."
			);
			return;
		}
		setTrackingStatus("started");
	};

	const pauseTracking = () => {
		setTrackingStatus("paused");
	};

	const stopTracking = () => {
		setTrackingStatus("stopped");
		setRouteCoordinates([]);
		setTotalDistance(0);
	};

	useImperativeHandle(ref, () => ({
		startTracking,
		pauseTracking,
		stopTracking,
	}));

	return (
		<MapView
			provider={PROVIDER_GOOGLE}
			style={{ flex: 1 }}
			initialRegion={{
				latitude: location?.latitude || -6.2,
				longitude: location?.longitude || 106.816666,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			}}
			region={
				location && {
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}
			}
		>
			{location && (
				<Marker coordinate={location} title="Current Location">
					<Image source={images.marker} style={{ width: 40, height: 40 }} />
				</Marker>
			)}
			{routeCoordinates.length > 0 && (
				<Polyline
					coordinates={routeCoordinates}
					strokeColor="#4965ff"
					strokeWidth={3}
				/>
			)}
		</MapView>
	);
});

export default Maps;
