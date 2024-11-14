import React, { useEffect, useState } from "react";
import { getAds } from "../services/ads.service";

const PlayAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Fetch ads URLs on component mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsData = await getAds();  // Assuming getAds returns an array of ads data
        // Extract the URLs from the content array of each ad
        const adUrls = adsData.results.map(ad => 
          ad.content.map(item => item.url)
        ).flat(); // Flatten the array of arrays into a single array of URLs
        
        setAds(adUrls); // Set the ads URLs in state
        console.log(adUrls); // Debugging the URLs
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

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
