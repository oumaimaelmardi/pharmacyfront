import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";

export default function ZoneEdit() {
    const { id } = useParams();
    const [nom, setNom] = useState("");
    const [villes, setVilles] = useState([]);
    const [selectedVille, setSelectedVille] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!nom || !selectedVille) {
            toast.error("Please fill in all fields.");
            return;
        }

        // Create the updated Zone object
        const updatedZone = {
            id: id,
            nom: nom,
            ville: {
                id: selectedVille,
            },
        };

        // Update the Zone entity
        axios
            .put("http://localhost:8090/zones/update", updatedZone, { headers: authHeader() })
            .then(() => {
                // Display success toast
                toast.success("Zone updated successfully");
                // Redirect to admin page after a delay
                setTimeout(() => {
                    navigate("/ZoneList");
                }, 2000);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    toast.error("Zone and Ville combination already exists.");
                } else {
                    toast.error("An error occurred. Please try again.");
                }
                console.log(error);
            });
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8090/zones/${id}`, { headers: authHeader() })
            .then((response) => {
                const zone = response.data;
                setNom(zone.nom);
                setSelectedVille(zone.ville.id);
            })
            .catch((error) => {
                console.log(error);
            });

        axios
            .get("http://localhost:8090/villes/all", { headers: authHeader() })
            .then((response) => {
                setVilles(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleVilleChange = (event) => {
        const selectedVilleId = event.target.value;
        setSelectedVille(selectedVilleId);
    };

    return (
        <div className="container mt-5">
            <h1>Edit Zone</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nom" className="form-label">
                        Nom:
                    </label>
                    <input
                        type="text"
                        id="nom"
                        className="form-control"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="select1" className="form-label">
                        Ville:
                    </label>
                    <select
                        className="form-select"
                        id="select1"
                        value={selectedVille}
                        onChange={handleVilleChange}
                    >
                        <option value="">Select Ville</option>
                        {villes.map((ville) => (
                            <option key={ville.id} value={ville.id}>
                                {ville.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Save</button>
            </form>

            <ToastContainer />
        </div>
    );
}
