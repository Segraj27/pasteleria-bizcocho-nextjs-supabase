import { SizeSelector, Size } from "./tamaños/sizepasteles";
import { useState } from "react";
 

export default function Modalpastel(){
    const [size, setSize] = useState<Size>("Pequeño");

   return(
       <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Selecciona tus ingredientes</h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              >
              </button>
            </div>

            <div className="modal-body">
              {/*  */}
              1😍
             <SizeSelector value={size}
            onChange={setSize} />
            😂😂
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
);
}