import {
	faVolumeHigh,
	faVolumeLow,
	faVolumeOff,
	faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

function VolumeButton({ handleVolumeChange, active }) {
    const [volume, setVolume] = useState(1)
	const changeVolumeIcon = (volume) => {
		if (Number(volume) === 0) {
			return <FontAwesomeIcon icon={faVolumeXmark} />;
		} else if (volume <= 0.2) {
			return <FontAwesomeIcon icon={faVolumeOff} />;
		} else if (volume <= 0.5) {
			return <FontAwesomeIcon icon={faVolumeLow} />;
		} else {
			return <FontAwesomeIcon icon={faVolumeHigh} />;
		}
	};
	return (
		<button className={`current-btn small volume ${!active && "inactive"}`}>
			<div className="volume-progressbar wrapper">
				<input
					className="volume-progressbar-input"
					type="range"
					min="0"
					max="1"
					step="0.1"
					onChange={(e) => {
						handleVolumeChange(e);
                        setVolume(e.target.value)
					}}
				/>
			</div>
			{changeVolumeIcon(volume)}
		</button>
	);
}

export default VolumeButton;
