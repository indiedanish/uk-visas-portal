import React from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
const Breadcrumb = ({ title }) => {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
      <div className="d-flex flex-column ">

      <h6 className="fw-semibold mb-0">  UK Sponsored work visas by occupation and industry [Q1 2022 - Q3 2024]</h6>
      <span className=" mb-0">All datasets have been scrapped directly from the official government websites. **Limited to publicly available data**</span>
      </div>

      <ul className="d-flex align-items-center gap-2">
        <li className="fw-medium">
          <Link
            to="/"
            className="d-flex align-items-center gap-1 hover-text-primary"
          >
            <Icon icon="solar:home-smile-angle-outline" className="icon text-lg" />
            Dashboard
          </Link>
        </li>
        <li> - </li>
        <li className="fw-medium">{title}</li>
      </ul>
    </div>
  );
};

export default Breadcrumb;
