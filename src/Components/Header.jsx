function Header() {
  return (
    <div className="flex justify-between p-2">
      <div className=" flex">
        <img className=" w-[50PX]" src="flaggerman.svg" alt="" />
        <div className=" flex flex-col justify-center leading-[18px] ml-3">
          <span className=" font-extrabold text-white text-[20px]">
            Avocado
          </span>
          <span className=" font-extrabold text-white text-[20px]">
            Deutsch
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <img className="w-[30px]" src="./young8bit.png" alt="" />
        <span className=" text-[10px] font-bold text-gray-700">Young</span>
      </div>
    </div>
  );
}

export default Header;
