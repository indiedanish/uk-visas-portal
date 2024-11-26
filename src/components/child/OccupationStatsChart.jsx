import React, { useState, useMemo, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import debounce from "lodash/debounce";

const OccupationStatsChart = ({ data, loading, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search input handler
  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300), // Debounce time in ms
    []
  );

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    return data.filter((occ) =>
      occ._id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  return (
    <>
      <div className="col-xl-7 col-12">
        <div className="card h-100 radius-8 border-0">
          <div className="card-body p-24 d-flex flex-column gap-8">
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
                    categories: data?.map((item) => item?._id?.split("-")[1] ) || [],
                    title: {
                      text: "Occupations",
                      style: { fontSize: "14px", fontWeight: "bold" },
                    },
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
                  colors: ["#FF4560"],
                }}
                series={[
                  {
                    name: "Total",
                    data: data?.map((item) => item.total) || [],
                  },
                ]}
                type="bar"
                height={350}
              />
            )}
          </div>
        </div>
      </div>

      <div className="col-xl-5 col-12">
        <div className="card h-100 radius-8 border-0">
          <div className="card-body p-24 d-flex flex-column gap-8">
            <h6 className="mb-20 fw-bold text-lg">
              Granted Visa by Occupations{" "}
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
              placeholder="Search Occupations..."
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : (
              <div
                style={{ maxHeight: "300px" }}
                className="table-responsive scroll-sm"
              >
                <table className="table bordered-table mb-0 xsm-table">
                  <thead>
                    <tr>
                      <th scope="col">
                        No. of Visas
                        <br />
                        Granted
                      </th>
                      <th scope="col">Occupations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((occ, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <span className="bg-success-focus text-success-main px-16 py-4 radius-4 fw-medium text-sm">
                            {occ.total || "-"}
                          </span>
                        </td>
                        <td>{occ?._id?.split("-")[1] || "-"}</td>
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

export default OccupationStatsChart;
