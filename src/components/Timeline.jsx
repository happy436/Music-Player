import React from "react";

function Timeline({currentTime, duration, handleSeek, progress}) {
    return (
        <>
            <div className="time">
                <div className="current-time">{currentTime}</div>
                <div className="end-time">{duration}</div>
            </div>
            <div /* ref={timelineRef} */ id="timeline" onClick={handleSeek}>
                <div
                    /* ref={playheadRef} */ id="progress"
                    style={{
                        position: "relative",
                        width: `${progress}%`,
                        height: "100%",
                        background: "#274684",
                        borderRadius:"10px"
                    }}
                >
                    <div
                        /* ref={hoverPlayheadRef} */
                        className="hover-playhead"
                        data-content={currentTime}
                        
                    ></div>
                </div>
            </div>
        </>
    );
}

export default Timeline;
