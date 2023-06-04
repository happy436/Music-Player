import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function RepeatButton({ active, handleClick, repeat }) {
    const repeatClass = () => {
        if (repeat === 0) {
            return "";
        } else if (repeat === 1) {
            return "active";
        } else if (repeat === 2) {
            return "active one";
        }
    };
    return (
        <button
            className={`current-btn small repeat ${repeatClass()} ${active ? "inactive" : ""}`}
            onClick={active ? handleClick : null}
        >
            <FontAwesomeIcon icon={faRepeat} />
        </button>
    );
}

export default RepeatButton;
