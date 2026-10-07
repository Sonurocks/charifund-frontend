
"use client";


import Button from "../../UI/web/Buttons/Button";
import toast from "react-hot-toast";
import React, { Suspense, lazy } from "react";
// Dynamic imports for Formik components
const Formik = lazy(() => import("formik").then(module => ({ default: module.Formik })));
const Form = lazy(() => import("formik").then(module => ({ default: module.Form })));
import { CommentReplyFormValues, CommentReplySchema } from "@/src/utils/validations/FormValidation";
import InputField from "../../UI/web/InputField";
import { FaX } from "react-icons/fa6";
import ButtonLoader from "../../UI/web/Loader/ButtonLoader";
import { useAddReply } from "@/src/hooks/web/useComments";
import CancelButton from "../../UI/web/Buttons/CancelButton";
import { ReplyCommentProps } from "@/src/types/web/comments";

const initialValues: CommentReplyFormValues = {
  email: "",
  name: "",
  comment: "",
};


export default function ReplyComment({ id, handleReplyModel }: ReplyCommentProps) {
  const mutation = useAddReply();

const handleSubmit = (values: CommentReplyFormValues, { resetForm }: { resetForm: () => void }) =>  {
  const tempReply = {
    ...values,
    id: Date.now(),
    commentId: id,
    isPending: true,
  };
  toast.dismiss()
  toast.loading("Reply .....")
  // Save to LocalReplies
  const localReplies = JSON.parse(localStorage.getItem('LocalReplies') || '[]');
  localStorage.setItem('LocalReplies', JSON.stringify([...localReplies, tempReply]));

  // ✅ Update totalReplies in LocalComments
  const localComments = JSON.parse(localStorage.getItem('LocalComments') || '[]');
  const updatedComments = localComments.map((c: any) => {
    if (c.id === id) {
      return {
        ...c,
        totalReplies: (c.totalReplies || 0) + 1,
      };
    }
    return c;
  });
  localStorage.setItem('LocalComments', JSON.stringify(updatedComments));

  // Trigger UI refresh
  window.dispatchEvent(new Event("commentAdded"));

  // Trigger server mutation (if connected)
  mutation.mutate(
    { id: id, data: values },
    {
      onSuccess: () => {
        toast.dismiss()
        toast.success("Reply submitted successfully");
        resetForm();
        handleReplyModel(false);
      },
      onError: () => {
        toast.dismiss()
        toast.error("Reply can not be added, please try again later!");
      },
    }
  );
};


  return (
    <div className="w-full mt-10 p-4 sm:p-6  bg-white rounded-lg shadow-lg border border-gray-100 py-5">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl sm:text-2xl lg:text-[27px] font-nunito font-extrabold text-foreground ">
          Reply
        </h2>
        <FaX onClick={() => handleReplyModel(false)} className="cursor-pointer text-foreground mb-1" size={20} />
      </div>
      <Suspense fallback={
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:flex gap-4 lg:flex lg:gap-5">
            <div className="flex-1">
              <div className="flex items-center bg-gray-light rounded-md px-4 py-2 w-full animate-pulse">
                <div className="w-full h-6 bg-white/20 rounded"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center bg-gray-light rounded-md px-4 py-2 w-full animate-pulse">
                <div className="w-full h-6 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full items-start flex bg-gray-light rounded-md px-4 py-2 animate-pulse">
              <div className="w-full h-16 bg-white/20 rounded"></div>
            </div>
          </div>
          <div className="flex justify-start space-x-3 mt-8">
            <div className="w-fit">
              <div className="w-24 h-12 bg-green rounded-full animate-pulse"></div>
            </div>
            <div className="w-fit">
              <div className="w-20 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      }>
        <Formik
          initialValues={initialValues}
          validationSchema={CommentReplySchema}
          onSubmit={handleSubmit as any}
        >
        {() => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:flex gap-4 lg:flex lg:gap-5">
              <div className="flex-1">
                <InputField
                  type="text"
                  name='name'
                  icon={"mdi:user"}
                  placeholder="Your Name"
                  className="flex items-center bg-gray-light rounded-md px-4 py-2 w-full "
                />
              </div>

              <div className="flex-1">
                <InputField
                  type="email"
                  icon={'mdi:envelope'}
                  name="email"
                  placeholder="Enter Email"
                  className="flex items-center bg-gray-light rounded-md px-4 py-2 w-full"
                />
              </div>
            </div>

            <div className="flex-1  ">
              <InputField
                as='textarea'
                icon={'fa7-regular:comments'}
                name="comment"
                placeholder="Type Your Reply..."
                className="w-full items-start flex bg-gray-light rounded-md px-4 py-2 focus:outline-none resize-none "
              />
            </div>

            <div className="flex justify-start space-x-3 mt-8">
              <div className="w-fit">
                <Button
                  text={"Add Reply"}
                  bgColor="bg-green"
                  textColor="text-white text-sm lg:text-lg"
                  rounded="rounded-full"
                  hoverTextColor="group-hover:text-black"
                  hoverBg="before:bg-yellow"
                  paddingx="px-4 md:px-5 "
                  paddingy="py-3 md:py-4 "
                  type="submit"
                >
                  {mutation.isPending ? (
                    <ButtonLoader />) : (
                    "Add Reply"
                  )}
                </Button>
              </div>
              <div className="w-fit">
                <CancelButton rounded="rounded-full"
                  paddingX="px-4 md:px-6"
                  paddingY="py-3"
                  text="Cancel"
                  textSize="text-sm lg:text-lg"
                  onClose={() => handleReplyModel(false)} />
              </div>
            </div>
          </Form>
        )}
      </Formik>
      </Suspense>
    </div>
  );
}
