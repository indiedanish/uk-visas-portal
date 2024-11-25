import React from "react";
import ReactApexChart from "react-apexcharts";

const NationalityStatsChart = ({ data, loading, error }) => {
    // Transform the nationalityStats data for the bar chart
    const chartData = data
        ? {
              categories: data.map(item => item._id), // Countries on x-axis
              series: data.map(item => item.total),  // Totals on y-axis
          }
        : { categories: [], series: [] };

    return (
        <div className="col-12">
            <div className="card h-100 radius-8 border-0">
                <div className="card-body p-24 d-flex flex-column gap-8">
                    <h6 className="mb-20 fw-bold text-lg">Overall Visas Granted to Nationalities</h6>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-danger">{error}</div>
                    ) : (
                        <ReactApexChart
                            options={{
                                chart: { type: "bar", },
                                xaxis: { categories: chartData.categories, },
                                yaxis: { title: { text: "Total" } },
                                plotOptions: {
                                    bar: {
                                        horizontal: false,
                                        columnWidth: "100%",
                                    },
                                },
                                dataLabels: { enabled: false },
                                colors: ["#008FFB"], // Customize bar color
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

export default NationalityStatsChart;
