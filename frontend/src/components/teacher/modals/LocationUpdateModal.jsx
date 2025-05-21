import React, { useState, useEffect } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';

const LocationUpdateModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  currentLocation, 
  userLocation,
  isDark, 
  currentTheme,
  classTitle
}) => {
  const [locationData, setLocationData] = useState({
    room: currentLocation?.room || '',
    building: currentLocation?.building || '',
    latitude: currentLocation?.latitude || (userLocation?.latitude || ''),
    longitude: currentLocation?.longitude || (userLocation?.longitude || '')
  });
  
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Update form when userLocation changes
  useEffect(() => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      setLocationData(prev => ({
        ...prev,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      }));
    }
  }, [userLocation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate coordinates
    const lat = parseFloat(locationData.latitude);
    const lng = parseFloat(locationData.longitude);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setLocationError('Latitude must be a valid number between -90 and 90');
      return;
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setLocationError('Longitude must be a valid number between -180 and 180');
      return;
    }
    
    // Convert string coordinates to numbers
    onSave({
      ...locationData,
      latitude: lat,
      longitude: lng
    });
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Failed to get your location. Please enable location services.");
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDark ? 'bg-[#121A22] border border-[#1E2733]' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Update Location for "{classTitle}"
          </h3>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full ${
              isDark ? 'hover:bg-[#1E2733]' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>
        
        {locationError && (
          <div className={`p-3 mb-4 rounded-md ${
            isDark ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-800'
          }`}>
            {locationError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="room" 
                className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Location Name (Room)
              </label>
              <input
                type="text"
                id="room"
                name="room"
                value={locationData.name}
                onChange={handleChange}
                placeholder="e.g., Main Campus, Building B"
                className={`w-full p-2 border rounded-md ${
                  isDark 
                    ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>
            
            <div>
              <label 
                htmlFor="building" 
                className={`block mb-1 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Location Description (building)
              </label>
              <textarea
                id="building"
                name="building"
                value={locationData.building}
                onChange={handleChange}
                placeholder="Additional details about the location"
                rows={2}
                className={`w-full p-2 border rounded-md ${
                  isDark 
                    ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Coordinates
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                    isDark 
                      ? 'bg-[#1E2733] text-blue-400 hover:bg-[#283647]'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      <MapPin size={14} />
                      <span>Get Current Location</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label 
                    htmlFor="latitude" 
                    className={`block mb-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={locationData.latitude}
                    onChange={handleChange}
                    placeholder="-90 to 90"
                    className={`w-full p-2 border rounded-md ${
                      isDark 
                        ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <label 
                    htmlFor="longitude" 
                    className={`block mb-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={locationData.longitude}
                    onChange={handleChange}
                    placeholder="-180 to 180"
                    className={`w-full p-2 border rounded-md ${
                      isDark 
                        ? 'bg-[#1E2733] border-[#283647] text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>
            </div>
            
            {locationData.latitude && locationData.longitude && (
              <div className={`text-center p-2 rounded-md ${
                isDark ? 'bg-[#1E2733]/50' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Map preview would display here
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  isDark 
                    ? 'bg-[#1E2733] text-white hover:bg-[#283647]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${
                  isDark 
                    ? currentTheme.button.primary
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Save Location
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationUpdateModal;