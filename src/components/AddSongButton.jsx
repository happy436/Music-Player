import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";

function AddSongButton({ handleSongChange }) {
    const inputRef = useRef(null);

    const handleButtonClick = () => {
        inputRef.current.click();
    };
    return (
        <div>
            <button onClick={handleButtonClick} className="add current-btn">
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <input
                type="file"
                accept="audio/*"
                onChange={handleSongChange}
                className="playList-addButton"
                ref={inputRef}
                style={{ display: "none" }} // Скрытие input
                multiple // Разрешение выбора нескольких файлов
            />
        </div>
    );
}

export default AddSongButton;
