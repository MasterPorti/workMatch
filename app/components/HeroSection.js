import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";

export default function HeroSection({
  title,
  subtitle,
  description,
  imageSrc,
  buttonText,
  buttonText2,
}) {
  return (
    <div className="flex items-center h-[80vh] justify-center ml-16">
      <div className="w-1/2 flex flex-col justify-center">
        <div>
          <p className="text-5xl font-thin">{title}</p>
          <p className="text-[#EE4266] text-5xl font-thin">{subtitle}</p>
          <p className="text-5xl font-thin">de América Latina.</p>
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-bold text-base">{description[0]}</span>
          <span className="font-bold text-base">{description[1]}</span>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="bg-[#EE4266] text-white px-4 py-2 rounded-full">
            {buttonText}
          </button>
          <button className="text-[#EE4266] justify-center px-4 py-2 flex items-center gap-2">
            <p>{buttonText2}</p>
            <HiArrowRight className="text-lg pt-0.5" />
          </button>
        </div>
      </div>
      <div className="w-1/2">
        <Image
          src={imageSrc}
          alt="Hero"
          width={500}
          height={500}
          className="rounded-4xl"
        />
      </div>
    </div>
  );
}
