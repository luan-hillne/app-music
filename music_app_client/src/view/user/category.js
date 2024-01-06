import { TopArtist, TopHit } from "../../component"
import * as api from '../../api'
import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaPlay } from 'react-icons/fa'
import { BiSkipNext } from 'react-icons/bi'
import { BsFillArrowDownCircleFill, BsFillPauseCircleFill } from 'react-icons/bs'
import { AiTwotoneSound } from 'react-icons/ai'
const Base64 = require('js-base64').Base64

export const Category = () => {
    let params = Object.values(useParams())[0]
    const navigate = useNavigate()
    const [musics, setMusics] = useState(null)
    const [currentId, setCurrentId] = useState(null)
    const [currentPlay, setCurrentPlay] = useState(null)
    const [duration, setDuration] = useState(null)
    const [curentTime, setCurentTime] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    let audioContext = null
    let source = null
    const sourceRef = useRef(null)
    const audioContextRef = useRef(null)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const play = async (byteArray, time) => {
        if (!time) time = 0
        if (!audioContext) {
            audioContext = new AudioContext();
            audioContextRef.current = audioContext
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        source = audioContext.createBufferSource()
        const buffer = await audioContext.decodeAudioData(byteArray, (buffer) => {
            return buffer
        })
        source.buffer = buffer
        source.connect(audioContext.destination)
        setDuration(Math.floor(buffer.duration))
        source.start()
        sourceRef.current = source
        setIsPlaying(true)
    }

    const handleSeek = (process) => {
        if (!sourceRef.current) return
        const newTime = duration / 100 * (+process)
        setCurentTime(newTime)
        sourceRef.current.stop()
        sourceRef.current.disconnect()
        const arrayByte = currentPlay?.data?.data
        const _arrayBuffer = new ArrayBuffer(arrayByte.length);
        const view = new Uint8Array(_arrayBuffer);
        for (let i = 0; i < arrayByte.length; i++) {
            view[i] = arrayByte[i]
        }
        play(_arrayBuffer, newTime)

        // const time = parseFloat(event.target.value);
        // if (this.sourceNode) {
        //   this.sourceNode.currentTime = time;
        // }
    }

    const handlePlay = () => {
        if (!sourceRef.current) return
        if (isPlaying) {
            sourceRef.current.stop()
            setIsPlaying(false)
        } else {
            sourceRef.current.connect(audioContextRef.current.destination)
            sourceRef.current.start(0, 7)
            setIsPlaying(true)
        }
    }

    useEffect(() => {
        (async () => {
            const response = await api.Musuc.getCate({ cate: params })
            response.success && setMusics(response.music)
        })()
    }, [params])
    useEffect(() => {
        if (!currentId) return
        (async () => {
            const response = await api.Musuc.get({ id: currentId })
            response?.success && setCurrentPlay(response.mes)
        })()
    }, [currentId])

    useEffect(() => {
        if (!currentPlay) return
        const arrayByte = currentPlay?.data?.data
        const _arrayBuffer = new ArrayBuffer(arrayByte.length);
        const view = new Uint8Array(_arrayBuffer);
        for (let i = 0; i < arrayByte.length; i++) {
            view[i] = arrayByte[i]
        }
        play(_arrayBuffer)
        const intervall = setInterval(() => {
            setCurentTime(sourceRef.current.context.currentTime)
        }, 1000)

        return () => {
            clearInterval(intervall)
        }
    }, [currentPlay])

    return (
        <div className="px-[12px] pb-[240px]">
            <TopArtist setCurrentId={setCurrentId} />
            <TopHit
                setCurrentId={setCurrentId}
                tableName={'TOP TRENDIND'}
                top={'countListen'}
            />
            <TopHit
                setCurrentId={setCurrentId}
                tableName={'FOR VIP'}
                top={'copyright'}
            />
            <div className="text-[#333] text-[24px] mt-[34px] mb-[18px]">Chill With Category:</div>
            <div className="w-full grid grid-cols-5 gap-auto">
                {musics && musics.map((music) => {
                    const base64String = Base64.fromUint8Array(new Uint8Array(music?.avatar?.data))
                    return (
                        <div className="mx-auto my-[24px] img-container relative">
                            <div onClick={() => setCurrentId(music?._id)} className="absolute play-icon top-[26%] left-[26%] w-[80px] h-[80px] rounded-[50%] bg-[#ff551a] flex items-center">
                                <FaPlay className="mx-auto" color="#fff" size={28} />
                            </div>
                            <img onClick={() => navigate(`/music/${music._id}`)} className="w-[180px] h-[180px] cover" src={`data:image/png;base64,${base64String}`} alt="img" />
                            <div className="text-[14px] text-[#333]">{music?.name}</div>
                            <div className="text-[12px] text-[#999]">{music?.artist?.name}</div>
                        </div>
                    )
                })}
            </div>
            {currentPlay && <div className="fixed bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-[#111]  to-[#333]/[0.6] ">
                <div className="flex w-[90%] mx-auto items-center h-full text-[#fff]">
                    <img className="h-[80%]" src={`data:image/png;base64,${Base64.fromUint8Array(new Uint8Array(currentPlay?.avatar?.data))}`} alt="img" />
                    {isPlaying ? <BsFillPauseCircleFill onClick={() => handlePlay()} className="mx-[44px] hover:text-[#ff551a] cursor-pointer" size={40} />
                        : <FaPlay onClick={() => handlePlay()} className="mx-[44px] hover:text-[#ff551a] cursor-pointer" size={42} />}
                    <BiSkipNext className="hover:text-[#ff551a] cursor-pointer" size={38} />
                    <div className="text-[20px] mx-[12px]">{formatTime(duration)}</div>
                    <div className="mx-[12px] w-[18%]">
                        <p className="text-[20px]">{currentPlay?.name.toUpperCase()}</p>
                        <p className="text-[#999999] cursor-pointer">{currentPlay?.artist.name}</p>
                    </div>
                    <div className="w-[38%] mr-[24px]">
                        <input onChange={(e) => handleSeek(e.target.value)} className="w-full h-2 bg-[#ff551a] slider-thumb-fff appearance-none rounded-lg cursor-pointer dark:bg-[#ff551a]" type="range" min="0" max="100" step="1" value={(curentTime / duration * 100)} />
                    </div>
                    <BsFillArrowDownCircleFill className="hover:text-[#ff551a] cursor-pointer" size={30} />
                    <AiTwotoneSound className="ml-[34px]" size={30} />
                </div>
            </div>}
        </div>
    )
}