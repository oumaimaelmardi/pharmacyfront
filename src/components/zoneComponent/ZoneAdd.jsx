import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";

export default function ZoneAdd() {
    const [nom, setNom] = useState("");
    const [villes, setVilles] = useState([]);
    const [ville, setVille] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!nom || !ville) {
            toast.error("Please fill in all fields.");
            return;
        }
        const existingZone = villes.find((v) => v.nom === nom && v.ville.id === parseInt(ville));
        if (existingZone) {
            toast.error("Zone with the same name and city already exists.");
            return;
        }

        axios
            .get(`http://localhost:8090/villes/${ville}`, { headers: authHeader() })
            .then((response) => {
                const selectedVille = response.data;

                const zone = {
                    nom: nom,
                    ville: selectedVille,
                };

                axios
                    .post("http://localhost:8090/zones/save", zone, { headers: authHeader() })
                    .then((response) => {
                        if (response.status === 200) {
                            // Display success toast
                            toast.success("Zone added successfully");
                            // Redirect to admin page after a delay
                            setTimeout(() => {
                                navigate("/ZoneList");
                            }, 2000);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error("Error adding zone");
                    });
            })
            .catch((error) => {
                console.log(error);
                toast.error("Invalid selected city");
            });
    };

    useEffect(() => {
        axios
            .get("http://localhost:8090/villes/all", { headers: authHeader() })
            .then((response) => {
                setVilles(response.data);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error retrieving cities");
            });
    }, []);

    const handleVilleChange = (event) => {
        const selectedVilleId = event.target.value;
        setVille(selectedVilleId);
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-2">
            <div className="card" style={{ width: "400px" }}>
                <div className="card-body">
                    <h5 className="card-title mb-4 text-center">Add Zone</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="zoneName" className="form-label">
                                Zone Name:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="zoneName"
                                placeholder="Enter zone name"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="citySelect" className="form-label">
                                Select City:
                            </label>
                            <select
                                className="form-select"
                                id="citySelect"
                                value={ville}
                                onChange={handleVilleChange}
                            >
                                <option value="">Select City</option>
                                {villes.map((ville) => (
                                    <option key={ville.id} value={ville.id}>
                                        {ville.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer /> {/* Add this line to display the toast messages */}
        </div>
    );
}
