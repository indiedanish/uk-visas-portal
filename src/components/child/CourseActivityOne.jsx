import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const CourseActivityOne = ({ nationalityStats }) => {
    return (
        <div className="col-xxl-12">
            <div className=" h-100">
                <div className="card-header">
                    <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 className="mb-2 fw-bold text-lg mb-0">Course Activity</h6>
                        <Link
                            to="#"
                            className="text-primary-600 hover-text-primary d-flex align-items-center gap-1"
                        >
                            View All
                            <Icon
                                icon="solar:alt-arrow-right-linear"
                                className="icon"
                            />
                        </Link>
                    </div>
                </div>
                <div className=" p-24">
                    {/* <ul className="d-flex flex-wrap align-items-center justify-content-center my-3 gap-3">
                        {nationalityStats?.map((item, index) => (
                            <li className="d-flex align-items-center gap-2" key={index}>
                                <span className="w-12-px h-12-px rounded-circle bg-warning-600" />
                                <span className="text-secondary-light text-sm fw-semibold">
                                    {item._id}: <span className="text-primary-light fw-bold">{item.total}</span>
                                </span>
                            </li>
                        ))}
                    </ul> */}
                    <div id="" className="" />
                    <ReactApexChart
                        options={{ chart: { type: 'bar' } }}
                        series={[{ data: nationalityStats?.map((item) => item.total) }]}
                        type="bar"
                    
                        id=""
                       
                    />
                </div>
            </div>
        </div>
    );
};

export default CourseActivityOne;
