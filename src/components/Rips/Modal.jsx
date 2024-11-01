import React from "react";

const Modal = () => {
    return (
        <>
            {/* Modal JSON */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Seleccione el rango de fechas en el que desea descargar sus RIPS
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{ width: "10px !important" }}></button>
                        </div>
                        <div className="modal-body">
                            <div className="EmpresasResolucion" style={{ display: "flex", justifyContent: "space-around" }}>
                                <div className="Empresa" style={{ display: "none" }}>
                                    <label>Empresa:</label>
                                    <select name="" id="EmpresasRips"></select>
                                </div>
                                <div className="Resolucion">
                                    <label>Resolución:</label>
                                    <select name="" id="ResolucionesRips">
                                        <option value="" selected>
                                            Seleccione Resolución
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <div className="fechas" style={{ display: "flex", justifyContent: "space-around" }}>
                                <div className="fechaInicio" style={{ display: "grid" }}>
                                    <label>Fecha Inicio</label>
                                    <input type="date" id="fechaInicio" />
                                </div>
                                <div className="fechaFin" style={{ display: "grid" }}>
                                    <label>Fecha Fin</label>
                                    <input type="date" id="fechaFin" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ alignItems: "center", justifyContent: "center" }}>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" id="obtenerDatosBtn" className="btn btn-primary">
                                Descargar RIPS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Otros modales pueden seguir la misma estructura */}
        </>
    );
};

export default Modal;
