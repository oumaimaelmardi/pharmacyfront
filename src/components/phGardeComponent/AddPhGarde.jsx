import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import authHeader from "../../services/auth-header";

export default function AddPhGarde() {
    const [gardeId, setGardeId] = useState("");
    const [pharmacieId, setPharmacieId] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const navigate = useNavigate();
    const [gardeList, setGardeList] = useState([]);
    const [pharmacieList, setPharmacieList] = useState([]);

    useEffect(() => {
        fetchGardeList();
        fetchPharmacieList();
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

    const handleGardeIdChange = (event) => {
        setGardeId(event.target.value);
    };

    const handlePharmacieIdChange = (event) => {
        setPharmacieId(event.target.value);
    };

    const handleDateDebutChange = (event) => {
        setDateDebut(event.target.value);
    };

    const handleDateFinChange = (event) => {
        setDateFin(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (gardeId === "" || pharmacieId === "" || dateDebut === "" || dateFin === "") {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            await axios.post("http://localhost:8090/pharmacieGarde/save", {
                id: {
                    garde_id: parseInt(gardeId),
                    pharmacie_id: parseInt(pharmacieId),
                },
                date_debut: dateDebut,
                date_fin: dateFin,
                pharmacie: {
                    id: parseInt(pharmacieId),
                },
            }, { headers: authHeader() },);

            // Display success toast
            toast.success("Pharmacie Garde added successfully");
            // Redirect to admin page after a delay
            setTimeout(() => {
                navigate("/ListGarde");
            }, 2000);
        } catch (error) {
            toast.error("Error adding Pharmacie Garde");
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Add Pharmacie Garde</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="gardeId" className="form-label">
                        Garde ID:
                    </label>
                    <select
                        id="gardeId"
                        className="form-control"
                        value={gardeId}
                        onChange={handleGardeIdChange}
                    >
                        <option value="">Select Garde</option>
                        {gardeList.map((garde) => (
                            <option key={garde.id} value={garde.id}>
                                {garde.type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="pharmacieId" className="form-label">
                        Pharmacie ID:
                    </label>
                    <select
                        id="pharmacieId"
                        className="form-control"
                        value={pharmacieId}
                        onChange={handlePharmacieIdChange}
                    >
                        <option value="">Select Pharmacie</option>
                        {pharmacieList.map((pharmacie) => (
                            <option key={pharmacie.id} value={pharmacie.id}>
                                {pharmacie.nom}
                            </option>
                        ))}
                    </select>
                </div>
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
                    Add
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}
