'use client'

import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Button from '../../UI/web/Buttons/Button'
import Form from './Form'
import { useTranslation } from 'react-i18next'

const FeedbackForm = () => {
  const [showForm, setShowForm] = useState(false)
  const titleRef = useRef(null)
  const headingRef = useRef(null)
  const isInView = useInView(titleRef, { once: true, amount: 0.3 })
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.3 })
  const { t } = useTranslation()
  return (
    <div 
      className="w-full min-h-[400px] sm:min-h-[500px] relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/assets/feedbackformhome.webp)'
      }}
    >
      {/* Green gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/100 to-dark-green/50 z-10"></div>
      
      {/* Title and Heading */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center z-20 text-white px-4 sm:px-6 md:px-8">
        <div className="mb-3 sm:mb-4 md:mb-5" ref={titleRef}>
          <motion.p 
            className="text-yellow font-medium flex items-center gap-1 sm:gap-2 font-caveat text-lg sm:text-xl md:text-2xl justify-center whitespace-nowrap"
            initial={{ opacity: 0, transform: 'translateZ(0)' }}
            animate={isInView ? { opacity: 1, transform: 'translateZ(0)' } : { opacity: 0, transform: 'translateZ(0)' }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="truncate">🤝 {t("Feedback_Together_For_Better_Society")}</span>
          </motion.p>
        </div>
        
          <motion.h1 
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mt-3 sm:mt-4 md:mt-5 font-nunito w-full max-w-[90%] md:max-w-3xl lg:max-w-5xl mx-auto px-2"
            initial={{ opacity: 0, transform: 'translateZ(0)' }}
            animate={isHeadingInView ? { opacity: 1, transform: 'translateZ(0)' } : { opacity: 0, transform: 'translateZ(0)' }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
                   <span className="sm:whitespace-nowrap">{t("Our Supporters &")} <span className="text-yellow">{t("Community")}</span></span> <br /> {t("Voices")}
          </motion.h1>
          <motion.p
            className="text-white text-base sm:text-lg md:text-xl font-nunito mt-4 mx-auto w-full max-w-[90%] md:max-w-2xl px-2 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t("Your support and participation help us create meaningful change in the community.")}
          </motion.p>
           <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-13 flex justify-center w-full">
             <div className="w-fit scale-90 sm:scale-100">
               <Button 
                 text={t("Share Your Feedback")} 
                 onClick={() => setShowForm(true)}
               />
             </div>
           </div>
        </div>
      
      {/* Bottom decorative image with animation */}
      <motion.div
        className="absolute bottom-0 left-0 w-1/4 sm:w-2/5 md:w-3/5 h-[150px] sm:h-[300px] md:h-[400px] lg:h-[500px] z-10 hidden sm:block"
        animate={{
          y: [0, -11, 0],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity
        }}
      >
        <img 
          src="/assets/verticle-yellow-shape.webp" 
          alt="Decorative shape"
          className="w-full h-full object-cover block"
        />
      </motion.div>

      {/* Feedback Form Modal */}
      {showForm && (
        <Form onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

export default FeedbackForm
