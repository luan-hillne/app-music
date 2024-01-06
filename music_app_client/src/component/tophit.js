import { useEffect, useState } from 'react'
import * as api from '../api/'
import { useParams } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa'
const Base64 = require('js-base64').Base64

export const TopHit = ({ tableName, top, setCurrentId }) => {
    let params = Object.values(useParams())[0]
    const [musics, setMusics] = useState(null)
    const [img, setImg] = useState(null)
    useEffect(() => {
        (async () => {
            const response = await api.Musuc.getTop({ cate: params, limit: 6, top: top })
            response?.success && setMusics(response?.music)
            setImg(Base64.fromUint8Array(new Uint8Array(response?.image.avatar.data)))
        })()
    }, [params])
    return (
        <div className="w-[86%] mx-auto pb-[32px] border-b-2 border-[#333]">
            <div className="text-[#333] text-[24px] mt-[34px] mb-[18px]">{tableName}</div>
            <div className="flex w-full img-container bg-gradient-to-r from-[#574253] to-[#161216] p-[20px] relative">
                <img onClick={() => setCurrentId(musics[0]?._id)} className="w-[240px] h-[240px] cursor-pointer cover " src={`data:image/png;base64,${img}`} alt="img" />
                <div className="absolute play-icon top-[35%] left-[7.5%] flex items-center w-[80px] h-[80px] bg-[#ff551a] rounded-[50%]">
                    <FaPlay className='mx-auto' color='#fff' size={30} />
                </div>
                <div className="w-[80%] ml-[36px] cursor-pointer">
                    {musics && musics.map((music, index) => {
                        return (
                            <div onClick={() => setCurrentId(music?._id)} className={`text-[#fff] h-[17%] flex items-center hover:font-[600] ${index !== musics.length - 1 && 'border-b-2 border-[#ccc]'}`}>
                                <span className='w-[90%]'>{music?.artist?.name} - {music.name}</span>
                                <FaPlay />
                                <span className='ml-[12px]'>{music.countListen}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}