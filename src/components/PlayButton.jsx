import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function PlayButton({ isPlaying, play, active }) {
    return (
        <button
            /* onClick={playOrPause} */
            className={`play current-btn ${!active && "inactive"}`}
            onClick={active ? play : null}
        >
            <FontAwesomeIcon icon={!isPlaying ? faPlay : faPause} />
        </button>
    );
}

export default PlayButton;

// ${!isPlaying ? "fa-pause" : "fa-play"}
