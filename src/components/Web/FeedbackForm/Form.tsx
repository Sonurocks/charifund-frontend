'use client'

import React, { Suspense, lazy } from 'react'
import { createPortal } from 'react-dom'
import dynamic from 'next/dynamic'
const Icon = dynamic(() => import('@iconify/react').then(m => m.Icon), { ssr: false })
import Button from '../../UI/web/Buttons/Button'
import InputField from "../../UI/web/InputField";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import { useCreateFeedback, submitFeedbackForm } from '@/src/hooks/web/useFeedback';
import { useTranslation } from 'react-i18next';
import { FeedbackFormValues, feedbackSchema } from '@/src/utils/validations/FormValidation';
import Image from "next/image";
import { IMAGE_STANDARDS, validateImageFile } from '@/src/utils/imageStandards';
const Formik = lazy(() => import("formik").then(module => ({ default: module.Formik })));
const Form = lazy(() => import("formik").then(module => ({ default: module.Form })));

const initialValues: FeedbackFormValues = {
  name: '',
  designation: '',
  feedback: '',
  rating: 0,
  image: '' as any
}

const FormComponent = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [imageName, setImageName] = React.useState<string>('')
  const [imageSizeError, setImageSizeError] = React.useState<string>('')
  const [toast, setToast] = React.useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  const createFeedbackMutation = useCreateFeedback()

  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleSubmit = async (values: FeedbackFormValues, { resetForm, setSubmitting }: any) => {
    setToast({ type: 'success', message: t('Submitting your feedback...') });
    try {
      await submitFeedbackForm(
        values,
        createFeedbackMutation,
        resetForm,
        setSubmitting,
        onClose
      );
    } catch (error) {
      console.log(' Error in feedback submission:', error);
      setToast({ type: 'error', message: t('Failed to submit feedback') });
    }
  }

  const modalContent = (
    <div
      className="bg-black/50 flex items-center justify-center z-[9999] p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        transform: 'translateZ(0)',
        overflow: 'hidden',
        willChange: 'transform',
        margin: 0,
        padding: '1rem'
      }}
    >
      <div className="bg-teal-800 rounded-lg shadow-2xl max-w-xl w-full mx-2 sm:mx-4 md:mx-0 relative">
        {/* Toast */}
        {toast && (
          <div
            className={`absolute top-2 left-2 z-[10001] p-3 sm:p-4 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 max-w-xs sm:max-w-sm ${toast.type === 'success'
              ? 'bg-green text-white'
              : 'bg-red text-white'
            }`}
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            <Icon
              icon={toast.type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'}
              className="text-lg sm:text-xl flex-shrink-0"
            />
            <span className="font-medium text-sm sm:text-base">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-1 sm:ml-2 hover:opacity-70 flex-shrink-0"
            >
              <Icon icon="mdi:close" className="text-lg sm:text-xl cursor-pointer" />
            </button>
          </div>
        )}

        <div className="p-3 sm:p-4 md:p-5">
          {/* Header */}
          <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div className="flex-1 pr-2">
              <FadeUpCard delay={0.3}>
                <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 mb-2 sm:mb-3">
                  <span className="text-yellow font-caveat font-extrabold text-sm sm:text-lg md:text-xl">
                    {t("Your Voice Matters")}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-nunito font-extrabold text-white leading-tight">
                  {t("Share Your Experience with Youth Util Welfare Association")}
                </h2>
              </FadeUpCard>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white text-xl  cursor-pointer sm:text-2xl ml-2 sm:ml-4 flex-shrink-0"
            >
              <Icon icon="mdi:close" />
            </button>
          </div>

          <FadeUpCard>
            <Suspense fallback={
              <div className="space-y-4 sm:space-y-5 px-2 sm:px-3 py-2 sm:py-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="w-full rounded-md flex border border-gray-green text-sm sm:text-base bg-foreground/18 h-[44px] sm:h-[48px] px-3 sm:px-4 py-2 sm:py-3 text-white animate-pulse">
                    <div className="w-full bg-white/20 rounded h-6"></div>
                  </div>
                  <div className="w-full rounded-md flex border border-gray-green text-sm sm:text-base bg-foreground/18 h-[44px] sm:h-[48px] px-3 sm:px-4 py-2 sm:py-3 text-white animate-pulse">
                    <div className="w-full bg-white/20 rounded h-6"></div>
                  </div>
                </div>
                <div className="w-full rounded-md border border-gray-green h-[100px] sm:h-[96px] bg-foreground/18 px-3 sm:px-4 py-2 sm:py-3 animate-pulse">
                  <div className="w-full bg-white/20 rounded h-6"></div>
                </div>
                <div className="w-full rounded-md border-2 border-dashed border-yellow bg-foreground/18 h-16 sm:h-20 md:h-24 animate-pulse">
                  <div className="w-full bg-white/20 rounded h-6"></div>
                </div>
                <div className="py-2 sm:py-3 text-center">
                  <div className="bg-yellow px-6 sm:px-10 py-3 sm:py-4 rounded animate-pulse">
                    <div className="w-32 h-6 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            }>
              <Formik
                initialValues={initialValues}
                validationSchema={feedbackSchema}
                onSubmit={handleSubmit as any}
              >
                {({ isSubmitting, setFieldValue, values, errors, touched }) => (
                  <Form className="space-y-4 sm:space-y-5 px-2 sm:px-3 py-2 sm:py-3">
                  {/* Name & Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="relative">
                      <InputField
                        name="name"
                        placeholder={t("Full Name")}
                        icon={"mdi:account"}
                        textSize="text-base"
                        errorTextSize="text-sm"
                        iconClassName="text-yellow text-base font-bold size-5 mt-[2px]"
                        className="w-full rounded-md flex border border-gray-green text-sm sm:text-base bg-foreground/18 h-[44px] sm:h-[48px] px-3 sm:px-4 py-2 sm:py-3 
                   text-white focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <InputField
                        name="designation"
                        textSize="text-base"
                        errorTextSize="text-sm"
                        placeholder={t("Designation / Association")}
                        icon="mdi:briefcase"
                        iconClassName="text-yellow text-base font-bold size-5 mt-[2px]"
                        className="w-full rounded-md border flex border-gray-green h-[44px] sm:h-[48px] bg-foreground/18 px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                      {t("Your Experience (1–5)")} *
                    </label>
                    <div className="flex gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFieldValue('rating', star)}
                          className={`text-lg sm:text-xl ${star <= values.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                        >
                          <Icon icon="mdi:star" />
                        </button>
                      ))}
                    </div>
                    {errors.rating && touched.rating && (
                      <div className="text-red-400 text-xs mt-1">
                        {String(errors.rating)}
                      </div>
                    )}
                  </div>

                  {/* Feedback */}
                  <div className="relative text-white">
                    <InputField
                      as="textarea"
                      name="feedback"
                      textSize="text-base"
                      errorTextSize="text-sm"
                      placeholder={t("Tell us about your experience with Yuva India...")}
                      icon="mdi:message-text"
                      iconClassName="text-yellow text-base font-bold size-5 mt-[2px]"
                      className="w-full rounded-md border border-gray-green h-[100px] sm:h-[96px] bg-foreground/18 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none resize-none overflow-y-auto scrollbar-hide"
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none">
                      {values.feedback ? `${values.feedback.length}/275` : '0/275'}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative text-white">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-2">
                      {t("Profile Photo (Optional)")}
                    </label>
                    <div className="relative">
                      {imagePreview ? (
                        <div className="w-full rounded-md border-2 border-yellow bg-foreground/18 p-2 sm:p-3 md:p-4">
                          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                fill
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-blue text-xs sm:text-sm font-medium mb-1 truncate">
                                {imageName}
                              </div>
                              <div className="text-gray-400 text-xs sm:text-sm">
                                {t("Uploaded successfully")}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null)
                                setImageName('')
                                setImageSizeError('')
                                setFieldValue('image', null)
                              }}
                              className="text-red-400 hover:text-red-300 text-base sm:text-lg md:text-xl flex-shrink-0 p-1"
                            >
                              <Icon icon="mdi:close" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full rounded-md border-2 border-dashed border-yellow bg-foreground/18 h-16 sm:h-20 md:h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-foreground/25 transition-colors p-2 sm:p-3 md:p-4">
                          <Icon
                            icon="mdi:image-plus"
                            className="text-yellow text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2"
                          />
                          <div className="text-center px-1 sm:px-2">
                            <span className="text-gray-400 text-xs sm:text-sm font-base">{t("Drag & Drop your images here or")} </span>
                            <span className="text-yellow text-xs sm:text-sm font-semibold cursor-pointer">{t("browse files")}</span>
                          </div>
                          <input
                            type="file"
                            name="image"
                            accept={IMAGE_STANDARDS.feedback.acceptedFormats.join(",")}
                            onChange={async (e) => {
                              const file = e.target.files?.[0] || null;
                              if (file) {
                                const validation = await validateImageFile(file, IMAGE_STANDARDS.feedback);
                                if (!validation.valid) {
                                  setImageSizeError(validation.error || t('Invalid image file.'));
                                  setImagePreview(null);
                                  setImageName('');
                                  setFieldValue('image', null);
                                  e.target.value = '';
                                  return;
                                }

                                setImageSizeError('');
                                const reader = new FileReader();
                                reader.onload = (e) => setImagePreview(e.target?.result as string);
                                reader.readAsDataURL(file);
                                setImageName(file.name);
                                setFieldValue('image', file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                    {imageSizeError && (
                      <div className="text-red-400 text-xs mt-1">{imageSizeError}</div>
                    )}
                    {errors.image && touched.image && (
                      <div className="text-red-400 text-xs mt-1">{String(errors.image)}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="py-2 sm:py-3 text-center">
                    <div className="inline-block">
                      <Button
                      type="submit"
                      bgColor="bg-yellow"
                      textColor="text-black"
                      hoverTextColor="group-hover:text-white"
                      hoverBg="before:bg-foreground"
                      paddingx="px-6 sm:px-10"
                      paddingy="py-3 sm:py-4"
                      onClick={(e) => {
                       
                      }}
                    >
                      {isSubmitting ? t('Submitting...') : t('Submit Feedback')}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            </Suspense>
          </FadeUpCard>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default FormComponent
