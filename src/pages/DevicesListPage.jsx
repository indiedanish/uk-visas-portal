import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeviceListLayer from "../components/DeviceListLayer";

const DeviceListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Devices - List" />

        {/* DeviceListLayer */}
        <DeviceListLayer />
      </MasterLayout>
    </>
  );
};

export default DeviceListPage;
