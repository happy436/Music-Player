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
import s from "./components/AudioVisualizer.module.css";

function Main() {
    const [selectedSong, setSelectedSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const playerRef = useRef(null);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const [progress, setProgress] = useState(0);

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

    const [repeat, setRepeat] = useState(0);

    const handleRepeat = () => {
        if (repeat >= 3) {
            setRepeat(0);
        } else {
            setRepeat((prev) => prev + 1);
        }
    };

    const isEmptyPlaylist = () => {
        return playlist.length !== 0;
    };

    const [isEmptyPlayList, setIsEmptyPlayList] = useState(false);
    useEffect(() => {
        setIsEmptyPlayList(isEmptyPlaylist());
    }, [playlist]);

    /*  */

    /* const canvasRef = useRef(null)

    const audioVisualizerLogic = () => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const source = context.createBufferSource();
    
        //fetch remote audio source
        fetch(selectedSong)
            .then((response) => response.arrayBuffer())
            .then((response) => {
                context.decodeAudioData(response, (buffer) => {
                    source.buffer = buffer;
                    source.connect(context.destination);
                    // auto play
                    source.start(0);
                });
            });
        const audio = new Audio(source),
            canvas = canvasRef.current;

        //config canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
    
        //config audio analyzer
        const analyser = context.createAnalyser();
        source.connect(analyser);
        analyser.connect(context.destination);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount,
            dataArray = new Uint8Array(bufferLength),
            WIDTH = canvas.width,
            HEIGHT = canvas.height,
            barWidth = (WIDTH / bufferLength) * 2.5;
        let barHeight = null,
            x = null;
    
        //core logic for the visualizer
        const timeouts = [];
        const renderFrame = () => {
            ctx.fillStyle = "rgba(0,0,0,0)";
            requestAnimationFrame(renderFrame);
            x = 0;
            analyser.getByteFrequencyData(dataArray);
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
            for (let i = 0; i < bufferLength; i++) {
                //color based upon frequency
                barHeight = dataArray[i];
                let r = barHeight + 22 * (i / bufferLength),
                    g = 333 * (i / bufferLength),
                    b = 47;
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                x += barWidth + 1;
    
                //Allows visualizer to overlay on a background/video by clearing the rects after painting.
                let timer = setTimeout(() => {
                    ctx.clearRect(0, 0, WIDTH, HEIGHT);
                }, 50);
                timeouts.push(timer);
            }
        };
        
        //Clears the accumulating timeouts.
        setTimeout(() => {
            for (let i = 0; i < timeouts.length; i++) {
                return clearTimeout(timeouts[i]);
            }
        }, 51);
        renderFrame();
    };
    
    //connect audio visualizer to DOM and execute logic
    useEffect(() => {
        audioVisualizerLogic();
    }, [selectedSong, playerRef]); */

    return (
        <>
            <div className="card">
                <div className="current-song">
                    <audio
                        src={selectedSong}
                        ref={playerRef}
                        autoPlay={isPlaying}
                    />
                    <div className="img-wrap">
                        {/* <div className={s.App}>
                            <main className={s.main}>
                                <canvas
                                    ref={canvasRef}
                                    className={s.canvas}
                                ></canvas>
                            </main>
                        </div> */}
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
                            <RepeatButton active={isEmptyPlayList} />

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
                    cleanedFileName={cleanedFileName}
                    isPlaying={isPlaying}
                    currentSongIndex={currentSongIndex}
                />
                <AddSongButton handleSongChange={handleSongChange} />
            </div>
        </>
    );
}

export default Main;
