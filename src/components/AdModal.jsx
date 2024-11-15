import React, { useState, useEffect, useRef } from "react";
import { getDevices } from "../services/devices.service";
import toast from "react-hot-toast";

const DeviceModal = ({
  isOpen,
  title,
  actionType,
  initialData = {},
  onSubmit,
  onCancel,
  loadingModal = false,
}) => {
  const [adData, setAdData] = useState({
    title: "",
    deviceId: "",
    status: "active",
    images: [],
    startTime: "",
    endTime: "",
    displayFrequency: [],
  });

  const [devices, setDevices] = useState(null);
  const fileInputRef = useRef(null);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devicesR = await getDevices();
        setDevices(devicesR.results);
        console.log("devices", devicesR);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };

    fetchDevices();

    if (actionType === "edit" && initialData) {
      setAdData({
        id: initialData.id,
        title: initialData.title || "",
        deviceId: initialData.deviceId || "",
        status: initialData.status || "active",
        images: initialData.content || [],
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        displayFrequency: initialData.displayFrequency || "",
      });
    } else if (actionType === "add") {
      setAdData({
        title: "",
        deviceId: "",
        status: "active",
        images: [],
        startTime: "",
        endTime: "",
        displayFrequency: [],
      });
    }
  }, [actionType, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    // If there are any invalid files, show an alert or error message
    if (invalidFiles.length > 0) {
      toast.error("Only jpeg, jpg, and png file types are allowed.");
      return; // Prevent adding invalid files
    }

    setAdData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = adData.images[index];

    setAdData((prevData) => ({
      ...prevData,
      imagesToRemove: [...(prevData.imagesToRemove || []), imageToRemove.url],
    }));

    const updatedImages = adData.images.filter((_, i) => i !== index);
    setAdData((prevData) => ({
      ...prevData,
      images: updatedImages,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      adData.startTime &&
      adData.endTime &&
      adData.endTime < adData.startTime
    ) {
      toast.error("End time cannot be earlier than start time");
      return; // Prevent form submission
    }

    onSubmit(adData);
  };

  const handleDeviceChange = (event) => {
    setAdData({
      ...adData,
      deviceId: event.target.value, // Update deviceId
    });
  };

  const handleCheckboxChange = (day) => {
    setAdData((prevData) => {
      const newDisplayFrequency = prevData.displayFrequency.includes(day)
        ? prevData.displayFrequency.filter((d) => d !== day)
        : [...prevData.displayFrequency, day];
      return { ...prevData, displayFrequency: newDisplayFrequency };
    });
  };

  const renderTextInput = (
    label,
    name,
    value,
    placeholder,
    required = false
  ) => (
    <div className="col-12 mb-20">
      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
        {label}
      </label>
      <input
        type="text"
        name={name}
        className="form-control radius-8"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };
  const renderDateInput = (label, name, value) => (
    <div className="mb-20">
      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
        {label}
      </label>
      <input
        type="time"
        name={name}
        className="form-control radius-8"
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );

  const renderTextarea = (label, name, value, placeholder) => (
    <div className="col-12 mb-20">
      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
        {label}
      </label>
      <textarea
        name={name}
        className="form-control radius-8"
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );

  const renderRadioInput = (label, name, value) => (
    <div className="form-check d-flex align-items-center gap-2">
      <input
        className="form-check-input"
        type="radio"
        name={name}
        value={value}
        checked={adData.status === value}
        onChange={handleChange}
        required
      />
      <label className="form-check-label">{label}</label>
    </div>
  );

  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      tabIndex={-1}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content radius-16 bg-base">
          <div className="modal-header py-16 px-24 border-bottom">
            <h1 className="modal-title fs-5">{title}</h1>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              aria-label="Close"
            />
          </div>
          <div className="modal-body p-24">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {actionType !== "delete" ? (
                  <>
                    {renderTextInput(
                      "Title",
                      "title",
                      adData.title,
                      "Enter Title",
                      true
                    )}

                    {/* Display Frequency Checkbox Group */}
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Display Frequency
                      </label>
                      <div className="d-flex align-items-center flex-wrap gap-2">
                        {daysOfWeek.map((day) => (
                          <div
                            key={day}
                            className="form-check d-flex align-items-center gap-1"
                          >
                            <input
                              type="checkbox"
                              name="displayFrequency"
                              value={day}
                              checked={adData.displayFrequency.includes(day)}
                              onChange={() => handleCheckboxChange(day)}
                              className="form-check-input"
                            />
                            <label className="form-check-label">{day}</label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="d-flex flex-row gap-3">
                      {renderDateInput(
                        "Start Date",
                        "startTime",
                        adData.startTime
                      )}
                      {renderDateInput("End Date", "endTime", adData.endTime)}
                    </div>

                    <div className="form-check align-items-center gap-2">
                      <label htmlFor="device-select">Choose a device:</label>
                      <select
                        value={adData.deviceId}
                        onChange={handleDeviceChange}
                        id="device-select"
                        className="form-control"
                        required
                      >
                        <option value="" disabled>
                          Select a device
                        </option>
                        {devices &&
                          devices.map((device, index) => (
                            <option key={index} value={device.id}>
                              {device?.title}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Status
                      </label>
                      <div className="d-flex align-items-center flex-wrap gap-28">
                        {renderRadioInput("Active", "status", "active")}
                        {renderRadioInput("Pause", "status", "paused")}
                      </div>
                    </div>
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Upload Images{" "}
                        <span className="font-light">**JPEG, JPG, & PNG**</span>
                      </label>
                      <input
                        type="file"
                        name="images"
                        className="form-control"
                        multiple
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                      <div className="image-preview d-flex flex-wrap gap-2 mt-3">
                        {adData.images.map((img, index) => (
                          <div
                            key={index}
                            className="image-thumbnail-container"
                          >
                            <img
                              src={img?.url || URL.createObjectURL(img)}
                              alt={`Uploaded ${index + 1}`}
                              className="img-thumbnail"
                              width="100"
                            />
                            <div
                              type="button"
                              className="p-0 rounded-2 btn-danger btn-sm text-center"
                              onClick={() => handleRemoveImage(index)}
                            >
                              x
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-12 text-center mb-20">
                    <p>Are you sure you want to delete this device?</p>
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                  <button
                    type="button"
                    className="btn radius-8 outline border-2 border-orange"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loadingModal}
                    type="submit"
                    className="btn btn-danger radius-8 d-flex align-items-center gap-1"
                  >
                    {actionType === "add"
                      ? "Add Device"
                      : actionType === "edit"
                      ? "Save Changes"
                      : "Delete"}

                    {loadingModal ? (
                      <img
                        className="w-20-px ml-2"
                        src="/assets/images/preloader/Spinner-2.svg"
                      ></img>
                    ) : null}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceModal;
