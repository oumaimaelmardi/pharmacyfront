import { faEdit, faFileExcel, faFilePdf, faLocationDot, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function PharmacieList() {
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedZoneId, setSelectedZoneId] = useState("");
    const [selectedVilleId, setSelectedVilleId] = useState("");
    const [zones, setZones] = useState([]);
    const [villes, setVilles] = useState([]);
    const [filteredZones, setFilteredZones] = useState([]);
    const [pharmacyData, setPharmacyData] = useState({});
    const { id } = useParams();
    const getPharmaciesById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8090/pharmacies/${id}`, { headers: authHeader() });
            setPharmacyData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getPharmaciesById(id);
    }, [id]);


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this pharmacy?")) {
            axios
                .delete(`http://localhost:8090/pharmacies/delete/${id}`, { headers: authHeader() })
                .then(() => {
                    // Display success toast
                    toast.success("Pharmacy deleted successfully");
                    setPharmacies(pharmacies.filter((item) => item.id !== id));
                })
                .catch((error) => {
                    // Display error toast
                    toast.error("Error deleting pharmacy");
                    console.error("Error deleting pharmacy:", error);
                });
        }
    };

    useEffect(() => {
        if (selectedZoneId) {
            const filtered = pharmacies.filter(
                (pharmacie) =>
                    pharmacie.zone &&
                    pharmacie.zone.ville &&
                    pharmacie.zone.ville.id === selectedZoneId
            );
            setFilteredZones(filtered);
            console.log(pharmacies);
            console.log(filtered);
        } else {
            setFilteredZones(pharmacies);
        }
    }, [selectedZoneId, pharmacies]);

    const fetchZoneList = () => {
        axios
            .get("http://localhost:8090/zones/all", { headers: authHeader() })
            .then((response) => {
                setZones(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchPharmacieList = () => {
        axios
            .get("http://localhost:8090/pharmacies/all", { headers: authHeader() })
            .then((response) => {
                setPharmacies(response.data);
                setFilteredZones(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchZoneList();
        fetchPharmacieList();
    }, []);

    const handleZoneSelection = (event) => {
        const selectedId = event.target.value;
        setSelectedZoneId(selectedId);
        if (selectedId) {
            axios
                .get(`http://localhost:8090/pharmacies/zone/${selectedId}`, { headers: authHeader() })
                .then((response) => {
                    setFilteredZones(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            setFilteredZones(pharmacies);
        }
    };
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(pharmacies);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'listpharmacie.xlsx');
    };
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

    const fetchPharmaciesByVille = (villeId) => {
        axios
            .get(`http://localhost:8090/pharmacies/ville/${villeId}/pharmacies`, { headers: authHeader() })
            .then((response) => {
                setPharmacies(response.data);
                setFilteredZones(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchPharmacieList();
        fetchVilleList();
        fetchPharmaciesByVille(selectedVilleId);
    }, []);

    const handleVilleSelection = (event) => {
        const selectedId = event.target.value;
        setSelectedVilleId(selectedId);
        if (selectedId) {
            fetchPharmaciesByVille(selectedId);
        } else {
            setFilteredZones(pharmacies);
        }
    };

    return (
        <div className="mt-5">
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 col-lg-12 mt-5">
                        <div className="card">
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <h4 className="card-title">
                                            Pharmacie <span>List</span>
                                        </h4>
                                    </div>
                                    <div className="col-6 text-end">
                                        <div className="d-flex align-items-center">
                                            <select
                                                className="form-select me-2"
                                                style={{ width: "13rem" }}
                                                onChange={handleZoneSelection}
                                                value={selectedZoneId}
                                            >
                                                <option value="">Select Zone</option>
                                                {zones.map((z) => (
                                                    <option key={z.id} value={z.id}>
                                                        {z.nom}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                className="form-select me-2"
                                                style={{ width: "13rem" }}
                                                onChange={handleVilleSelection}
                                                value={selectedVilleId}
                                            >
                                                <option value="">Select City</option>
                                                {villes.map((v) => (
                                                    <option key={v.id} value={v.id}>
                                                        {v.nom}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Search"
                                            />
                                            <Link to="/AddPharmacie">
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
                                            <button
                                                className="btn btn-default me-2"
                                                title="PDF"
                                                onClick={exportToExcel}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faFileExcel}
                                                    size="lg"
                                                    style={{ color: "#555B6E" }}
                                                />
                                            </button>
                                            <button
                                                className="btn btn-default"
                                                title="Excel"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faFilePdf}
                                                    size="lg"
                                                    style={{ color: "#555B6E" }}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Adresse</th>
                                                <th>Image</th>
                                                <th>Latitude</th>
                                                <th>Logtitude</th>
                                                <th>heure ouverture</th>
                                                <th>heure fermeture</th>
                                                <th>Zone</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredZones.map((f) => (
                                                <tr key={f.id}>
                                                    <td>{f.id}</td>
                                                    <td>{f.nom}</td>
                                                    <td>{f.adresse}</td>
                                                    <td>{f.image}</td>
                                                    <td>{f.latitude}</td>
                                                    <td>{f.longitude}</td>
                                                    <td>{f.heureOuverture}</td>
                                                    <td>{f.heureFermeture}</td>
                                                    <td>{f.zone && f.zone.nom}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <Link to={`/EditPharmacie/${f.id}`}>
                                                                <FontAwesomeIcon
                                                                    icon={faEdit}
                                                                    size="lg"
                                                                    style={{ color: "#555B6E", cursor: "pointer" }}
                                                                />
                                                            </Link>
                                                            <FontAwesomeIcon
                                                                icon={faTrash}
                                                                size="lg"
                                                                style={{ color: "#555B6E", cursor: "pointer", marginLeft: "1rem" }}
                                                                onClick={() => handleDelete(f.id)}
                                                            />
                                                            <FontAwesomeIcon
                                                                icon={faLocationDot}
                                                                size="lg"
                                                                style={{ color: "#555B6E", cursor: "pointer", marginLeft: "1rem" }}
                                                                onClick={() => getPharmaciesById(f.id)}
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

            </div>
            <div className="container p-5 d-flex justify-content-center align-items-center">
                {pharmacyData.latitude && pharmacyData.longitude && (
                    <iframe
                        className=" justify-content-center"
                        title="Google Maps"
                        width="500px"
                        height="500px"
                        src={`https://maps.google.com/maps?q=${pharmacyData.latitude},${pharmacyData.longitude}&hl=es;&output=embed`}
                        allowFullScreen
                    ></iframe>
                )}

            </div>
            <ToastContainer />
        </div>
    );
}

