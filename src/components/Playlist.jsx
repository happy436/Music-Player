import React from "react";
import { cleanedFileName } from "utils/cleanedFileName";

function Playlist({handleChangeSong, playlist, isPlaying, currentSongIndex}) {
    return (
        <div className="play-list" style={{height:`${playlist.length * 80}px`, transition:"0.3s"}}>
            {playlist.map((file, index) => (
                <div
                    key={file.file.name}
                    onClick={() => handleChangeSong(index)}
                    /* onClick={() => clickAudio(key)} */
                    className={`track ${
                        index === currentSongIndex && !isPlaying
                            ? "current-audio"
                            : ""
                    } ${
                        index === currentSongIndex && isPlaying
                            ? "play-now"
                            : ""
                    }`}
                >
                    {/* <img className="track-img" src={music.img} /> */}
                    <div className="track-discr">
                        <span className="track-name">
                            {cleanedFileName(file.file.name)}
                        </span>
                        {/* <span className="track-author">
                                    {music.author}
                                </span> */}
                    </div>
                    <span className="track-duration">{file.duration}</span>
                </div>
            ))}
        </div>
    );
}

export default Playlist;
