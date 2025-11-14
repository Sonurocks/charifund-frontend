"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { mergeComments, updateLikeCount } from "@/src/utils/mergedComment";
import { CommentType } from "@/src/types/web/comments";
import ReplyComment from "./Reply";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import ShowReply from "./ShowReplies";
import { fetchgetcomments, likeComment } from "@/src/services/web";
import { Comment, CommentsProps } from "@/src/types/web/comments";

// Dynamic icon loading system for optimization
const iconMap = {
  FiHeart: React.lazy(() => import("react-icons/fi").then(module => ({ default: module.FiHeart }))),
  FaHeart: React.lazy(() => import("react-icons/fa").then(module => ({ default: module.FaHeart }))),
  FiCornerUpLeft: React.lazy(() => import("react-icons/fi").then(module => ({ default: module.FiCornerUpLeft }))),
};

// Dynamic Icon Component
const DynamicIcon = ({ name, ...props }: { name: keyof typeof iconMap; [key: string]: any }) => {
  const IconComponent = iconMap[name];
  return (
    <React.Suspense fallback={<div className="w-3 h-3 sm:w-4 sm:h-4" />}>
      <IconComponent {...props} />
    </React.Suspense>
  );
};

export default function Comments({ CommentId }: CommentsProps) {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpenReply) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpenReply]);

  // Load liked state from localStorage
  const getLikedComments = () =>
    JSON.parse(localStorage.getItem("LikedComments") || "[]");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["comments", CommentId],
    queryFn: () => fetchgetcomments(CommentId),
  });

  useEffect(() => {
    if (data?.comments) {
      const mergedComments = mergeComments(data.comments, CommentId);
      const liked = getLikedComments();
      const updated = mergedComments.map((c: Comment) => ({
        ...c,
        isLiked: liked.includes(c.id),
      }));

      setAllComments(updated);
    } else {
      const localComments = JSON.parse(
        localStorage.getItem("LocalComments") || "[]"
      );
      const filteredLocalComments = localComments.filter(
        (comment: CommentType) => comment.blogId === CommentId
      );

      const liked = getLikedComments();
      const updated = filteredLocalComments.map((c: Comment) => ({
        ...c,
        isLiked: liked.includes(c.id),
      }));

      setAllComments(updated);
    }
  }, [data, CommentId, isLoading]);

  useEffect(() => {
    const handleStorageChange = () => {
      const localComments = JSON.parse(
        localStorage.getItem("LocalComments") || "[]"
      );
      const filteredLocalComments = localComments.filter(
        (comment: CommentType) => comment.blogId === CommentId
      );

      const liked = getLikedComments();

      if (data?.comments) {
        const mergedComments = mergeComments(data.comments, CommentId);
        const updated = mergedComments.map((c: Comment) => ({
          ...c,
          isLiked: liked.includes(c.id),
        }));
        setAllComments(updated);
      } else {
        const updated = filteredLocalComments.map((c: Comment) => ({
          ...c,
          isLiked: liked.includes(c.id),
        }));
        setAllComments(updated);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("commentAdded", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("commentAdded", handleStorageChange);
    };
  }, [data, CommentId]);

  const getTimeAgo = (commentTime: string) => {
    const commentDate = new Date(commentTime);
    const now = currentTime;
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Handle like toggle
  const handleLike = async (commentId: string) => {
    const updatedComments = allComments.map((c) => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        const newCount = isLiked
          ? (c.likeCount || 0) + 1
          : Math.max((c.likeCount || 1) - 1, 0);

        // Update localStorage for liked state
        let liked = getLikedComments();
        if (isLiked) {
          liked.push(commentId);
        } else {
          liked = liked.filter((id: string) => id !== commentId);
        }
        localStorage.setItem("LikedComments", JSON.stringify(liked));

        // Update like count in localStorage
        updateLikeCount(commentId, newCount);

        // Call API
        try {
          likeComment(commentId, isLiked ? 1 : -1);
        } catch (error) {
          console.error("Error liking comment:", error);
        }

        return { ...c, isLiked, likeCount: newCount };
      }
      return c;
    });

    setAllComments(updatedComments);
  };
  const handleReplyModel = (value: boolean) => {
    setIsOpenReply(value);
  };
  // Function to handle load more
  const handleLoadMore = () => {
    setVisibleCommentsCount((prev) => prev + 5);
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  // Get visible comments
  const visibleComments = allComments.slice(0, visibleCommentsCount);
  const hasMoreComments = allComments.length > visibleCommentsCount;

  if (isLoading) {
    return <p>Loading comments...</p>;
  }
  if (isError) {
    return <p>No comments available</p>;
  }

  // Hide the entire comments section if there are no comments
  if (allComments.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        {allComments.length.toString().padStart(2, "0")} Comments
      </h2>
      <div className="space-y-6 sm:space-y-10 mb-6 sm:mb-8">
        {visibleComments.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-row items-start gap-3 sm:gap-4 md:gap-6"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-[98.4px] md:h-[98.4px] flex-shrink-0 rounded-full overflow-hidden border-2 border-dashed border-yellow-400 p-1 bg-white flex items-center justify-center">
              <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-500">
                {comment.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-base sm:text-lg md:text-xl font-bold font-nunito capitalize">
                {comment.name}
              </h5>

              <p className="text-sm sm:text-base text-[#667471] font-nunito leading-relaxed sm:leading-snug whitespace-pre-line break-words">
                {comment.comment}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#6B7280]">
                <button
                  className={`flex items-center gap-1 hover:text-red transition-colors cursor-pointer ${
                    comment.isLiked ? "text-red" : ""
                  }`}
                  onClick={() => handleLike(comment.id)}
                >
                  <div className="w-3 h-3 sm:w-[15px] sm:h-[15px]">
                    {comment.isLiked ? <DynamicIcon name="FaHeart" /> : <DynamicIcon name="FiHeart" />}
                  </div>
                  <span className="hidden xs:inline">Like</span>{" "}
                  {comment.likeCount || 0}
                </button>
                <button
                  onClick={() => {
                    setReplyCommentId(comment.id);
                    setIsOpenReply(true);
                  }}
                  className="flex items-center gap-1 cursor-pointer hover:text-olive-brown transition-colors"
                >
                  <DynamicIcon name="FiCornerUpLeft" className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="">Reply</span>
                </button>
                <span className="text-gray-500 text-xs sm:text-sm">
                  {comment.createdAt
                    ? getTimeAgo(comment.createdAt)
                    : comment.timeAgo || "Just now"}
                </span>
              </div>
              {(() => {
                const localReplies = JSON.parse(
                  localStorage.getItem("LocalReplies") || "[]"
                );
                const localReplyCount = localReplies.filter(
                  (r: any) => String(r.commentId) === String(comment.id)
                ).length;

                const totalReplies = comment?.totalReplies
                  ? comment.totalReplies
                  : localReplyCount;

                if (totalReplies <= 0) return null;

                return (
                  <>
                    <div className="flex items-center mt-4 sm:mt-5 space-x-2 sm:space-x-3 justify-start">
                      <div className="border border-gray-300 w-[2vh] sm:w-[4vh]"></div>
                      <div
                        onClick={() => {
                          setReplyCommentId(comment.id);
                          toggleReplies(comment.id);
                        }}
                        className="cursor-pointer font-bold text-xs sm:text-sm text-gray-green hover:text-green transition-colors"
                      >
                        {showReplies[comment.id]
                          ? "Hide replies"
                          : `View ${totalReplies} repl${
                              totalReplies > 1 ? "ies" : "y"
                            }`}
                      </div>
                    </div>
                    {showReplies[comment.id] && (
                      <ShowReply commentId={comment.id} />
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
      {isOpenReply && (
        <div
          className="fixed z-50 flex items-center justify-center inset-0 bg-black/80 md:bg-black/40 p-4 sm:p-6"
          onClick={() => setIsOpenReply(false)}
        >
          <FadeUpCard delay={0.3}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
            >
              <ReplyComment
                id={replyCommentId}
                handleReplyModel={handleReplyModel}
              />
            </div>
          </FadeUpCard>
        </div>
      )}

      {/* Load More Button */}
      {hasMoreComments && (
        <div className="flex justify-start mt-6 sm:mt-8">
          <button
            onClick={handleLoadMore}
            className="relative flex items-center justify-center px-8 sm:px-16 md:px-28 py-3 sm:py-4 bg-transparent border-0 transition-all duration-300 group w-full sm:w-auto sm:min-w-[20rem] md:min-w-[55rem]"
          >
            {/* Left gray line */}
            <div className="absolute left-4 sm:left-8 md:left-12 top-1/2 transform -translate-y-1/2 w-20 sm:w-40 md:w-80 h-0.5 bg-gray-300"></div>

            {/* Yellow text in center with arrow */}
            <span className="text-black font-bold font-nunito text-sm sm:text-base px-2 sm:px-3 py-2 sm:py-3 z-8 bg-white flex items-center gap-2 sm:gap-3 rounded-full hover:shadow-sm hover:px-2 sm:hover:px-3 hover:bg-yellow hover:text-black hover:cursor-pointer duration-300">
              <span className="hidden sm:inline">Load More comments</span>
              <span className="sm:hidden">Load More</span>
              <span className="text-black text-lg sm:text-xl group-hover:text-black">
                ↓
              </span>
            </span>

            {/* Right gray line */}
            <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 transform -translate-y-1/2 w-20 sm:w-40 md:w-80 h-0.5 bg-gray-300"></div>
          </button>
        </div>
      )}
    </div>
  );
}
