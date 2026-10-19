import { askedquestion, askedquestion1 , verticalShape } from "@/public/assets";

import FadeInUp from "@/src/animations/FadeInUp";
import SlideInRight from "@/src/animations/SlideInRight";
import Image from "next/image";

const FAQSideImages = () => {

  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[45%] xl:mt-0 h-full relative pl-4 lg:pl-10 items-center bg-green overflow-hidden">
      {/* Vertical Shape */}
      <div className="absolute top-0 left-0 w-10 h-full z-10">
        <Image src={verticalShape.src} fill alt="shape" />
      </div>

      {/* Man with Children */}
      <FadeInUp className="w-full lg:w-[90%] xl:w-3/4 h-[720px] xl:h-[810px] right-[-160] xl:right-[-50] relative rounded-2xl border-10 border-white shadow-lg">
        <div className="relative w-full h-full">
          <Image
            src={askedquestion.src}
            alt="Happy family"
            fill
            className="object-cover"
          />
          <div
            className={`w-4 h-30 xl:h-40 rounded-xl absolute bottom-0 right-[-20px] bg-yellow`}
          />
        </div>
      </FadeInUp>

      {/* Woman with Child */}
      <SlideInRight className="w-2/4 mt-6 h-68 absolute hidden xl:flex right-2 top-[30%] xl:top-[30%] rounded-lg overflow-hidden shadow-lg border-4 border-white -translate-y-16 z-10">
        <Image
          src={askedquestion1.src}
          alt="Mother with child"
          fill
          className="object-cover"
           loading="lazy"
        />
      </SlideInRight>
    </div>
  );
};

export default  FAQSideImages