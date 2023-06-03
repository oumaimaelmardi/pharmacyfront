import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";

export default function EditPharmacie({ pharmacyId }) {
    const { id } = useParams();
    const [nom, setNom] = useState("");
    const [adresse, setAdresse] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [image, setImage] = useState("");
    const [heureOuverture, setHeureOuverture] = useState("");
    const [heureFermeture, setHeureFermeture] = useState("");
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!nom || !adresse || !latitude
            || !longitude
            || !image
            || !heureOuverture
            || !heureFermeture || !selectedZone) {
            toast.error("Please fill in all required fields");
            return;
        }

        const updatedPharmacy = {
            id: id,
            nom: nom,
            adresse: adresse,
            latitude: latitude,
            longitude: longitude,
            image: image,
            heureOuverture: heureOuverture,
            heureFermeture: heureFermeture,
            zone: {
                id: selectedZone,
            },
        };

        axios
            .put("http://localhost:8090/pharmacies/update", updatedPharmacy, { headers: authHeader() })
            .then((response) => {
                if (response.status === 200) {
                    // Display success toast
                    toast.success("Pharmacy updated successfully");
                    // Redirect to admin page after a delay
                    setTimeout(() => {
                        navigate("/ListPharmacie");
                    }, 2000);
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error("Error updating pharmacy");
            });
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8090/pharmacies/${id}`, { headers: authHeader() })
            .then((response) => {
                const f = response.data;
                setNom(f.nom);
                setAdresse(f.adresse);
                setLatitude(f.latitude);
                setLongitude(f.longitude);
                setImage(f.image);
                setHeureOuverture(f.heureOuverture);
                setHeureFermeture(f.heureFermeture);
                setSelectedZone(f.zone.id);
            })
            .catch((error) => {
                console.log(error);
            });

        axios
            .get("http://localhost:8090/zones/all", { headers: authHeader() })
            .then((response) => {
                setZones(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const handleZoneChange = (event) => {
        const selectedZonesId = event.target.value;
        setSelectedZone(selectedZonesId);
    };

    return (
        <div>
            <h1>Edit Pharmacy</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">
                                Nom:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="adresse" className="form-label">
                                Adresse:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="adresse"
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="latitude" className="form-label">
                                Latitude:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="longitude" className="form-label">
                                Longitude:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">
                                Image:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="heureOuverture" className="form-label">
                                Heure Ouverture:
                            </label>
                            <input
                                type="time"
                                className="form-control"
                                id="heureOuverture"
                                value={heureOuverture}
                                onChange={(e) => setHeureOuverture(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="heureFermeture" className="form-label">
                                Heure Fermeture:
                            </label>
                            <input
                                type="time"
                                className="form-control"
                                id="heureFermeture"
                                value={heureFermeture}
                                onChange={(e) => setHeureFermeture(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="zone" className="form-label">
                                Zone:
                            </label>
                            <select
                                className="form-select"
                                id="zone"

                                value={selectedZone} onChange={handleZoneChange}
                            >
                                <option value="">Select Zone</option>
                                {zones.map((z) => (
                                    <option key={z.id} value={z.id}>
                                        {z.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary px-4">Save</button>
            </form>

            <ToastContainer />
        </div>
    );
}
