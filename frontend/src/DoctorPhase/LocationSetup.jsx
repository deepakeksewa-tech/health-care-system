import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderFront from "../component/HeaderFront";
import toast, { Toaster } from "react-hot-toast";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// ==========================================
// Fix Leaflet Marker Icon
// ==========================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// ==========================================
// Map Click Handler
// ==========================================
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });

  return null;
};

// ==========================================
// Recenter Map
// ==========================================
const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(
      [position.lat, position.lng],
      map.getZoom(),
      {
        animate: true,
      }
    );
  }, [position, map]);

  return null;
};

// ==========================================
// Main Component
// ==========================================
const LocationSetup = () => {
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Address states
  const [streetAddress, setStreetAddress] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Accuracy
  const [accuracy, setAccuracy] = useState(null);

  // Errors
  const [errors, setErrors] = useState({});

  // Default Amritsar location
  const [position, setPosition] = useState({
    lat: 31.6340,
    lng: 74.8723,
  });

  // ==========================================
  // Validation
  // ==========================================
  const validate = () => {
    const localErrors = {};

    if (streetAddress.trim() === "") {
      localErrors.streetAddress = "Street address is required";
    }

    if (landmark.trim() === "") {
      localErrors.landmark =
        "Landmark is required to help pinpoint location";
    }

    if (city.trim() === "") {
      localErrors.city = "City is required";
    }

    if (state.trim() === "") {
      localErrors.state = "State / Province is required";
    }

    const zipRegex = /^[0-9]{5,6}$/;

    if (zipCode.trim() === "") {
      localErrors.zipCode = "ZIP / Postal code is required";
    } else if (!zipRegex.test(zipCode.trim())) {
      localErrors.zipCode =
        "Please enter a valid 5 or 6 digit ZIP code";
    }

    setErrors(localErrors);

    return Object.keys(localErrors).length === 0;
  };

  // ==========================================
  // Reverse Geocoding
  // ==========================================
  const getAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch address");
      }

      const data = await response.json();

      console.log("Reverse Geocoding:", data);

      if (data?.display_name) {
        setAddress(data.display_name);
      }

      // Auto-fill city/state/pincode if available
      if (data?.address) {
        const addressData = data.address;

        const detectedCity =
          addressData.city ||
          addressData.town ||
          addressData.village ||
          addressData.municipality ||
          addressData.county ||
          "";

        const detectedState = addressData.state || "";

        const detectedZip = addressData.postcode || "";

        if (detectedCity) {
          setCity(detectedCity);
        }

        if (detectedState) {
          setState(detectedState);
        }

        if (detectedZip) {
          setZipCode(detectedZip);
        }
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);

      setAddress("Unable to detect address");
    }
  };

  // ==========================================
  // Get Current Location
  // ==========================================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      // SUCCESS
      (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        const locationAccuracy = pos.coords.accuracy;

        console.log("============================");
        console.log("Current Location");
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Accuracy:", locationAccuracy, "meters");
        console.log("============================");

        const location = {
          lat: latitude,
          lng: longitude,
        };

        setPosition(location);
        setAccuracy(locationAccuracy);

        getAddress(latitude, longitude);

        toast.success("Current location detected");

        setLocationLoading(false);
      },

      // ERROR
      (error) => {
        console.error("Geolocation Error:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Location permission denied. Please allow location access."
            );
            break;

          case error.POSITION_UNAVAILABLE:
            toast.error(
              "Your current location is unavailable."
            );
            break;

          case error.TIMEOUT:
            toast.error(
              "Location request timed out. Please try again."
            );
            break;

          default:
            toast.error(
              "Unable to detect your current location."
            );
        }

        setLocationLoading(false);
      },

      // IMPORTANT OPTIONS
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ==========================================
  // Get Location When Page Loads
  // ==========================================
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // ==========================================
  // Handle Map Click
  // ==========================================
  const handleMapClick = (latlng) => {
    const newLocation = {
      lat: latlng.lat,
      lng: latlng.lng,
    };

    console.log("Map selected latitude:", latlng.lat);
    console.log("Map selected longitude:", latlng.lng);

    setPosition(newLocation);

    // User manually selected location,
    // so GPS accuracy is no longer relevant.
    setAccuracy(null);

    getAddress(latlng.lat, latlng.lng);
  };

  // ==========================================
  // Submit Location
  // ==========================================
  async function handlePage(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        longitude: position.lng,
        latitude: position.lat,
        streetAddress,
        landmark,
        city,
        state,
        zip: zipCode,
      };

      console.log("Sending location to backend:", payload);

      const response = await fetch(
        `${api}/api/doctors/Doctorlocation`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (data.success) {
        toast.success("Address saved successfully");

        setTimeout(() => {
          navigate("/SetSchedule");
        }, 1500);
      } else {
        toast.error(data.message || "Unable to save address");
      }
    } catch (error) {
      console.error("Submit error:", error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <HeaderFront />

      <Toaster />

      {/* Main Loading */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
          <div className="w-12 h-12 border-4 border-[#078475] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-5">
          Set Your Location
        </h1>

        <div className="bg-white rounded-2xl shadow p-5">

          {/* ================================= */}
          {/* Map */}
          {/* ================================= */}

          <div className="w-full h-[500px] rounded-[20px] overflow-hidden z-0 relative">

            <MapContainer
              center={[position.lat, position.lng]}
              zoom={16}
              scrollWheelZoom={true}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={[
                  position.lat,
                  position.lng,
                ]}
              />

              <MapClickHandler
                onMapClick={handleMapClick}
              />

              <RecenterMap
                position={position}
              />
            </MapContainer>
          </div>

          {/* ================================= */}
          {/* Current Location Button */}
          {/* ================================= */}

          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading}
            className="mt-4 bg-[#058b7c] text-white px-6 py-2 rounded-xl font-semibold cursor-pointer disabled:opacity-50"
          >
            {locationLoading
              ? "Detecting Location..."
              : "Use My Current Location"}
          </button>

          {/* ================================= */}
          {/* Coordinates */}
          {/* ================================= */}

          <div className="mt-4 bg-gray-100 p-4 rounded-xl">

            <p className="text-sm">
              <strong>Latitude:</strong>{" "}
              {position.lat}
            </p>

            <p className="text-sm">
              <strong>Longitude:</strong>{" "}
              {position.lng}
            </p>

            {accuracy !== null && (
              <p className="text-sm mt-1">
                <strong>GPS Accuracy:</strong>{" "}
                {Math.round(accuracy)} meters
              </p>
            )}

          </div>

          {/* ================================= */}
          {/* Address */}
          {/* ================================= */}

          <div className="mt-5">

            

            

            <div className="border-b border-gray-200 pb-12 mt-6">

              <h2 className="text-base font-semibold text-black mb-4">
                Personal Address Details
              </h2>

              <form onSubmit={handlePage}>

                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">

                  {/* Street Address */}

                  <div className="col-span-full">

                    <label className="block text-sm font-medium text-black">
                      Street Address
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      value={streetAddress}
                      onChange={(e) =>
                        setStreetAddress(e.target.value)
                      }
                      type="text"
                      className={`mt-2 block w-full rounded-md bg-black/5 px-3 py-2 text-base text-black border ${
                        errors.streetAddress
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    />

                    {errors.streetAddress && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.streetAddress}
                      </p>
                    )}

                  </div>

                  {/* Landmark */}

                  <div className="col-span-full">

                    <label className="block text-sm font-medium text-black">
                      Landmark
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      value={landmark}
                      onChange={(e) =>
                        setLandmark(e.target.value)
                      }
                      type="text"
                      className={`mt-2 block w-full rounded-md bg-black/5 px-3 py-2 text-base text-black border ${
                        errors.landmark
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    />

                    {errors.landmark && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.landmark}
                      </p>
                    )}

                  </div>

                  {/* City */}

                  <div className="sm:col-span-2">

                    <label className="block text-sm font-medium text-black">
                      City
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value)
                      }
                      type="text"
                      className={`mt-2 block w-full rounded-md bg-black/5 px-3 py-2 text-base text-black border ${
                        errors.city
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    />

                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.city}
                      </p>
                    )}

                  </div>

                  {/* State */}

                  <div className="sm:col-span-2">

                    <label className="block text-sm font-medium text-black">
                      State / Province
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      value={state}
                      onChange={(e) =>
                        setState(e.target.value)
                      }
                      type="text"
                      className={`mt-2 block w-full rounded-md bg-black/5 px-3 py-2 text-base text-black border ${
                        errors.state
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    />

                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}

                  </div>

                  {/* ZIP */}

                  <div className="sm:col-span-2">

                    <label className="block text-sm font-medium text-black">
                      ZIP / Postal Code
                      <span className="text-red-400">
                        *
                      </span>
                    </label>

                    <input
                      value={zipCode}
                      onChange={(e) =>
                        setZipCode(e.target.value)
                      }
                      type="text"
                      className={`mt-2 block w-full rounded-md bg-black/5 px-3 py-2 text-base text-black border ${
                        errors.zipCode
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                    />

                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zipCode}
                      </p>
                    )}

                  </div>

                  {/* Submit */}

                  <div className="col-span-full text-center mt-4">

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#058b7c] hover:bg-[#056258] w-full h-11 rounded-2xl text-white font-bold cursor-pointer disabled:opacity-50"
                    >
                      {loading
                        ? "Saving..."
                        : "Submit Location Details"}
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LocationSetup;