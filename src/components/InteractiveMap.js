import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from '../contexts/LocationContext';
// import { toast } from 'react-toastify'; // Removed - not used after removing notifications

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const InteractiveMap = ({ isPanelExpanded, setIsPanelExpanded, showOnLanding = false }) => {
  const {
    userLocation,
    selectedDeliverySpot,
    deliverySpots,
    selectDeliverySpot,
    confirmDeliverySpot,
    selectedAddress
  } = useLocation();

  const [map, setMap] = useState(null);
  const mapRef = useRef();

  // Use props or default state
  const [localPanelExpanded, setLocalPanelExpanded] = useState(false);
  const panelExpanded = isPanelExpanded !== undefined ? isPanelExpanded : localPanelExpanded;
  const setPanelExpanded = setIsPanelExpanded || setLocalPanelExpanded;

  // Default center (Andheri West coordinates)
  const defaultCenter = [19.1197, 72.8464]; // Andheri Metro Station
  const center = userLocation || defaultCenter;

  // Custom marker icons
  const userIcon = new L.DivIcon({
    className: 'user-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const createDeliveryIcon = (spot) => {
    const isSelected = selectedDeliverySpot?.id === spot.id;
    const size = isSelected ? 40 : 30; // Bigger when selected
    const anchor = isSelected ? 20 : 15;
    const fontSize = isSelected ? 18 : 14;
    
    // Create a simple, visible marker with size variation
    return new L.DivIcon({
      className: 'custom-delivery-marker',
      iconSize: [size, size],
      iconAnchor: [anchor, anchor],
      popupAnchor: [0, -anchor],
      html: `
        <div 
          data-spot-id="${spot.id}"
          style="
            width: ${size}px; 
            height: ${size}px; 
            background: ${isSelected ? '#00D67F' : '#ff4757'}; 
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: ${isSelected ? '0 4px 16px rgba(0, 214, 127, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.3)'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${fontSize}px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
            pointer-events: auto;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          ">
            ${getSpotIcon(spot.type)}
          </div>
        `
    });
  };

  const getSpotIcon = (type) => {
    const icons = {
      'main_entrance': '🚇',
      'shopping': '🛍️',
      'residential': '🏠',
      'recreational': '🏖️',
      'industrial': '🏭'
    };
    return icons[type] || '📍';
  };

  const handleSpotSelect = (spotId) => {
    const success = selectDeliverySpot(spotId);
    if (success) {
      // Removed notification - visual feedback on map is sufficient
      // const selectedSpot = deliverySpots.find(s => s.id === spotId);
      // if (selectedSpot) {
      //   toast.success(`✅ ${selectedSpot.name} selected`, {
      //     autoClose: 1500,
      //   });
      // }
      
      // Don't auto-center on spot selection - let user see all markers
      // User can scroll to continue button if needed
    }
  };

  const handleConfirmSpot = () => {
    const success = confirmDeliverySpot();
    if (success) {
      setPanelExpanded(false);
    }
  };

  // Function to get coordinates for a given address
  const getCoordinatesForAddress = (address) => {
    if (!address) return null;
    
    // Map common address patterns to coordinates
    const addressMappings = {
      'andheri metro station': [19.1197, 72.8464],
      'infiniti mall': [19.1170, 72.8426],
      'lokhandwala': [19.1408, 72.8347],
      'oshiwara': [19.1449, 72.8367],
      'versova': [19.1314, 72.8137],
      'four bungalows': [19.1180, 72.8226],
      'midc': [19.1136, 72.8697]
    };
    
    const lowerAddress = address.toLowerCase();
    for (const [key, coords] of Object.entries(addressMappings)) {
      if (lowerAddress.includes(key)) {
        return coords;
      }
    }
    
    // Default to Andheri Metro Station if no match
    return [19.1197, 72.8464];
  };

  // Center map when selectedAddress changes from search input (not from marker selection)
  useEffect(() => {
    if (selectedAddress && map && !selectedDeliverySpot) {
      const coords = getCoordinatesForAddress(selectedAddress);
      if (coords) {
        map.setView(coords, 16, { animate: true, duration: 1.0 });
      }
    }
  }, [selectedAddress, map, selectedDeliverySpot]);



  const filteredSpots = deliverySpots.filter(spot => {
    return spot.available;
  });



  // Map event handler component
  const MapEvents = () => {
    useMapEvents({
      ready: (e) => {
        if (e && e.target) {
          setMap(e.target);
        }
      },
    });
    return null;
  };

  return (
    <div className="map-section">
      <h4 style={{ fontWeight: 600, margin: '0 0 16px 0', textAlign: 'center' }}>
        Select Your Precise Delivery Location
      </h4>
      
      <div className="map-container">

        
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: '100%', width: '100%', borderRadius: '14px' }}
          ref={mapRef}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <MapEvents />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          
          {/* User location marker */}
          {userLocation && (
            <Marker 
              position={userLocation} 
              icon={userIcon}
              zIndexOffset={1000}
            />
          )}
          
          {/* Delivery spot markers */}
          {filteredSpots.map((spot, index) => (
            <Marker
              key={`marker-${spot.id}-${selectedDeliverySpot?.id === spot.id ? 'selected' : 'unselected'}`}
              position={spot.coordinates}
              icon={createDeliveryIcon(spot)}
              zIndexOffset={selectedDeliverySpot?.id === spot.id ? 2000 : 1500}
              eventHandlers={{
                click: () => handleSpotSelect(spot.id),
                touchstart: () => handleSpotSelect(spot.id),
                touchend: () => handleSpotSelect(spot.id)
              }}
            />
          ))}
        </MapContainer>
        
        {/* Delivery Spots Panel */}
        <div className={`delivery-spots-panel ${panelExpanded ? 'expanded' : ''}`}>
          <div className="panel-header" onClick={() => setPanelExpanded(!panelExpanded)}>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div className="panel-handle"></div>
              <h4 className="panel-title">Available Delivery Spots</h4>
            </div>
          </div>
          
          <div>
            {filteredSpots.map((spot) => (
              <div 
                key={spot.id}
                className={`delivery-spot ${selectedDeliverySpot?.id === spot.id ? 'selected' : ''}`}
                onClick={() => handleSpotSelect(spot.id)}
              >
                <div className="spot-icon">{getSpotIcon(spot.type)}</div>
                <div className="spot-info">
                  <h5 className="spot-name">{spot.name}</h5>
                  <div className="spot-details">
                    <span>{spot.address}</span>
                    <span className="spot-distance">{spot.distance}</span>
                    <span>{spot.walkTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className={`confirm-spot-btn ${selectedDeliverySpot ? 'active' : ''}`}
            onClick={handleConfirmSpot}
            disabled={!selectedDeliverySpot}
          >
            {selectedDeliverySpot ? `Confirm ${selectedDeliverySpot.name}` : 'Select a delivery spot'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
