"use client";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

export default function LandingForm() {
  const [username, setUsername] = useState("");

  return (
    <div className="w-fit h-fit z-10" id="container">
      <form className="flex items-center justify-center flex-col" id="inner">
        <div className="text-[2.15rem] sm:text-[3rem] md:text-[4rem] font-bold text-white z-10 mb-4 max-w-[70vw] text-center">
          The Only Link You&apos;ll Ever Need
        </div>
        <div className="max-w-[60vw] text-center font-semibold text-sm sm:text-lg opacity-80 z-10 text-white mb-8">
          connect your audience to all of your content with one link
        </div>
        <div className={`flex items-stretch gap-2 relative filter `} id="input">
          <div
            className={`flex items-center rounded-l-xl bg-white px-6 text-sm md:text-2xl sm:text-md $`}
          >
            <label className="opacity-40 font-semibold">mylinktr.ee/:</label>
            <input
              type="text"
              className="bg-transparent peer py-5 px-2 outline-none border-none md:w-auto w-[8rem]"
              placeholder="fabiconcept"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`px-4 grid place-items-center  rounded-r-xl font-semibold cursor-pointer hover:scale-110 active:scale-95 active:opacity-80 uppercase text-sm md:text-lg sm:text-md`}
          >
            <span className="nopointer">
              <FaArrowUp />
            </span>
          </button>
        </div>
        {/* {hasError === 1 && <div className="p-4 max-w-[70vw] text-center text-red-500 filter drop-shadow-md shadow-white text-sm">{errorMessage}</div>} */}
      </form>
    </div>
  );
}
