import React from "react";
import ReactApexChart from "react-apexcharts";

const OccupationStatsChart = ({ data, loading, error }) => {
  // Transform the occupationStats data for the bar chart
  const chartData = data
    ? {
        categories: data.map((item) => item._id), // Occupation titles on x-axis
        series: data.map((item) => item.total), // Totals on y-axis
      }
    : { categories: [], series: [] };

  return (
    <div className="">
      <div className="card h-100 radius-8 border-0">
        <div className="card-body p-24 d-flex flex-column  gap-8">
          <h6 className="mb-20 fw-bold text-lg">
          Granted Visa by Occupations
          </h6>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <ReactApexChart
              options={{
                chart: { type: "bar" },

                xaxis: {
                  categories: chartData.categories,
                  title: {
                    text: "Occupations",
                    style: { fontSize: "14px", fontWeight: "bold" },
                  }, // Add title to x-axis
                  labels: { show: false },
                },
                yaxis: { title: { text: "Total" } },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "100%",
                  },
                },
                dataLabels: { enabled: false },
                colors: ["#FF4560"], // Customize bar color
              }}
              series={[
                {
                  name: "Total",
                  data: chartData.series,
                },
              ]}
              type="bar"
              height={300}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OccupationStatsChart;
