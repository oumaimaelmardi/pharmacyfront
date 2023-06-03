import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFileExcel, faFilePdf, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authHeader from "../../services/auth-header";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export default function VilleList() {
  const [villes, setVilles] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchVilleList();
  }, []);

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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      axios
        .delete(`http://localhost:8090/villes/deleteVille/${id}`, { headers: authHeader() })
        .then(() => {
          toast.success("City deleted successfully");
          setVilles(villes.filter((item) => item.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting city:", error);
          toast.error("Error deleting city");
        });
    }
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(villes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'listville.xlsx');
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
                      City <span>List</span>
                    </h4>
                  </div>
                  <div className="col-sm-9 col-xs-12 text-end">
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search"
                      />
                      <Link to={"/AddVille"}>
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
              <div className="card-body table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {villes.map((ville) => (
                      <tr key={ville.id}>
                        <td>{ville.id}</td>
                        <td>{ville.nom}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Link to={`/EditVille/${ville.id}`}>
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
                              onClick={() => handleDelete(ville.id)}
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
