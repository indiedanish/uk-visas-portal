import React, { useState, useMemo, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import debounce from "lodash/debounce";
import { Icon } from '@iconify/react/dist/iconify.js';

const NationalityStatsChart = ({ data, loading, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search input handler
  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Memoized filtered data for the table
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    return data.filter((item) =>
      item._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Chart data transformation
  const chartData = useMemo(() => {
    if (!filteredData) return { categories: [], series: [] };

    return {
      categories: filteredData.map((item) => item._id), // Nationalities on x-axis
      series: filteredData.map((item) => item.total), // Totals on y-axis
    };
  }, [filteredData]);

  return (
    <>
         <div className="col-12 mt-36 mb-0 ">
        <div className="card h-100 radius-8 border-0">
          <div className="card-body p-24 d-flex flex-row align-items-center justify-content-between gap-8">
          <h6 className=" fw-bold text">
             
        
        Overall Visas Granted to Nationalities{" "}
      </h6>

      <span className="mb-0 w-48-px h-48-px bg-red text-white text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                      <i className="ri-id-card-line" />
                    </span>
      
      </div>
      </div></div>
      {/* Chart Section */}
      <div className="col-xl-7 col-12 mt-10">
        <div className="card h-100 radius-8 border-0">
          <div className="card-body p-24 d-flex flex-column gap-8">
            <h6 className="mb-20 fw-bold text-lg">
             
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
                      text: "Nationalities",
                      style: { fontSize: "14px", fontWeight: "bold" },
                    },

                    labels: { show: false },
                  },
                  yaxis: { title: { text: "Total Visas Granted" } },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: "100%",
                    },
                  },
                  dataLabels: { enabled: false },
                  colors: ["#008FFB"],
                }}
                series={[
                  {
                    name: "Total",
                    data: chartData.series,
                  },
                ]}
                type="bar"
                height={350}
              />
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="col-xl-5 col-12 mt-10">
        <div className="card h-100 radius-8 border-0">
          <div className="card-body p-24 d-flex flex-column gap-8">
            <h6 className="mb-20 fw-bold text-lg">
             
              <span
                style={{ fontWeight: "300", fontStyle: "italic" }}
                className="text-sm"
              >
                **Tabular Form**
              </span>
            </h6>

            {/* Search Input */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search Nationalities..."
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : (
              <div
                style={{ maxHeight: "300px", overflowY: "auto" }}
                className="table-responsive"
              >
                <table className="table bordered-table mb-0 xsm-table">
                  <thead>
                    <tr>
                      <th scope="col">No. of Visas Granted</th>
                      <th scope="col">Nationality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <span className="bg-success-focus text-success-main px-16 py-4 radius-4 fw-medium text-sm">
                            {item.total || "-"}
                          </span>
                        </td>
                        <td>{item._id || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length === 0 && (
                  <div className="text-center text-muted">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NationalityStatsChart;
