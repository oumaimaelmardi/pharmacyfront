import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";

export default function AddVille() {
    const [nom, setNom] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!nom) {
            // Display error toast for empty input
            toast.error("City name cannot be empty");
            return;
        }

        const newTache = {
            nom: nom,
        };

        axios
            .post("http://localhost:8090/villes/save", newTache, { headers: authHeader() })
            .then((response) => {
                if (response.status === 200) {
                    // Display success toast
                    toast.success("City added successfully");
                    // Redirect to admin page after a delay
                    setTimeout(() => {
                        navigate("/admin");
                    }, 2000);
                }
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

    return (

        <div className="d-flex justify-content-center align-items-center mt-2">
            <div className="card" style={{ width: "400px" }}>
                <div className="card-body">
                    <h5 className="card-title mb-4 text-center">Add City</h5>
                    <form onSubmit={handleSubmit}>
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
