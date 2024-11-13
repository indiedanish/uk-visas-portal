import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AdListLayer from "../components/AdListLayer";

const AdListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Ad - List" />

        {/* AdListLayer */}
        <AdListLayer />
      </MasterLayout>
    </>
  );
};

export default AdListPage;
