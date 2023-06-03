import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import authHeader from "../../services/auth-header";

export default function EditPhGarde() {
    const { gardeId, pharmacieId } = useParams();
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const navigate = useNavigate();
    const [gardeList, setGardeList] = useState([]);
    const [pharmacieList, setPharmacieList] = useState([]);

    useEffect(() => {
        fetchGardeList();
        fetchPharmacieList();
        fetchPharmacieGarde();
    }, []);

    const fetchGardeList = async () => {
        try {
            const response = await axios.get("http://localhost:8090/gardes/all", { headers: authHeader() });
            setGardeList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPharmacieList = async () => {
        try {
            const response = await axios.get("http://localhost:8090/pharmacies/all", { headers: authHeader() });
            setPharmacieList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPharmacieGarde = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8090/pharmacieGarde/${gardeId}/${pharmacieId}`, { headers: authHeader() }
            );
            const pharmacieGarde = response.data;
            setDateDebut(pharmacieGarde.date_debut);
            setDateFin(pharmacieGarde.date_fin);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDateDebutChange = (event) => {
        setDateDebut(event.target.value);
    };

    const handleDateFinChange = (event) => {
        setDateFin(event.target.value);
    };


    const handleSubmit = async (event) => {
        // Create the updated Zone object
        const updatedPh = {
            id: {
                garde_id: parseInt(gardeId),
                pharmacie_id: parseInt(pharmacieId),
            },
            date_debut: dateDebut,
            date_fin: dateFin,
            pharmacie: {
                id: parseInt(pharmacieId),
            },
        };

        event.preventDefault();
        if (dateDebut === "" || dateFin === "") {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            await axios.put(
                `http://localhost:8090/pharmacieGarde/update`, updatedPh, { headers: authHeader() })




            // Display success toast
            toast.success("Pharmacie Garde updated successfully");
            // Redirect to list page after a delay
            setTimeout(() => {
                navigate("/ListPhGarde");
            }, 2000);
        } catch (error) {
            toast.error("Error updating Pharmacie Garde");
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Edit Pharmacie Garde</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="dateDebut" className="form-label">
                        Date Debut:
                    </label>
                    <input
                        type="date"
                        id="dateDebut"
                        className="form-control"
                        value={dateDebut}
                        onChange={handleDateDebutChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="dateFin" className="form-label">
                        Date Fin:
                    </label>
                    <input
                        type="date"
                        id="dateFin"
                        className="form-control"
                        value={dateFin}
                        onChange={handleDateFinChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}
