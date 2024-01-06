import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as api from '../api'
const Base64 = require('js-base64').Base64
const lazy = [0, 1, 2, 3, 4, 5]

export const TopArtist = () => {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    useEffect(() => {
        (async () => {
            const response = await api.Artist.get()
            response?.success && setData(response?.mess)
        })()
    }, [])

    return (
        <div className="w-full bg-[#000] py-[4%] grid grid-cols-6 gap-auto">
            {!data && lazy.map(() => <div class="animate-pulse ">
                <div class="rounded-full bg-slate-700 h-[168px] w-[168px] mx-auto"></div>
                <div class="h-4 w-[40%] mx-auto bg-slate-700 rounded mt-[24px]"></div>
            </div>)}
            {data && data.map((artist) => {
                const base64String = Base64.fromUint8Array(new Uint8Array(artist?.avatar?.data))
                return (
                    <div onClick={() => navigate(`/artist/${artist._id}`)} className="cursor-pointer opacity-[0.6] hover:opacity-[1]">
                        <img className="w-[180px] h-[180px] mx-auto rounded-[50%]" src={`data:image/png;base64,${base64String}`} alt="img" />
                        <div className="text-[#fff] text-center">{artist.name}</div>
                    </div>
                )
            })}
        </div>
    )
}