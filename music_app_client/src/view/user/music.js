import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import * as api from '../../api'
import { GiSoundWaves } from 'react-icons/gi'
const Base64 = require('js-base64').Base64

export const Music = () => {
    const navigate = useNavigate()
    let params = Object.values(useParams())[0].split('music/')[1]
    const [music, setMusic] = useState(null)
    const [currentPlay, setCurrentPlay] = useState(null)
    const [duration, setDuration] = useState(null)
    const [curentTime, setCurentTime] = useState(null)
    const [musics, setMusics] = useState(null)

    let audioContext = null
    let source = null
    const sourceRef = useRef(null)
    const audioContextRef = useRef(null)

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
    }

    useEffect(() => {
        (async () => {
            const response = await api.Musuc.get({ id: params })
            response.success && setMusic(response.mes)
            response.success && setCurrentPlay(response.mes)
        })()
    }, [params])

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
    }, [currentPlay, sourceRef])
    useEffect(() => {
        (async () => {
            const response = await api.Artist.getOne({ id: music?.artist._id })
            response.success && setMusics(response)
            console.log(response);
        })()
    }, [music])


    return (
        <div className="mx-[12px]">
            <div className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex">
                <img className="w-[260px] h-[260px] cover m-[32px]" src={`data:image/png;base64,${Base64.fromUint8Array(new Uint8Array(music?.avatar?.data))}`} alt="img" />
                <div className="my-[32px] w-[58%]">
                    <div className="text-[36px] text-[#fff]">{music?.name}</div>
                    <div className="text-[#ccc]">Listened by {music?.countListen} people
                        {music?.copyright === true && <span className="text-[#5de565] ml-[12px]">VIP</span>}
                    </div>
                    <div className="text-[20px] mt-[12px]">Created by: {music?.artist.name}</div>
                    <span>{music?.artist?.dateOfBirth}</span>
                    {music?.artist?.dateOfDeath && <span>-{music?.artist?.dateOfDeath}</span>}
                    <div className="h-[80px]">{music?.artist.bio}</div>
                    <input className="w-full h-2 bg-[#ff551a] slider-thumb-fff appearance-none rounded-lg cursor-pointer dark:bg-[#ff551a]" type="range" min="0" max="100" step="1" value={(curentTime / duration * 100)} />
                </div>
                <div className="flex items-center text-[#fff]">
                    <GiSoundWaves className="ml-[80px]" size={150} />
                </div>
            </div>
            <div className="flex">
                <div className="w-[68%] mt-[12px]">
                    {musics && musics?.musics.map((music) => {
                        return (
                            <div onClick={() => navigate(`/music/${music._id}`)} className="flex h-[200px] cursor-pointer items-center border-b-2 border-[#ccc] my-[8px] w-[90%]">
                                <img className="w-[180px] h-[180px] cover left" src={`data:image/png;base64,${Base64.fromUint8Array(new Uint8Array(music?.avatar?.data))}`} alt="img" />
                                <div className="flex items-center">
                                    <div className="w-[300px] ml-[12px]">
                                        <div className="text-[32px]">{music.name}</div>
                                        <div className="text-[#ff551a] text-[22px]">Listened by: {music.countListen} person</div>
                                    </div>
                                    <div className="text-[22px] ml-[12px] w-[200px]">Type: {music?.category?.name}</div>
                                    {music?.copyright === true && <div className="text-[32px] font-[700] text-[#36a03d]">VIP</div>}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="w-[32%] border-l-2 border-[#ccc] pt-[24px]">
                    {musics && musics?.album.map((single) => {
                        return (
                            <div className="ml-[8px]">
                                <img className="w-[240px] h-[240px] cover" src={single?.avatar} alt="img" />
                                <div className="text-[32px] font-[500]">{single?.name}</div>
                                <div className="text-[#ccc] w-[86%]">{single?.description}</div>
                                <div className="w-[86%]">
                                    {single && single.musics.map((music) => {
                                        return (
                                            <div onClick={() => navigate(`/music/${music._id}`)} className="text-[18px] bg-[#333] text-[#fff] p-[4px] border-b-2 border-[#fff] cursor-pointer hover:font-[600] hover:bg-[#ff551a]">{music.name}</div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
