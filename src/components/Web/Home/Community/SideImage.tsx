import { community1, mask } from "@/public/assets";
import Image from "next/image";

export default function SideImage() {
    return (
        <div className="hidden lg:flex gap-10 p-10 bg-[var(--white)] w-[700px]">
            <div className="relative w-full max-w-3xl h-[700px] mx-auto">
                {/* Image with brush mask */}
                <div
                    className={`
      relative w-full h-full
      [mask-image:url('/assets/mask.webp')]
      [mask-repeat:no-repeat]
      [mask-position:left]
      [mask-size:contain]
      [-webkit-mask-image:url('/assets/mask.webp')]
      [-webkit-mask-repeat:no-repeat]
      [-webkit-mask-position:left]
      [-webkit-mask-size:cover]
      scale-120
      overflow-hidden
    `}
                >
                    <Image
                        src={community1.src}
                        alt="Donation"
                        fill
                        className="object-cover object-left"
                    />
                </div>
            </div>

        </div>
    );
}
