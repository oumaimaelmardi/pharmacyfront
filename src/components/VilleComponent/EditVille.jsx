import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";

export default function EditVille() {
    const [nom, setNom] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSubmit1 = (event) => {
        event.preventDefault();

        if (!nom) {
            // Display error toast for empty input
            toast.error("City name cannot be empty");
            return;
        }

        // Create the updated Zone object
        const updatedVille = {
            id: id,
            nom: nom,
        };

        // Update the Zone entity
        axios
            .put("http://localhost:8090/villes/update", updatedVille, { headers: authHeader() })
            .then(() => {
                // Display success toast
                toast.success("City updated successfully");
                // Redirect to admin page after a delay
                setTimeout(() => {
                    navigate("/admin");
                }, 2000);
            })
            .catch((error) => {
                if (error.response && error.response.status === 409) {
                    // Display error toast for existing city
                    toast.error("City already exists");
                } else {
                    // Display general error toast
                    toast.error("Error adding city");
                }
            });
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8090/villes/${id}`, { headers: authHeader() })
            .then((response) => {
                const zone = response.data;
                setNom(zone.nom);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    return (
        <div className="d-flex justify-content-center align-items-center mt-2">
            <div className="card" style={{ width: "400px" }}>
                <div className="card-body">
                    <h5 className="card-title mb-4 text-center">Add City</h5>
                    <form onSubmit={handleSubmit1}>
                        <div className="mb-3">
                            <label htmlFor="zoneName" className="form-label">
                                City Name:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="zoneName"
                                placeholder="Enter City name"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Edit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer /> {/* Add this line to display the toast messages */}
        </div>

    );
}
