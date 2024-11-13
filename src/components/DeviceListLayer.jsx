import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getDevices } from '../services/devices.service';
import DeviceModal from './DeviceModal';
import { addDevice } from '../services/devices.service';
import toast, { Toaster } from 'react-hot-toast';

import Loader from "../components/Loader"
const InvoiceListLayer = () => {
    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState([]);


    const [loading, setLoading] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalActionType, setModalActionType] = useState('add');
    const [selectedDevice, setSelectedDevice] = useState(null);


    const handleAddClick = () => {
        setModalActionType('add');
        setSelectedDevice(null);
        setModalOpen(true);
    };

    const handleEditClick = (device) => {
        setModalActionType('edit');
        setSelectedDevice(device);
        setModalOpen(true);
    };

    const handleDeleteClick = (device) => {
        setModalActionType('delete');
        setSelectedDevice(device);
        setModalOpen(true);
    };

    const handleModalSubmit = async (data) => {

        try {

            if (modalActionType === 'add') {
                console.log('Adding device:', data);
                await addDevice(data)
               
                
            } else if (modalActionType === 'edit') {
                console.log('Updating device:', data);
            } else if (modalActionType === 'delete') {
                console.log('Deleting device:', selectedDevice);
            }
            setModalOpen(false);
            
        } catch (error) {
            toast.error(error.message || 'Failed to sign in');
        }
    };

    const handleModalCancel = () => {
        setModalOpen(false);
    };


    useEffect(() => {
        // Fetch devices when the component mounts
        const fetchDevices = async () => {
            try {
                setLoading(true)
                const response = await getDevices();
                setDevices(response.results || []);
            } catch (error) {
                console.error("Error fetching devices:", error);
            } finally {
                setLoading(false)
            }
        };
        fetchDevices();
    }, [device]);

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
                        <select className="form-select form-select-sm w-auto" defaultValue="Select Number">
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
                    <select className="form-select form-select-sm w-auto" defaultValue="Select Status">
                        <option value="Select Status" disabled>
                            Select Status
                        </option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <Link onClick={()=>handleAddClick()} href="invoice-add.html" className="btn btn-sm btn-primary-600">
                        <i className="ri-add-line" /> Create Device
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
                            <th scope="col">Device ID</th>
                            <th scope="col">Title</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device, index) => (
                            device.adIds.map((ad, adIndex) => (
                                <tr key={`${device.id}-${ad.id}`}>
                                    <td>
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`check-${index}-${adIndex}`}
                                            />
                                            <label className="form-check-label" htmlFor={`check-${index}-${adIndex}`}>
                                                {index + 1}
                                            </label>
                                        </div>
                                    </td>
                                    <td>
                                        <Link to="#" className="text-primary-600">
                                            {device.deviceGeneratedId || 'N/A'}
                                        </Link>
                                    </td>
                                    <td>{ad.title}</td>
                                    <td>{new Date(ad.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(ad.endDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`px-24 py-4 rounded-pill fw-medium text-sm ${
                                            ad.status === 'active' ? 'bg-success-focus text-success-main' : 'bg-danger-focus text-danger-main'
                                        }`}>
                                            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>

                                        <Link
                                            to="#"
                                            onClick={() => handleEditClick(device)}

                                            className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                        >
                                            <Icon icon="lucide:edit" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center"
                                        >
                                            <Icon icon="mingcute:delete-2-line" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24">
                    <span>Showing 1 to {devices.length} of {devices.length} entries</span>
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
                <DeviceModal
                isOpen={isModalOpen}
                title={`${modalActionType.charAt(0).toUpperCase() + modalActionType.slice(1)} Device`}
                actionType={modalActionType}
                initialData={selectedDevice}
                onSubmit={handleModalSubmit}
                onCancel={handleModalCancel}
                />
            )}
         </>
            )}
        </div>
    );
};

export default InvoiceListLayer;
