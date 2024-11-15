import React, { useEffect, useState } from "react";
import { getAds } from "../services/ads.service";
import { saveUsersAdRunTime } from "../services/users.service";

const PlayAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adRunDuration, setAdRunDuration] = useState(0); // Track running time in seconds
  const [isTabVisible, setIsTabVisible] = useState(true);

  const SECONDS_TO_SAVE = 300;

  const isAdActive = (startTime, endTime, currentDay, displayFrequency) => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;

    // Check if today is a display day for the ad
    const isTodayAdDisplayed = displayFrequency.includes(currentDay);

    // Check if current time is within the start and end time of the ad
    const isTimeInRange = currentTime >= startTime && currentTime <= endTime;

    return isTodayAdDisplayed && isTimeInRange;
  };

  const fetchAds = async () => {
    try {
      const adsData = await getAds(); // Assuming getAds returns an array of ads data

      // Get the current day (e.g., "Monday", "Tuesday")
      const currentDay = new Date().toLocaleString("en-us", {
        weekday: "long",
      });

      // Filter ads that are active based on the current day and time
      const activeAds = adsData.results.filter(
        (ad) =>
          ad.status === "active" &&
          isAdActive(ad.startTime, ad.endTime, currentDay, ad.displayFrequency)
      );

      // Extract the URLs from the content array of each ad
      const adUrls = activeAds
        .map((ad) => ad.content.map((item) => item.url))
        .flat(); // Flatten the array of arrays into a single array of URLs

      setAds(adUrls); // Set the ads URLs in state
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  // Fetch ads URLs on component mount
  useEffect(() => {
    fetchAds();
  }, []); // Empty dependency array ensures this effect only runs once when the component mounts

  useEffect(() => {
    if (ads.length === 0) return; // Don't set up interval if ads are empty

    // Interval for ad slideshow
    const slideShowInterval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    // Interval for tracking ad running time (every second)
    const adRunTimeInterval = setInterval(() => {
      setAdRunDuration((prevTime) => {
        if (isTabVisible && prevTime >= SECONDS_TO_SAVE) {
          saveUsersAdRunTime({
            adRunDuration: prevTime,
            adsUrls: ads,
          });

          return 1; // Reset after 100 seconds
        } else {
          return prevTime + 1; // Increment ad running time by 1 second
        }
      });
    }, 1000); // Track running time every second

    const handleVisibilityChange = () => {
      // When tab is changes, reset the ad running time to 0
      setAdRunDuration(0);
      setCurrentAdIndex(0);

      if (document.visibilityState == "hidden") {
        setIsTabVisible(false);
      } else if (document.visibilityState == "visible") {
        setIsTabVisible(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup intervals and event listeners when component unmounts or ads change
    return () => {
      clearInterval(slideShowInterval);
      clearInterval(adRunTimeInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ads]); // Run effect again if ads change

  if (!ads.length) {
    return <div>Loading ads... {JSON.stringify(ads)}</div>;
  }

  return (
    <div className="d-flex h-100vw align-items-center">
      <div className="ad-slideshow h-max-content">
        <img
          src={ads[currentAdIndex]} // Use the URL from the ads array
          alt={`Ad ${currentAdIndex + 1}`}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default PlayAdsPage;
