
   

 "use client"
import gsap from "gsap"
import { useEffect, useRef } from "react"

const CustomCursor = () => {
  const mouse1Ref = useRef<HTMLDivElement>(null)
  const mouse2Ref = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const speed1 = 0.8
  const speed2 = 1.2

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove)

    // GSAP animation loop for smooth following
    const animate = () => {
      if (mouse1Ref.current && mouse2Ref.current) {
        // First circle - faster speed (0.1 = 10% of distance per frame)
        gsap.to(mouse1Ref.current, {
          x: mousePosition.current.x - 10, // Center the circle
          y: mousePosition.current.y - 10,
          duration: speed1,
          ease: "power2.out"
        })

        // Second circle - slower speed (0.05 = 5% of distance per frame)
        gsap.to(mouse2Ref.current, {
          x: mousePosition.current.x - 15, // Center the circle
          y: mousePosition.current.y - 15,
          duration: speed2,
          ease: "power2.out"
        })
      }
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="mouse fixed top-0 left-0 w-[100vw] h-[100dvh] z-[99999999] pointer-events-none">
        <div 
          ref={mouse1Ref}
          className="mouse-1 h-[10px] aspect-square opacity-70 bg-green rounded-full absolute top-1 left-1"
        ></div>
        <div 
          ref={mouse2Ref}
          className="mouse-2 h-[30px] aspect-square opacity-15 bg-green rounded-full absolute top-0 left-0"
        ></div>
    </div> 
  );
}
export default CustomCursor;

