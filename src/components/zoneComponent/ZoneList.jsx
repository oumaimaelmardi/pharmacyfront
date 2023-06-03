import { faEdit, faFileExcel, faFilePdf, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import authHeader from "../../services/auth-header";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function ZoneList() {
    const [zones, setZones] = useState([]);
    const [selectedVilleId, setSelectedVilleId] = useState("");
    const [villes, setVilles] = useState([]);
    const [filteredZones, setFilteredZones] = useState([]);

    const { id } = useParams();

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this zone?")) {
            axios
                .delete(`http://localhost:8090/zones/deleteZone/${id}`, { headers: authHeader() })
                .then(() => {
                    // Display success toast
                    toast.success("Zone deleted successfully");
                    setZones(zones.filter((item) => item.id !== id));
                    setFilteredZones(filteredZones.filter((item) => item.id !== id));
                })
                .catch((error) => {

                    // Display error toast
                    toast.error("Error deleting Zone");
                    console.error("Error deleting zone:", error);
                });
        }
    };

    useEffect(() => {
        if (selectedVilleId) {
            const filtered = zones.filter((zone) => zone.ville && zone.ville.id === selectedVilleId);
            setFilteredZones(filtered);
        } else {
            setFilteredZones(zones);
        }
    }, [selectedVilleId, zones]);

    const fetchVilleList = () => {
        axios
            .get("http://localhost:8090/villes/all", { headers: authHeader() })
            .then((response) => {
                setVilles(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchZoneList = () => {
        axios
            .get("http://localhost:8090/zones/all", { headers: authHeader() })
            .then((response) => {
                setZones(response.data);
                setFilteredZones(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchVilleList();
        fetchZoneList();
    }, []);

    const handleVilleSelection = (event) => {
        const selectedId = event.target.value;
        setSelectedVilleId(selectedId);
        if (selectedId) {
            axios
                .get(`http://localhost:8090/villes/${selectedId}/zones`, { headers: authHeader() })
                .then((response) => {
                    setFilteredZones(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setFilteredZones(zones);
        }
    };
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(zones);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'listzone.xlsx');
    };

    return (
        <div className="mt-5">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 col-lg-12 mt-5">
                        <div className="card">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col col-sm-3 col-xs-12">
                                        <h4 className="title">
                                            Zone <span>List</span>
                                        </h4>
                                    </div>
                                    <div className="col-sm-9 col-xs-12 text-end">
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Search"
                                            />
                                            <select
                                                className="form-select me-2"
                                                aria-label="Default select example"
                                                onChange={handleVilleSelection}
                                                value={selectedVilleId}
                                            >
                                                <option selected value="">
                                                    Select City
                                                </option>
                                                {villes.map((ville) => (
                                                    <option key={ville.id} value={ville.id}>
                                                        {ville.nom}
                                                    </option>
                                                ))}
                                            </select>
                                            <Link to={"/AddZone"}>
                                                <button
                                                    className="btn btn-default me-2"
                                                    title="Add Zone"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlusCircle}
                                                        size="lg"
                                                        style={{ color: "#555B6E" }}
                                                    />
                                                </button>
                                            </Link>
                                            <button className="btn btn-default me-2" title="Pdf">
                                                <FontAwesomeIcon
                                                    icon={faFilePdf}
                                                    size="lg"
                                                    style={{ color: "#555B6E" }}
                                                />
                                            </button>
                                            <button className="btn btn-default" title="Excel" onClick={exportToExcel}>
                                                <FontAwesomeIcon
                                                    icon={faFileExcel}
                                                    size="lg"
                                                    style={{ color: "#555B6E" }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Zones</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredZones.map((zone) => (
                                            <tr key={zone.id}>
                                                <td>{zone.id}</td>
                                                <td>{zone.nom}</td>
                                                <td>{zone.ville && zone.ville.nom}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Link to={`/EditZone/${zone.id}`} className="me-3">
                                                            <FontAwesomeIcon
                                                                icon={faEdit}
                                                                size="lg"
                                                                style={{ color: "#555B6E", cursor: "pointer" }}
                                                            />
                                                        </Link>
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            size="lg"
                                                            style={{
                                                                color: "#555B6E",
                                                                cursor: "pointer",
                                                                marginLeft: "1rem",
                                                            }}
                                                            onClick={() => handleDelete(zone.id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
