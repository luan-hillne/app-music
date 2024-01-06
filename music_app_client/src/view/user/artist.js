import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import * as api from '../../api'
import { GiSoundWaves } from 'react-icons/gi'
import { useNavigate } from "react-router-dom"
const Base64 = require('js-base64').Base64

export const Artist = () => {
    let params = Object.values(useParams())[0].split('artist/')[1]
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [album, setAlbum] = useState(null)
    const [musics, setMusics] = useState(null)

    useEffect(() => {
        (async () => {
            const response = await api.Artist.getOne({ id: params })
            response.success && setData(response.artist)
            response.success && setAlbum(response.album)
            response.success && setMusics(response.musics)
        })()
    }, [params])

    return (
        <div className="mx-[12px]">
            <div className="w-full h-[360px] relative">
                <div className="absolute top-[8%] left-[4%] w-[60%]">
                    <div className="flex items-center">
                        <div className="flex items-center h-[62px] w-[70px] rounded-[50%] bg-[#f50] text-[#fff] "><GiSoundWaves className="mx-auto" size={50} /></div>
                        <div className="ml-[32px]">
                            <div className="text-[42px] font-[800] text-[#f50]">{data?.name.toUpperCase()}</div>
                            <div className="text-[24px] text-[#fff] bg-[#000] w-fit">
                                <span>{data?.dateOfBirth}</span>
                                {data?.dateOfDeath && <span>-{data?.dateOfDeath}</span>}
                            </div>
                            <div className="text-[20px] mt-[32px] font-[500] text-[#fff] bg-[#000] w-fit p-[8px]">{data?.bio}</div>
                        </div>
                    </div>
                </div>
                <img className="w-[260px] h-[260px] cover absolute top-[12%] right-[8%] border-4 border-[#fff]" src={`data:image/png;base64,${Base64.fromUint8Array(new Uint8Array(data?.avatar?.data))}`} alt="img" />
                <img className="w-full ml-[0%] h-full cover left" src={`data:image/png;base64,${Base64.fromUint8Array(new Uint8Array(data?.thumbnail?.data))}`} alt="img" />
            </div>
            <div className="flex">
                <div className="w-[68%] mt-[12px]">
                    {musics && musics.map((music) => {
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
                    {album && album.map((single) => {
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
