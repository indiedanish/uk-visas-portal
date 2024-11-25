import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

// Default colors for charts
const DEFAULT_COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#A83232", "#5D5DFF", "#FF7C94", "#B19CD9",
    "#FF5733", "#C70039", "#900C3F", "#581845",
    "#2ECC71", "#F39C12", "#8E44AD", "#3498DB",
    "#1ABC9C", "#E74C3C"
];

const TrafficSourcesOne = ({ data, loading, error }) => {
    // Chart data transformation
    const chartData = data
        ? {
              series: data.map((item) => item.total),
              labels: data.map((item) => `${item._id} - ${item.total}`),
          }
        : { series: [], labels: [] };

    // State for dynamic legend position
    const [legendPosition, setLegendPosition] = useState("left");
    const [pieChartHeight, setPieChartHeight] = useState(270);

    // Update legend position based on screen size
    const handleResize = () => {
        if (window.innerWidth < 1200) {
            setLegendPosition("bottom");
            setPieChartHeight(600)
        } else {
            setLegendPosition("left");
        }
    };

    // Set initial legend position and attach event listener
    useEffect(() => {
        handleResize(); // Set position on initial render
        window.addEventListener("resize", handleResize); // Update position on resize
        return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);

    return (
        <div className="col-12 col-xl-7">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24 d-flex flex-column gap-8">
                    <h6 className="mb-20 fw-bold text-lg">Granted Visa Type Distribution</h6>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-danger">{error}</div>
                    ) : (
                        <ReactApexChart
                            options={{
                                chart: { type: "donut" },
                                labels: chartData.labels || [],
                                colors: DEFAULT_COLORS,
                                legend: { position: legendPosition }, // Dynamic position
                            }}
                            series={chartData.series || []}
                            type="pie"
                            height={pieChartHeight}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrafficSourcesOne;
