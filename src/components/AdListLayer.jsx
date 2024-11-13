import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAds, addAd } from "../services/ads.service";
import AdModal from "./AdModal";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";

const AdListLayer = () => {
  const [ads, setAds] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState("add");
  const [selectedAd, setSelectedAd] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddClick = () => {
    setModalActionType("add");
    setSelectedAd(null);
    setModalOpen(true);
  };

  const handleEditClick = (ad) => {
    setModalActionType("edit");
    console.log(ad.content);
    console.log("ONEDIT DATA", ad);

    setSelectedAd(ad);
    setModalOpen(true);
  };

  const handleDeleteClick = (ad) => {
    setModalActionType("delete");
    setSelectedAd(ad);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (modalActionType === "add") {
        console.log(data);

        const formData = new FormData();

        // Append images as "files" array for backend processing
        data.images.forEach((image) => {
          console.log("DD", image);
          formData.append("files", image); // Ensures "files" matches backend field
        });

        // Add other required fields from adsInfo
        formData.append("deviceId", data.deviceId);
        formData.append("title", data.title);
        formData.append("startTime", data.startTime);
        formData.append("endTime", data.endTime);
        formData.append(
          "displayFrequency",
          JSON.stringify(data.displayFrequency)
        );

        try {
          await addAd(formData);
          toast.success("Ad has been added successfully")
        } catch (error) {
            toast.error(error.message || "Please try again later, we are facing overload")

        }
      } else if (modalActionType === "edit") {
        console.log("Updating ad:", data);
      } else if (modalActionType === "delete") {
        console.log("Deleting ad:", selectedAd);
      }
      setModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to perform action");
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    // Fetch ads when the component mounts
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await getAds();
        setAds(response.results || []);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="card">
      <Toaster />
      {loading ? ( // Use the Loader component if loading is true
        <Loader />
      ) : (
        <>
          <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <span>Show</span>
                <select
                  className="form-select form-select-sm w-auto"
                  defaultValue="Select Number"
                >
                  <option value="Select Number" disabled>
                    Select Number
                  </option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div className="icon-field">
                <input
                  type="text"
                  name="#0"
                  className="form-control form-control-sm w-auto"
                  placeholder="Search"
                />
                <span className="icon">
                  <Icon icon="ion:search-outline" />
                </span>
              </div>
            </div>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <select
                className="form-select form-select-sm w-auto"
                defaultValue="Select Status"
              >
                <option value="Select Status" disabled>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Link
                onClick={handleAddClick}
                className="btn btn-sm btn-primary-600"
              >
                <i className="ri-add-line" /> Create Ad
              </Link>
            </div>
          </div>
          <div className="card-body">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th scope="col">
                    <div className="form-check style-check d-flex align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkAll"
                      />
                      <label className="form-check-label" htmlFor="checkAll">
                        S.L
                      </label>
                    </div>
                  </th>
                  <th scope="col">Ad ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Content</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad, index) => (
                  <tr key={ad.id}>
                    <td>
                      <div className="form-check style-check d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`check-${index}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`check-${index}`}
                        >
                          {index + 1}
                        </label>
                      </div>
                    </td>
                    <td>
                      <Link to="#" className="text-primary-600">
                        {ad.id}
                      </Link>
                    </td>
                    <td>{ad.title}</td>
                    <td>{new Date(ad.startTime).toLocaleDateString()}</td>
                    <td>{new Date(ad.endTime).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`px-24 py-4 rounded-pill fw-medium text-sm ${
                          ad.status === "active"
                            ? "bg-success-focus text-success-main"
                            : "bg-danger-focus text-danger-main"
                        }`}
                      >
                        {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {ad.content.map((content, contentIndex) => (
                        <div key={content._id} className="ad-content">
                          <a
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {content.type === "image" ? (
                              <img
                                src={content.url}
                                alt="Ad Content"
                                style={{ width: "50px", height: "50px" }}
                              />
                            ) : (
                              <span>Other Content Type</span>
                            )}
                          </a>
                        </div>
                      ))}
                    </td>
                    <td>
                      <Link
                        to="#"
                        onClick={() => handleEditClick(ad)}
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                      <Link
                        to="#"
                        onClick={() => handleDeleteClick(ad)}
                        className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="mingcute:delete-2-line" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
              <span>
                Showing 1 to {ads.length} of {ads.length} entries
              </span>
              <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                <li className="page-item">
                  <Link
                    className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                    to="#"
                  >
                    <Icon icon="ep:d-arrow-left" className="text-xl" />
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    className="page-link bg-primary-600 text-white fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px"
                    to="#"
                  >
                    1
                  </Link>
                </li>
                <li className="page-item">
                  <Link
                    className="page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base"
                    to="#"
                  >
                    <Icon icon="ep:d-arrow-right" className="text-xl" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {isModalOpen && (
            <AdModal
              isOpen={isModalOpen}
              title={`${
                modalActionType.charAt(0).toUpperCase() +
                modalActionType.slice(1)
              } Ad`}
              actionType={modalActionType}
              initialData={selectedAd}
              onSubmit={handleModalSubmit}
              onCancel={handleModalCancel}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdListLayer;
