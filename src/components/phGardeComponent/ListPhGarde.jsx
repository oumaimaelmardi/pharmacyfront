import { faEdit, faFileExcel, faFilePdf, faPlusCircle, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function ListPhGarde() {
    const [pharmacieGardes, setPharmacieGardes] = useState([]);
    const [selectedGarde, setSelectedGarde] = useState('');
    const [filteredPharmacieGardes, setFilteredPharmacieGardes] = useState([]);
    const [gardeOptions, setGardeOptions] = useState([]);
    const fetchPharmacieGardesByGardeId = async (gardeId) => {
        try {
            const response = await axios.get(`http://localhost:8090/find/${gardeId}`, { headers: authHeader() });
            const data = response.data;
            const updatedData = await fetchPharmacyNames(data);
            setFilteredPharmacieGardes(updatedData);
        } catch (error) {
            console.error(error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(pharmacieGardes);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'listpharmacie.xlsx');
    };


    const handleGardeChange = (e) => {
        const selectedGardeId = e.target.value;
        setSelectedGarde(selectedGardeId);

        if (selectedGardeId === '') {
            setFilteredPharmacieGardes(pharmacieGardes);
        } else {
            const filteredList = pharmacieGardes.filter(
                (pharmacieGarde) => pharmacieGarde.id.garde_id === parseInt(selectedGardeId)
            );
            setFilteredPharmacieGardes(filteredList);
        }
    };




    useEffect(() => {
        fetchPharmacieGardes();
    }, []);

    const fetchPharmacieGardes = async () => {
        try {
            const response = await axios.get("http://localhost:8090/pharmacieGarde/all", { headers: authHeader() });
            const data = response.data;
            const updatedData = await fetchPharmacyNames(data);
            setPharmacieGardes(updatedData);
            setFilteredPharmacieGardes(updatedData); // Set filteredPharmacieGardes to the fetched data
            // Fetch the garde options
            const gardeOptionsResponse = await axios.get("http://localhost:8090/gardes/all", { headers: authHeader() });
            const gardeOptionsData = gardeOptionsResponse.data;
            setGardeOptions(gardeOptionsData);

        } catch (error) {
            console.error(error);
        }
    };


    const fetchPharmacyNames = async (pharmacieGardes) => {
        try {
            const promises = pharmacieGardes.map(async (pharmacieGarde) => {
                const response = await axios.get(`http://localhost:8090/gardes/id/${pharmacieGarde.id.garde_id}`, { headers: authHeader() });
                const garde = response.data;
                const gardeType = garde.type;
                const response2 = await axios.get(`http://localhost:8090/pharmacies/${pharmacieGarde.id.pharmacie_id}`, { headers: authHeader() });
                const pharmacy = response2.data;
                const pharmacyName = pharmacy.nom;
                return {
                    ...pharmacieGarde,
                    gardeType: gardeType,
                    pharmacyName: pharmacyName,
                };
            });
            const updatedPharmacieGardes = await Promise.all(promises);
            return updatedPharmacieGardes;
        } catch (error) {
            console.error(error);
            return pharmacieGardes;
        }
    };

    const handleDelete = (gardeId, pharmacieId) => {
        if (window.confirm("Are you sure you want to delete this pharmacy garde?")) {
            axios
                .delete(`http://localhost:8090/pharmacieGarde/delete/${gardeId}/${pharmacieId}`, { headers: authHeader() })
                .then(() => {
                    // Display success toast
                    toast.success("Pharmacy garde deleted successfully");
                    setPharmacieGardes((prevPharmacieGardes) =>
                        prevPharmacieGardes.filter(
                            (item) =>
                                item.id.garde_id !== gardeId || item.id.pharmacie_id !== pharmacieId
                        )
                    );
                })
                .catch((error) => {
                    // Display error toast
                    toast.error("Error deleting pharmacy garde");
                    console.error("Error deleting pharmacy garde:", error);
                });
        }
    };


    return (
        <div className="container mt-5">

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h4 className="card-header-title">Pharmacie Garde List</h4>


                                </div>
                                <div className="col-auto">
                                    <div className="input-group">
                                        <div className="col-sm-9 col-xs-12 text-end">
                                            <div className="d-flex align-items-center">
                                                <select
                                                    className="form-select me-2"
                                                    value={selectedGarde}
                                                    onChange={handleGardeChange}
                                                >
                                                    <option value="">All Gardes</option>
                                                    {gardeOptions.map((gardeOption) => (
                                                        <option key={gardeOption.id} value={gardeOption.id}>
                                                            {gardeOption.type}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    className="form-control me-2"
                                                    placeholder="Search"
                                                />
                                                <Link to={"/AddPh"}>
                                                    <button className="btn btn-default" title="Add City">
                                                        <FontAwesomeIcon
                                                            icon={faPlusCircle}
                                                            size="lg"
                                                            style={{ color: "#555B6E" }}
                                                        />
                                                    </button>
                                                </Link>
                                                <button className="btn btn-default" title="Pdf">
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
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table ">
                                    <thead>
                                        <tr>
                                            <th>Garde ID</th>
                                            <th>Pharmacy Name</th>
                                            <th>Date Debut</th>
                                            <th>Date Fin</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPharmacieGardes.map((pharmacieGarde) => (
                                            <tr key={pharmacieGarde.id}>
                                                <td>{pharmacieGarde.gardeType}</td>
                                                <td>{pharmacieGarde.pharmacyName}</td>
                                                <td>{pharmacieGarde.date_debut}</td>
                                                <td>{pharmacieGarde.date_fin}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <Link to={`/EditPhGarde/${pharmacieGarde.id}`} className="btn btn-primary btn-sm me-2">
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Link>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDelete(pharmacieGarde.id.garde_id, pharmacieGarde.id.pharmacie_id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
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
