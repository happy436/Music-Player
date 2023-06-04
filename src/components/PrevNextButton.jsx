import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function PrevNextButton({ type, onClick, active }) {
    return (
        <button
            /* onClick={prevSong} */
            className={`prev small current-btn ${!active && "inactive"}`}
            onClick={active ? onClick : null}
        >
            <FontAwesomeIcon icon={type === "prev" ? faBackward : faForward} />
        </button>
    );
}

export default PrevNextButton;
