import React, { useEffect, useState } from "react";
import { getAds } from "../services/ads.service";
import useSocket from '../hook/useSocket'; 


const PlayAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const socket = useSocket();

  useEffect(() => {

    console.log("socket",socket)

    if (socket) {
      // Listen for events once the socket is available
      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('adUpdated', (data) => {
        console.log('Ad updated:', data);
        fetchAds()
      });

      // Optionally handle other events like disconnects or errors
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Cleanup listeners when the component unmounts
      return () => {
        socket.off('adUpdated'); // Remove event listener
        socket.off('connect'); // Remove connect listener
        socket.off('disconnect'); // Remove disconnect listener
      };
    }
  }, [socket]); // Only run this effect when the socket is available

  // Function to check if current time is within the ad's start and end time
  const isAdActive = (startTime, endTime, currentDay, displayFrequency) => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;

    // Check if today is a display day for the ad
    const isTodayAdDisplayed = displayFrequency.includes(currentDay);

    // Check if current time is within the start and end time of the ad
    const isTimeInRange =
      currentTime >= startTime && currentTime <= endTime;

    return isTodayAdDisplayed && isTimeInRange;
  };

  const fetchAds = async () => {
    try {
      const adsData = await getAds();  // Assuming getAds returns an array of ads data

      // Get the current day (e.g., "Monday", "Tuesday")
      const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });

      // Filter ads that are active based on the current day and time
      const activeAds = adsData.results.filter(ad => 
        ad.status === 'active' &&
        isAdActive(ad.startTime, ad.endTime, currentDay, ad.displayFrequency)
      );

      // Extract the URLs from the content array of each ad
      const adUrls = activeAds
        .map(ad => ad.content.map(item => item.url))
        .flat(); // Flatten the array of arrays into a single array of URLs
      
      setAds(adUrls); // Set the ads URLs in state
      console.log(adUrls); // Debugging the URLs
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  // Fetch ads URLs on component mount
  useEffect(() => {


    fetchAds();
  }, []); // Empty dependency array ensures this effect only runs once when the component mounts

  // Setup slideshow only if ads are loaded
  useEffect(() => {
    if (ads.length === 0) return; // Don't set up interval if ads are empty

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [ads]); // Only run this effect when 'ads' is updated

  if (!ads.length) {
    return <div>Loading ads...</div>;
  }


  return (
    <div className="ad-slideshow">
      <img
        src={ads[currentAdIndex]} // Use the URL from the ads array
        alt={`Ad ${currentAdIndex + 1}`}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

export default PlayAdsPage;
