import React from 'react';

const NationalityFilteredStatsCards = ({ mostGrantedVisa, highestGrantedOcc, loading, error }) => {
  return (
    <div className="col-12 col-xl-5 mb-4">
      <div className="card radius-8 border-0 p-20">
        <div className="row gy-4">

        {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-danger">{error}</div>
                    ) : (

                        <>
                                 <div className="col-xl-6 col-12">
            <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-2 mb-12">
              <div className="card-body p-0">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                  <div className="d-flex align-items-center gap-2 mb-12">
                    <span className="mb-0 w-48-px h-48-px bg-base text-purple text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                      <i className="ri-youtube-fill" />
                    </span>
                    <div>
                      <span className="mb-0 fw-medium text-secondary-light text-lg">
                        Highest Granted Occupation
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                  <h6 className="fw-semibold mb-0">{highestGrantedOcc?.name?.split("-")[1] || "N/A"}</h6>
                  <p className=" mb-0 d-flex align-items-center gap-8">
                    <h5 className="text-white px-1 rounded-2 fw-medium bg-success-main ">
                    {highestGrantedOcc.total || "N/A"}
                    </h5>
                    
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-12">
            <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-1 mb-12">
              <div className="card-body p-0">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                  <div className="d-flex align-items-center gap-2 mb-12">
                    <span className="mb-0 w-48-px h-48-px bg-base text-pink text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                      <i className="ri-group-fill" />
                    </span>
                    <div>
                      <span className="mb-0 fw-medium text-secondary-light text-lg">
                        Most Granted Visa Type
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                  <h6 className="fw-semibold mb-0">{mostGrantedVisa.name || "N/A"}</h6>
                  <p className="mb-0 d-flex align-items-center gap-8">
                    <h5 className="text-white px-1 rounded-2 fw-medium bg-success-main">
                    {mostGrantedVisa.total || "N/A"}
                    </h5>
                    
                  </p>
                </div>
              </div>
            </div>
          </div>

 
          </>
                    )}
        </div>
      </div>
    </div>
  );
};

export default NationalityFilteredStatsCards;
