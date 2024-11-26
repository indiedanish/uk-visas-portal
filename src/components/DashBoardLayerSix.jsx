import React, { useEffect, useState } from "react";
import axios from "axios";
import TrafficSourcesOne from "./child/TrafficSourcesOne";
import NationalityStatsChart from "./child/NationalityStatsChart";
import OccupationStatsChart from "./child/OccupationStatsChart";
import NationalityFilteredStatsCards from "./child/NationalityFilteredStatsCards"; // Import your component

import countries from "../utils/countries";

const DashBoardLayerSix = () => {
  const [visaTypes, setVisaTypes] = useState([]);
  const [nationalityStats, setNationalityStats] = useState([]);
  const [occupationStats, setOccupationStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNationality, setSelectedNationality] = useState(""); // For storing selected nationality
  const [statsSum, setStatsSum] = useState({});

  const fetchStats = async (nationality = "") => {
    setLoading(true);
    setError(null);

    console.log("Nationality: " + nationality);

    try {
      const params = nationality ? { nationality } : {};
      const response = await axios.get(
        "https://uk-visas.vercel.app/api/visas/stats",
        { params }
      );
      setVisaTypes(response.data.visaTypes);

      setStatsSum({
        mostGrantedVisa: {
          name: response.data.visaTypes[0]?._id || "N/A",
          total: response.data.visaTypes[0]?.total || "N/A",
        },
        highestGrantedOcc: {
          name: response.data.occupationStats[0]?._id || "N/A",
          total: response.data.occupationStats[0]?.total || "N/A",
        },
      });

      setNationalityStats(response.data.nationalityStats);
      setOccupationStats(response.data.occupationStats);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats initially
  useEffect(() => {
    fetchStats();
  }, []);

  // Handle nationality selection change
  const handleNationalityChange = (event) => {
    const selected = event.target.value;
    setSelectedNationality(selected); // Set the selected nationality
    fetchStats(selected); // Re-fetch stats with the selected nationality
  };

  return (
    <div className="row gy-4 mb-24">
      {/* Nationality Select Dropdown */}
      <div className="col-12">
        <select
          value={selectedNationality}
          onChange={handleNationalityChange}
          className="form-select sticky-bottom z-0"
          aria-label="Select Nationality"
        >
          <option value="">Select specifc country from here</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      {/* Traffic Sources Chart */}
      <TrafficSourcesOne data={visaTypes} loading={loading} error={error} />

      {/* Nationality Filtered Stats Cards */}
      <NationalityFilteredStatsCards
        mostGrantedVisa={statsSum.mostGrantedVisa}
        highestGrantedOcc={statsSum.highestGrantedOcc}
        loading={loading}
        error={error}
      />

      {/* Occupation Stats Bar Chart */}
      <OccupationStatsChart
        data={occupationStats}
        loading={loading}
        error={error}
      />

      {/* Nationality Stats Bar Chart */}
      <NationalityStatsChart
        data={nationalityStats}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default DashBoardLayerSix;
