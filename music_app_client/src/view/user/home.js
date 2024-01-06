import Card from "../../component/demoCard"

const cardData = [
    {
        src: 'https://i1.sndcdn.com/artworks-o6HYZ8M8D5LGM7YA-vbsoJg-t200x200.jpg',
        name: 'tlinh - nếu lúc đó (ft. 2pillz)',
        artist: 'Ginga'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-QI9OxWrIcU2zAD0f-Wyy2dA-t200x200.jpg',
        name: 'Hòa Minzy x Tăng Duy Tân...',
        artist: 'Ginga'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-arld4UsR6saavHw1-L9J76Q-t200x200.jpg',
        name: "Don't Côi - Ronboogz x RP...",
        artist: 'Ronboogz'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-MTari6aqWwF66LQs-OdVT6g-t200x200.jpg',
        name: 'Rồi ta sẽ ngắm pháo hoa c...',
        artist: 'Mèooooo'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-rhWvYjIxa9zsGbgJ-RaANYQ-t200x200.jpg',
        name: 'Em Đồng Ý (I Do) | Origin...',
        artist: 'UMIE ✪'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-iPFVS0D1Ryrk5CR3-mkM4FQ-t200x200.jpg',
        name: 'Không Yêu Xin Đừng Nói ',
        artist: '𝟹 𝟷 𝟶 𝟽'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-0Jzt2qgWDkVuh0BP-Ryh3Yw-t200x200.jpg',
        name: 'Như Anh Đã Thấy Em (CTT...',
        artist: 'Dewie'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-pLhhnIwz789avtCc-J9EIbg-t200x200.jpg',
        name: 'Roi Mot Ngay - Dewie',
        artist: 'Darby'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-SfxS85IGfAy00sAe-owodvA-t200x200.jpg',
        name: '11 giờ 11 phút - MiiNa x RIN9 x ',
        artist: 'TIEN TIEN'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-000447143016-wap2xv-t200x200.jpg',
        name: 'QUA NGAY MAI - TIEN TIEN',
        artist: 'DeeYouSee'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-xzpdE62q0XZtygvM-RZWxKg-t200x200.jpg',
        name: 'Chuyện Đôi Ta (DeeYouSe...',
        artist: 'VRT'
    },
    {
        src: 'https://i1.sndcdn.com/artworks-uwsA9KoU5tVF5dsZ-4lrdPg-t200x200.jpg',
        name: 'nit, sing - ôm em lần cuối',
        artist: 'Nham Gia Bao'
    }
]

export const Home = () => {
    return (
        <div className="w-full bg-[#f2f2f2]">
            <div className="mx-[12px] bg-[#fff] pb-[40px]">
                <div className="w-full text-center bg-slideImg text-[#fff] py-[10%]">
                    <div className="text-[34px]">Connect on LoudSound</div>
                    <div className="text-[18px] my-[12px]">Discover, stream, and share a constantly expanding mix of music<br></br>from emerging and major artists around the world.</div>
                    <div className="px-[4%] py-[0.7%] rounded-[4px] bg-[#f50] text-[18px] w-fit mx-auto">Sign up for free</div>
                </div>
                <div className="text-[#333] text-[24px] text-center py-[32px] font-[600]">Hear what’s trending for free in the SoundCloud community</div>
                <div className="grid grid-cols-6 gap-1 mx-[5%]">
                    {cardData.map(card => <Card src={card.src}
                        name={card.name}
                        artist={card.artist} />)}

                </div>
                <div className="px-[4%] py-[0.7%] rounded-[4px] bg-[#f50] text-[18px] text-[#fff] w-fit mx-auto my-[40px]">Explore trending playlists</div>
            </div>
            <div className="flex mx-[6%] pt-[40px]">
                <img className="w-[60%]" src="https://a-v2.sndcdn.com/assets/images/never_stop_listening@1x-9c5264ff.jpg" alt="bg" />
                <div className="w-[38%] m-[6%]">
                    <div className="text-[36px] pb-[12px]">Never stop listening</div>
                    <div className="w-[80px] h-[4px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="text-[24px] py-[18px]">SoundCloud is available on <br /> Web, iOS, Android, Sonos,<br />Chromecast, and Xbox One.</div>
                    <div className="flex gap-4">
                        <img src="https://a-v2.sndcdn.com/assets/images/appstore_badge@en-9e7292e6.png" alt="bg" />
                        <img src="https://a-v2.sndcdn.com/assets/images/google_play_badge@en-51d52194.png" alt="bg" />
                    </div>
                </div>
            </div>
            <div className="mx-[12px] bg-[#fff] pb-[40px]">
                <div className="w-full bg-slideImg2 text-[#fff] py-[5%] pl-[10%]">
                    <div className="text-[36px]">Calling all creators</div>
                    <div className="text-[24px] my-[12px]">Get on SoundCloud to connect with fans, share <br />your sounds, and grow your audience. What are <br />you waiting for?</div>
                    <div className="rounded-[4px] border-[#fff] border-[2px] text-[18px] px-[24px] py-[13px] w-fit">Find out more</div>
                </div>
                <div className="text-[#333] text-[36px] text-center pt-[32px] font-[600]">Thanks for listening. Now join in.</div>
                <div className="text-[#333] text-[24px] text-center">Save tracks, follow artists and build playlists. All for free.</div>
                <div className="px-[4%] py-[0.7%] rounded-[4px] bg-[#f50] text-[18px] text-[#fff] w-fit mx-auto my-[24px]">Starting discovery</div>
            </div>
        </div>
    )
}
