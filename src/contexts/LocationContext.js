import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [terraceAccessible, setTerraceAccessible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDeliverySpot, setSelectedDeliverySpot] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(true); // Always show map initially
  const [showIntentForm, setShowIntentForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Andheri West delivery spots with real locations
  const deliverySpots = [
    {
      id: 'spot_1',
      name: 'Andheri Metro Station',
      address: 'Andheri West Metro Station, Mumbai',
      coordinates: [19.1197, 72.8464],
      distance: '100m',
      walkTime: '2 min walk',
      type: 'main_entrance',
      available: true
    },
    {
      id: 'spot_2', 
      name: 'Infiniti Mall',
      address: 'New Link Road, Andheri West',
      coordinates: [19.1170, 72.8426],
      distance: '150m',
      walkTime: '2 min walk',
      type: 'shopping',
      available: true
    },
    {
      id: 'spot_3',
      name: 'Oshiwara Bus Depot',
      address: 'Oshiwara, Andheri West',
      coordinates: [19.1449, 72.8367],
      distance: '200m',
      walkTime: '3 min walk',
      type: 'residential',
      available: true
    },
    {
      id: 'spot_4',
      name: 'Lokhandwala Complex',
      address: 'Lokhandwala, Andheri West',
      coordinates: [19.1408, 72.8347],
      distance: '180m',
      walkTime: '3 min walk',
      type: 'residential',
      available: true
    },
    {
      id: 'spot_5',
      name: 'Versova Beach',
      address: 'Versova, Andheri West',
      coordinates: [19.1314, 72.8137],
      distance: '300m',
      walkTime: '4 min walk',
      type: 'recreational',
      available: true
    },
    {
      id: 'spot_6',
      name: 'Four Bungalows',
      address: 'Four Bungalows, Andheri West',
      coordinates: [19.1180, 72.8226],
      distance: '250m',
      walkTime: '3 min walk',
      type: 'residential',
      available: true
    },
    {
      id: 'spot_7',
      name: 'MIDC Central Road',
      address: 'MIDC, Andheri East',
      coordinates: [19.1136, 72.8697],
      distance: '400m',
      walkTime: '5 min walk',
      type: 'industrial',
      available: true
    }
  ];

  // Andheri West address suggestions
  const sampleAddresses = [
    'Andheri Metro Station, Andheri West, Mumbai, Maharashtra',
    'Infiniti Mall, New Link Road, Andheri West, Mumbai',
    'Lokhandwala Complex, Andheri West, Mumbai, Maharashtra',
    'Oshiwara Bus Depot, Oshiwara, Andheri West, Mumbai',
    'Versova Beach, Versova, Andheri West, Mumbai',
    'Four Bungalows, Andheri West, Mumbai, Maharashtra',
    'MIDC Central Road, Andheri East, Mumbai, Maharashtra'
  ];

  // Load location data from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('drogo_location');
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        setSelectedAddress(locationData.selectedAddress || '');
        setTerraceAccessible(locationData.terraceAccessible || false);
        setUserLocation(locationData.userLocation || null);
        setSelectedDeliverySpot(locationData.selectedDeliverySpot || null);
      } catch (error) {
        console.error('Error parsing saved location data:', error);
        localStorage.removeItem('drogo_location');
      }
    }
    
    // Also load from individual localStorage keys for better persistence
    const savedAddress = localStorage.getItem('drogo_selected_address');
    const savedDeliverySpot = localStorage.getItem('drogo_selected_delivery_spot');
    
    if (savedAddress && !selectedAddress) {
      setSelectedAddress(savedAddress);
    }
    
    if (savedDeliverySpot && !selectedDeliverySpot) {
      try {
        const spot = JSON.parse(savedDeliverySpot);
        setSelectedDeliverySpot(spot);
      } catch (error) {
        console.error('Error parsing saved delivery spot:', error);
        localStorage.removeItem('drogo_selected_delivery_spot');
      }
    }
  }, [selectedAddress, selectedDeliverySpot]);

  // Save location data to localStorage whenever it changes
  useEffect(() => {
    const locationData = {
      selectedAddress,
      terraceAccessible,
      userLocation,
      selectedDeliverySpot
    };
    localStorage.setItem('drogo_location', JSON.stringify(locationData));
  }, [selectedAddress, terraceAccessible, userLocation, selectedDeliverySpot]);

  const searchAddresses = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    try {
      // Simulate real address search - in production, use Google Places API or similar
      const mockResults = [
        ...sampleAddresses.filter(addr => 
          addr.toLowerCase().includes(query.toLowerCase())
        ).map(addr => ({
          formatted_address: addr,
          place_id: `mock_${addr.replace(/\s+/g, '_')}`,
          geometry: {
            location: {
              lat: deliverySpots.find(spot => 
                addr.toLowerCase().includes(spot.name.toLowerCase())
              )?.coordinates[0] || 19.1197,
              lng: deliverySpots.find(spot => 
                addr.toLowerCase().includes(spot.name.toLowerCase())
              )?.coordinates[1] || 72.8464
            }
          }
        }))
      ];

      // Add some mock non-serviceable areas
      if (query.toLowerCase().includes('bandra') || 
          query.toLowerCase().includes('powai') || 
          query.toLowerCase().includes('worli')) {
        mockResults.push({
          formatted_address: `${query}, Mumbai, Maharashtra, India`,
          place_id: `mock_non_serviceable_${query}`,
          geometry: {
            location: {
              lat: 19.0596,
              lng: 72.8295
            }
          }
        });
      }

      setSearchResults(mockResults);
      return mockResults;
    } catch (error) {
      console.error('Address search error:', error);
      toast.error('Unable to search addresses. Please try again.');
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  const updateAddress = (address, preserveDeliverySpot = false) => {
    setSelectedAddress(address);
    
    // Save to localStorage for persistence
    if (address) {
      localStorage.setItem('drogo_selected_address', address);
    }
    
    // Check if address is in serviceable area
    const isServiceable = checkServiceableArea(address);
    
    if (isServiceable && address && address.length > 5) {
      // Always show map for serviceable areas
      setIsMapVisible(true);
      // Only reset delivery spot if not preserving it (e.g., when user manually changes address)
      if (!preserveDeliverySpot) {
        setSelectedDeliverySpot(null);
      }
      // Provide feedback that they need to select a delivery spot (reduced frequency)
      // toast.info('Please select a delivery spot from the map to continue 📍');
    } else if (address && address.length > 5 && !isServiceable) {
      // Show intent form for non-serviceable areas
      setShowIntentForm(true);
      setIsMapVisible(false);
      setSelectedDeliverySpot(null);
    } else {
      setIsMapVisible(true); // Always show map for address selection
      if (!preserveDeliverySpot) {
        setSelectedDeliverySpot(null);
      }
    }
  };

  const checkServiceableArea = (address) => {
    if (!address) return false;
    const lowerAddress = address.toLowerCase();
    const serviceableAreas = [
      'andheri west', 'andheri', 'lokhandwala', 'oshiwara', 
      'versova', 'four bungalows', 'midc', 'infiniti mall'
    ];
    return serviceableAreas.some(area => lowerAddress.includes(area));
  };

  const updateTerraceAccessibility = (accessible) => {
    setTerraceAccessible(accessible);
    
    // Only show notification for important feedback
    // if (accessible) {
    //   toast.success('Great! This will help us deliver faster 🚁', {
    //     autoClose: 3000
    //   });
    // }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          
          // Mock reverse geocoding - in production use actual geocoding service
          const mockAddress = 'Andheri Metro Station, Andheri West, Mumbai, Maharashtra';
          setSelectedAddress(mockAddress);
          
          toast.success('Location detected successfully! 📍');
          resolve(coords);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get location. Please enter manually.');
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  const selectDeliverySpot = (spotId) => {
    const spot = deliverySpots.find(s => s.id === spotId);
    if (!spot || !spot.available) {
      toast.error('This delivery spot is not available');
      return false;
    }
    
    setSelectedDeliverySpot(spot);
    
    // Save to localStorage for persistence
    localStorage.setItem('drogo_selected_delivery_spot', JSON.stringify(spot));
    
    return true;
  };

  const confirmDeliverySpot = () => {
    if (!selectedDeliverySpot) {
      toast.error('Please select a delivery spot first');
      return false;
    }
    
    // Send data to backend (mock implementation)
    sendDeliverySpotToBackend();
    
    toast.success(`Delivery spot confirmed: ${selectedDeliverySpot.name} ✅`);
    return true;
  };

  const sendDeliverySpotToBackend = () => {
    const payload = {
      user_address: selectedAddress,
      user_location: userLocation,
      delivery_spot: selectedDeliverySpot ? {
        id: selectedDeliverySpot.id,
        name: selectedDeliverySpot.name,
        coordinates: selectedDeliverySpot.coordinates,
        type: selectedDeliverySpot.type
      } : null,
      terrace_accessible: terraceAccessible,
      timestamp: new Date().toISOString()
    };
    
    console.log('📡 Sending delivery spot data to backend:', payload);
    
    // In production, make actual API call:
    // fetch('/api/delivery-spots/select', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    
    toast.info('Delivery preferences saved! 💾');
    return payload;
  };

  const getFilteredAddresses = (query) => {
    if (!query || query.length < 2) return [];
    
    return sampleAddresses.filter(address => 
      address.toLowerCase().includes(query.toLowerCase())
    );
  };

  const isAddressValid = () => {
    return selectedAddress && selectedAddress.length > 5;
  };

  const canProceed = () => {
    const hasValidAddress = isAddressValid();
    const hasServiceableArea = checkServiceableArea(selectedAddress);
    const hasDeliverySpot = selectedDeliverySpot !== null;
    
    return hasValidAddress && hasServiceableArea && hasDeliverySpot;
  };

  const submitIntentForm = async (formData) => {
    try {
      // Mock API call - in production, send to your backend
      console.log('📝 Intent form submitted:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thank you! We\'ll notify you when DroGo launches in your area! 🚁');
      setShowIntentForm(false);
      
      // Store intent in localStorage for demo
      const existingIntents = JSON.parse(localStorage.getItem('drogo_intents') || '[]');
      existingIntents.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('drogo_intents', JSON.stringify(existingIntents));
      
      return true;
    } catch (error) {
      console.error('Intent form submission error:', error);
      toast.error('Something went wrong. Please try again.');
      return false;
    }
  };

  const resetLocation = () => {
    setSelectedAddress('');
    setTerraceAccessible(false);
    setUserLocation(null);
    setSelectedDeliverySpot(null);
    setIsMapVisible(false);
    setShowIntentForm(false);
    setSearchResults([]);
    localStorage.removeItem('drogo_location');
  };

  // Debug function to check current location state
  const getLocationState = () => {
    return {
      selectedAddress,
      selectedDeliverySpot,
      isMapVisible,
      terraceAccessible,
      userLocation
    };
  };

  const value = {
    // State
    selectedAddress,
    terraceAccessible,
    userLocation,
    selectedDeliverySpot,
    isMapVisible,
    showIntentForm,
    isSearching,
    searchResults,
    deliverySpots,
    sampleAddresses,
    
    // Actions
    updateAddress,
    updateTerraceAccessibility,
    getCurrentLocation,
    selectDeliverySpot,
    confirmDeliverySpot,
    sendDeliverySpotToBackend,
    getFilteredAddresses,
    searchAddresses,
    submitIntentForm,
    resetLocation,
    
    // Computed
    isAddressValid,
    canProceed,
    
    // Map controls
    setIsMapVisible,
    setShowIntentForm,
    
    // Debug
    getLocationState
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
