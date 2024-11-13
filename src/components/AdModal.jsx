import React, { useState, useEffect, useRef } from "react";
import { getDevices } from "../services/devices.service";

const DeviceModal = ({
  isOpen,
  title,
  actionType,
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [adData, setAdData] = useState({
    title: "",
    deviceId: "",
    description: "",
    status: "active",
    images: [],
    startDate: "",
    endDate: "",
  });

  const [devices, setDevices] = useState(null);
  const fileInputRef = useRef(null);

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
        title: initialData.title || "",
        description: initialData.description || "",
        deviceId: initialData.deviceId || "",
        status: initialData.status || "active",
        images: initialData.content || [],
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
      });
    } else if (actionType === "add") {
      setAdData({
        title: "",
        description: "",
        deviceId: "",
        status: "active",
        images: [],
        startDate: "",
        endDate: "",
      });
    }
  }, [actionType, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setAdData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const updatedImages = adData.images.filter((_, i) => i !== index);
    setAdData((prevData) => ({
      ...prevData,
      images: updatedImages,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(adData);
  };

  const handleDeviceChange = (event) => {
    setAdData({
      ...adData,
      deviceId: event.target.value, // Update deviceId
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

  const renderDateInput = (label, name, value) => (
    <div className="mb-20">
      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
        {label}
      </label>
      <input
        type="date"
        name={name}
        className="form-control radius-8"
        value={value}
        onChange={handleChange}
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
                    {renderTextarea(
                      "Description",
                      "description",
                      adData.description,
                      "Write some text"
                    )}

                    <div className="d-flex flex-row gap-3">
                      {renderDateInput(
                        "Start Date",
                        "startDate",
                        adData.startDate
                      )}
                      {renderDateInput("End Date", "endDate", adData.endDate)}
                    </div>

                    <div className="form-check align-items-center gap-2">
                      <label htmlFor="device-select">Choose a device:</label>
                      <select value={adData.deviceId} onChange={handleDeviceChange} id="device-select" className="form-control">
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
                        {renderRadioInput("Inactive", "status", "inactive")}
                      </div>
                    </div>
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Upload Images
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
                            <button
                              type="button"
                              className="btn btn-danger btn-sm mt-2"
                              onClick={() => handleRemoveImage(index)}
                            >
                              X
                            </button>
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
                    className="btn btn-danger radius-8"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary radius-8">
                    {actionType === "add"
                      ? "Add Device"
                      : actionType === "edit"
                      ? "Save Changes"
                      : "Delete"}
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
