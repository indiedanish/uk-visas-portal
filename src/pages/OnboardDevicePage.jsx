import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator
import { QRCodeSVG } from "qrcode.react"; // Import QRCodeSVG
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AdListLayer from "../components/AdListLayer";
import apiConfig from "../configs/api.config";
const OnboardDevice = () => {
  const [deviceUUID, setDeviceUUID] = useState(null);
  const navigate = useNavigate();

  // Generate UUID and set it when the component mounts
  useEffect(() => {
    const generatedUUID = uuidv4(); // Generate a new UUID
    setDeviceUUID(generatedUUID); // Store it in the state
  }, []);

  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Ad - List" />
        <div className="onboarding-container">
          <h2>Device Onboarding</h2>
          {deviceUUID ? (
            <div>
              <p>Scan the QR code below to onboard this device:</p>
              <div className="qr-container d-flex justify-content-center">
                {/* Use QRCodeSVG to display the QR code */}
                <QRCodeSVG
                  value={`${apiConfig.baseURL}sign-in`}
                  size={256}
                  level="H" // Error correction level
                />
              </div>
              <p className="instructions mt-5">
                Scan this code with the device app to complete the onboarding
                process.
              </p>
            </div>
          ) : (
            <p>Generating QR Code...</p>
          )}
        </div>
      </MasterLayout>
    </>
  );
};

export default OnboardDevice;
