import React, { useEffect, useState } from "react";
import { getAds } from "../services/ads.service";
import { saveUsersAdRunTime } from "../services/users.service";
import toast, { Toaster } from "react-hot-toast";

const PlayAdsPage = () => {
  const [ads, setAds] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adRunDuration, setAdRunDuration] = useState(0); // Track running time in seconds
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [resetProgress, setResetProgress] = useState(false); // Track reset state for progress bar

  const [startTime, setStartTime] = useState(null)

  const SECONDS_TO_SAVE = 300; // Save every 300 seconds (5 minutes)
  const AD_DISPLAY_TIME = 5; // Display each ad for 5 seconds

  const isAdActive = (startTime, endTime, currentDay, displayFrequency) => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;

    const isTodayAdDisplayed = displayFrequency.includes(currentDay);
    const isTimeInRange = currentTime >= startTime && currentTime <= endTime;

    return isTodayAdDisplayed && isTimeInRange;
  };

  const fetchAds = async () => {
    try {
      const adsData = await getAds();
      const currentDay = new Date().toLocaleString("en-us", {
        weekday: "long",
      });

      const activeAds = adsData.results.filter(
        (ad) =>
          ad.status === "active" &&
          isAdActive(ad.startTime, ad.endTime, currentDay, ad.displayFrequency)
      );

      const adUrls = activeAds
        .map((ad) => ad.content.map((item) => item.url))
        .flat();

      setAds(adUrls);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads?.length === 0) return;

    setStartTime(new Date());

    const slideShowInterval = setInterval(() => {
      setResetProgress(true); // Set to reset progress bar
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, AD_DISPLAY_TIME * 1000);

    const adRunTimeInterval = setInterval(() => {
      setAdRunDuration((prevTime) => {
        if (isTabVisible && prevTime >= SECONDS_TO_SAVE) {
          saveUsersAdRunTime({ adRunDuration: prevTime, adsUrls: ads });
          
          toast.success("Updated")
          return 1;
        } else {
          return prevTime + 1;
        }
      });
    }, 1000);

    const handleVisibilityChange = () => {
      setAdRunDuration(0);
      setCurrentAdIndex(0);
      setIsTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(slideShowInterval);
      clearInterval(adRunTimeInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [ads]);

  useEffect(() => {
    if (resetProgress) {
      setTimeout(() => {
        setResetProgress(false); // Reset the reset flag after a slight delay
      }, 100); // Reset delay to match the ad change cycle
    }
  }, [resetProgress]);

    useEffect(() => {
    fetchAds();
    const adsStatusCheckInterval = setInterval(() => {
      fetchAds(); // Re-fetch ads to ensure they are still active
    }, 60000);
    return () => clearInterval(adsStatusCheckInterval);
  }, []);

  if (!ads?.length) {
    return (
      <div className="d-flex flex-column w-100 h-100vh align-items-center justify-content-center">
        <img
          className="w-200-px"
          src="/assets/images/preloader/Loader-2.svg"
          ></img>
          <span>{ads?.length===0? "Ads not Available" : "Loading"}</span>
      </div>
    );
  }

  return (
    <div className="d-flex h-100vh align-items-center">
      <Toaster/>
      {/* Ad Slideshow */}
      <div className="ad-slideshow h-max-content">
        <img
          src={ads[currentAdIndex]}
          alt={`Ad ${currentAdIndex + 1}`}
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: "5px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: "100%",
            width:  `${(adRunDuration / SECONDS_TO_SAVE) * 100}%`, // Reset progress on new ad
            backgroundColor: "#420000FF",
            transition: resetProgress ? "none" : "width 1s linear", // Remove transition during reset
          }}
        ></div>
      </div>
    </div>
  );
};

export default PlayAdsPage;
