const Card = ({ src, name, artist }) => {
    return (
        <div className="w-[180px] mx-auto">
            <img className="w-full h-[180px] cover" src={src} alt="img" />
            <div className="text-[14px]">{name}</div>
            <div className="text-[#ccc] mt-[-4px] text-[12px]">{artist}</div>
        </div>
    )
}
export default Card