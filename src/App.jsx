import AddSongButton from "components/AddSongButton";
import PlayButton from "components/PlayButton";
import Playlist from "components/Playlist";
import PrevNextButton from "components/PrevNextButton";
import RepeatButton from "components/RepeatButton";
import Timeline from "components/Timeline";
import VolumeButton from "components/VolumeButton";
import React, { useState, useEffect, useRef } from "react";
import { getAudioDuration } from "utils/audioDuration";
import { cleanedFileName } from "utils/cleanedFileName";
import { formatTime } from "utils/formatTime";
import "./style.css";
import WaveForm from "components/WaveForm";

function Main() {
    const [selectedSong, setSelectedSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const [progress, setProgress] = useState(0);
    const [analyzerData, setAnalyzerData] = useState(null);
    const [repeat, setRepeat] = useState(0);
    const [loop, setLoop] = useState(false);
    const [isEmptyPlayList, setIsEmptyPlayList] = useState(false);

    const playerRef = useRef(null);

    useEffect(() => {
        setLoop(false);
        if (repeat === 0) {
            if (transformTime(currentTime) + 1 === transformTime(duration)) {
                if (playlist.length !== 0) {
                    handleNext();
                }
            }
        } else if (repeat === 1) {
            if (transformTime(currentTime) + 1 === transformTime(duration)) {
                if (playlist.length !== 0) {
                    handleNext();
                    if (playlist.length === currentSongIndex + 1) {
                        setCurrentSongIndex(0);
                    }
                }
            }
        } else if (repeat === 2) {
            setLoop(true);
        }
    }, [repeat]);

    useEffect(() => {
        const audioElement = playerRef.current;

        audioElement.addEventListener("timeupdate", updateTime);
        audioElement.addEventListener("loadedmetadata", setAudioDuration);

        return () => {
            audioElement.removeEventListener("timeupdate", updateTime);
            audioElement.removeEventListener(
                "loadedmetadata",
                setAudioDuration
            );
        };
    }, [selectedSong]);

    useEffect(() => {
        if (playlist.length > 0) {
            const file = playlist[currentSongIndex].file;
            const fileUrl = URL.createObjectURL(file);
            setSelectedSong(fileUrl);
        }
    }, [playlist, currentSongIndex]);

    useEffect(() => {
        setIsEmptyPlayList(isEmptyPlaylist());
    }, [playlist]);




    const updateTime = () => {
        const audioElement = playerRef.current;
        const currentTime = formatTime(audioElement.currentTime);
        setCurrentTime(currentTime);

        const progress =
            (audioElement.currentTime / audioElement.duration) * 100;
        setProgress(progress);
    };

    const setAudioDuration = () => {
        const audioElement = playerRef.current;
        const durationSong = formatTime(audioElement.duration);
        setDuration(durationSong);
        return durationSong;
    };

    const handleSeek = (e) => {
        const audioElement = playerRef.current;
        const progressContainer = document.getElementById("timeline");

        const progressWidth = progressContainer.offsetWidth;
        const clickX =
            e.clientX - progressContainer.getBoundingClientRect().left;
        const seekTime = (clickX / progressWidth) * audioElement.duration;

        audioElement.currentTime = seekTime;
    };

    const handlePlay = () => {
        if (!isPlaying) {
            playerRef.current.play();
            setIsPlaying(true);
        } else {
            playerRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSongChange = async (event) => {
        const files = event.target.files;
        const newPlaylist = [...playlist];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const songDuration = await getAudioDuration(file);
            newPlaylist.push({ file: file, duration: songDuration });
        }

        setPlaylist(newPlaylist);
        setCurrentSongIndex(newPlaylist.length - 1);
        setIsPlaying(false);
        audioAnalyzer();
    };

    const handleVolumeChange = (e) => {
        playerRef.current.volume = e.target.value;
    };

    const handlePrevious = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentSongIndex < playlist.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
        }
    };

    const handleChangeSong = (index) => {
        setCurrentSongIndex(index);
    };

    
    

    const handleRepeat = () => {
        /* 
        0 - dont repeat playlist
        1 - repeat playlist
        2 - loop song
        */
        setRepeat((prev) => {
            if (prev < 2) {
                return prev + 1;
            }
            return 0;
        });
    };
    const transformTime = (timeString) => {
        const timeParts = timeString.split(":");
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const totalMinutes = hours * 60 + minutes;
        return totalMinutes;
    };

    const isEmptyPlaylist = () => {
        return playlist.length !== 0;
    };
    
    const audioAnalyzer = () => {
        const audioCtx = new (window.AudioContext ||
            window.webkitAudioContext)();
        const analyzer = audioCtx.createAnalyser();
        analyzer.fftSize = 2048;

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const source = audioCtx.createMediaElementSource(playerRef.current);
        source.connect(analyzer);
        source.connect(audioCtx.destination);
        source.onended = () => {
            source.disconnect();
        };

        setAnalyzerData({ analyzer, bufferLength, dataArray });
    };

    return (
        <>
            <div className="card">
                <div className="current-song">
                    <audio
                        src={selectedSong}
                        ref={playerRef}
                        autoPlay={isPlaying}
                        loop={loop}
                    />
                    <div className="img-wrap">
                        {analyzerData && (
                            <WaveForm analyzerData={analyzerData} />
                        )}
                        {/* <img src={currentSong.img} /> */}
                    </div>
                    <span className="song-name">
                        {playlist.length !== 0 &&
                            cleanedFileName(
                                playlist[currentSongIndex].file.name
                            )}
                    </span>

                    <div>
                        <Timeline
                            currentTime={currentTime}
                            duration={duration}
                            handleSeek={handleSeek}
                            progress={progress}
                        />
                        <div className="controls">
                            <RepeatButton
                                active={isEmptyPlayList}
                                handleClick={handleRepeat}
                                repeat={repeat}
                            />

                            <PrevNextButton
                                type="prev"
                                onClick={handlePrevious}
                                active={isEmptyPlayList}
                            />
                            <PlayButton
                                isPlaying={isPlaying}
                                play={handlePlay}
                                active={isEmptyPlayList}
                            />
                            <PrevNextButton
                                type="next"
                                onClick={handleNext}
                                active={isEmptyPlayList}
                            />
                            <VolumeButton
                                active={isEmptyPlayList}
                                handleVolumeChange={handleVolumeChange}
                                value={
                                    isEmptyPlayList && playerRef.current.volume
                                }
                            />
                        </div>
                    </div>
                </div>
                <Playlist
                    handleChangeSong={handleChangeSong}
                    playlist={playlist}
                    isPlaying={isPlaying}
                    currentSongIndex={currentSongIndex}
                />
                <AddSongButton handleSongChange={handleSongChange} />
            </div>
        </>
    );
}

export default Main;
