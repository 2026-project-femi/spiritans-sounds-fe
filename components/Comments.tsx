"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Send,
  Loader2,
  Reply,
  Smile,
  X,
  Check,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Comment, PostType } from "@/lib/types";

const AVAILABLE_EMOJIS = ["👍", "❤️", "🙏", "👏", "🔥", "💡"];

function getInitials(name: string) {
  if (!name) return "SS";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

// Hydration-safe external store for visitor reactions in localStorage
function subscribeReactions(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("ss_reactions_updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ss_reactions_updated", callback);
  };
}

let cachedRaw: string | null = null;
let cachedReactions: Record<string, string[]> = {};

function getReactionsSnapshot(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("ss_visitor_comment_reactions");
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedReactions = raw ? JSON.parse(raw) : {};
    }
    return cachedReactions;
  } catch {
    return {};
  }
}

const SERVER_EMPTY_REACTIONS: Record<string, string[]> = {};
function getServerReactionsSnapshot(): Record<string, string[]> {
  return SERVER_EMPTY_REACTIONS;
}

interface CommentsProps {
  postId: string | number;
  postType: PostType;
  comments: Comment[];
}

export default function Comments({ postId, postType, comments = [] }: CommentsProps) {
  const [allComments, setAllComments] = useState<Comment[]>(comments);
  const [formData, setFormData] = useState({ name: "", email: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Reply form states
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyData, setReplyData] = useState({ name: "", email: "", comment: "" });
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Collapse/expand state for threads with replies
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});

  // Active emoji picker popup
  const [pickerOpenCommentId, setPickerOpenCommentId] = useState<string | null>(null);

  // Hydration-safe visitor reactions
  const userReactions = useSyncExternalStore(
    subscribeReactions,
    getReactionsSnapshot,
    getServerReactionsSnapshot
  );

  const saveUserReactions = (updated: Record<string, string[]>) => {
    try {
      localStorage.setItem("ss_visitor_comment_reactions", JSON.stringify(updated));
      window.dispatchEvent(new Event("ss_reactions_updated"));
    } catch {
      // Ignore
    }
  };

  const toggleThread = (commentId: string) => {
    setExpandedThreads((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === false ? true : false,
    }));
  };

  // Submit root comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, postType, postId: String(postId) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit comment");

      setMessage({
        text: data.message || "Thank you! Your reflection has been submitted and will appear once reviewed.",
        type: "success",
      });
      setFormData({ name: "", email: "", comment: "" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit reply to an approved comment
  const handleReplySubmit = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReply(true);
    setReplyMessage(null);

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...replyData,
          postType,
          postId: String(postId),
          parentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit reply");

      // Once parent is approved, replies are approved by default -> append immediately
      if (data.comment) {
        setAllComments((prev) => [...prev, data.comment]);
        setExpandedThreads((prev) => ({ ...prev, [parentId]: true }));
      }

      setReplyMessage({
        text: data.message || "Reply posted successfully!",
        type: "success",
      });
      setReplyData({ name: "", email: "", comment: "" });

      setTimeout(() => {
        setActiveReplyId(null);
        setReplyMessage(null);
      }, 1500);
    } catch (err: unknown) {
      setReplyMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Toggle emoji reaction
  const handleToggleReaction = async (commentId: string, emoji: string) => {
    const currentList = userReactions[commentId] || [];
    const hasReacted = currentList.includes(emoji);
    const action = hasReacted ? "remove" : "add";

    const nextList = hasReacted
      ? currentList.filter((e) => e !== emoji)
      : [...currentList, emoji];
    const nextUserReactions = { ...userReactions, [commentId]: nextList };
    saveUserReactions(nextUserReactions);

    // Optimistic tally update
    setAllComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;
        const reactions = { ...(c.reactions || {}) };
        const currentCount = reactions[emoji] || 0;
        if (action === "remove") {
          const count = Math.max(0, currentCount - 1);
          if (count === 0) delete reactions[emoji];
          else reactions[emoji] = count;
        } else {
          reactions[emoji] = currentCount + 1;
        }
        return { ...c, reactions };
      })
    );

    setPickerOpenCommentId(null);

    // Background API call
    try {
      const res = await fetch("/api/comment/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji, action }),
      });
      if (!res.ok) throw new Error("Reaction request failed");
      const data = await res.json();
      if (data.reactions) {
        setAllComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, reactions: data.reactions } : c))
        );
      }
    } catch (err) {
      console.error("Failed to update reaction:", err);
      saveUserReactions(userReactions);
    }
  };

  // Group root comments and replies
  const rootComments = allComments.filter((c) => !c.parent);
  const repliesByParentId = allComments.reduce<Record<string, Comment[]>>((acc, comment) => {
    if (comment.parent) {
      const parentIdStr = String(comment.parent);
      if (!acc[parentIdStr]) acc[parentIdStr] = [];
      acc[parentIdStr].push(comment);
    }
    return acc;
  }, {});

  return (
    <section className="mt-20 pt-10 border-t border-stone-300">
      {/* Editorial Header */}
      <div className="mb-8 pb-4 border-b border-stone-300 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">
            Reflections{" "}
            <span className="text-stone-500 font-sans font-normal text-lg sm:text-xl">
              ({allComments.length})
            </span>
          </h3>
          <p className="text-stone-600 text-sm mt-1 font-medium">
            Join the conversation with your thoughts, prayer intentions, or insights.
          </p>
        </div>
      </div>

      {/* High-Contrast Form Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-10">
        <h4 className="font-serif text-xl font-bold text-stone-950 mb-1">
          Leave a Reflection
        </h4>
        <p className="text-xs text-stone-500 mb-6">
          Your email address will not be published. Required fields are marked *
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                Your Name <span className="text-brand-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Maria Okonkwo"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-950 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
                Email Address <span className="text-brand-primary">*</span>
              </label>
              <input
                type="email"
                placeholder="Kept private — not displayed"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-950 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-1.5">
              Your Reflection <span className="text-brand-primary">*</span>
            </label>
            <textarea
              placeholder="Reflect on this reading or message, or share your prayer intention..."
              required
              rows={4}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg text-sm text-stone-950 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors resize-none leading-relaxed"
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                  : "bg-red-50 text-red-900 border border-red-300"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-700 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500 text-center sm:text-left">
              Comments appear once approved by the editorial team.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 bg-stone-950 hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Reflection</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Discussion List: Solid High-Contrast White Cards */}
      {rootComments.length > 0 ? (
        <div className="space-y-4">
          {rootComments.map((comment) => {
            const replies = repliesByParentId[comment._id] || [];
            const hasReplies = replies.length > 0;
            const isThreadExpanded = expandedThreads[comment._id] !== false;
            const isReplyingToThis = activeReplyId === comment._id;
            const userLiked = userReactions[comment._id] || [];
            const initials = getInitials(comment.name);

            return (
              <article
                key={comment._id}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Author Info */}
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 select-none shadow-xs">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-base text-stone-950 leading-snug">
                        {comment.name}
                      </span>
                      <span className="text-xs text-stone-500 font-medium shrink-0">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* High Contrast Comment Text */}
                <div className="text-stone-900 text-[15.5px] leading-relaxed whitespace-pre-wrap font-normal">
                  {comment.comment}
                </div>

                {/* Actions & Reactions Bar */}
                <div className="pt-4 flex items-center gap-2 flex-wrap border-t border-stone-100 mt-4">
                  {/* Reaction Badges */}
                  {comment.reactions &&
                    Object.entries(comment.reactions).map(([emoji, count]) => {
                      if (count <= 0) return null;
                      const active = userLiked.includes(emoji);
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleToggleReaction(comment._id, emoji)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                            active
                              ? "bg-red-50 border-brand-primary text-brand-primary"
                              : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-900"
                          }`}
                          title={`${count} ${emoji}`}
                        >
                          <span className="text-sm leading-none">{emoji}</span>
                          <span>{count}</span>
                        </button>
                      );
                    })}

                  {/* React Button & Popover */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setPickerOpenCommentId(
                          pickerOpenCommentId === comment._id ? null : comment._id
                        )
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      title="React to this reflection"
                    >
                      <Smile className="w-3.5 h-3.5 text-amber-600" />
                      <span>React</span>
                    </button>

                    {pickerOpenCommentId === comment._id && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setPickerOpenCommentId(null)}
                        />
                        <div className="absolute left-0 mt-2 z-40 flex items-center gap-1 p-1.5 bg-white border border-stone-300 rounded-xl shadow-xl">
                          {AVAILABLE_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(comment._id, emoji)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-transform hover:scale-125 text-base cursor-pointer"
                              title={`React ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Reply Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReplyId(isReplyingToThis ? null : comment._id);
                      setReplyMessage(null);
                    }}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      isReplyingToThis
                        ? "bg-brand-primary text-white"
                        : "text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200"
                    }`}
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Inline Reply Form */}
                {isReplyingToThis && (
                  <div className="mt-4 p-5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-stone-900">
                        Replying to {comment.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveReplyId(null)}
                        className="text-stone-500 hover:text-stone-900 p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => handleReplySubmit(comment._id, e)}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Your Name *"
                          required
                          value={replyData.name}
                          onChange={(e) =>
                            setReplyData({ ...replyData, name: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-950 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                        />
                        <input
                          type="email"
                          placeholder="Your Email (private) *"
                          required
                          value={replyData.email}
                          onChange={(e) =>
                            setReplyData({ ...replyData, email: e.target.value })
                          }
                          className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-950 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                        />
                      </div>
                      <textarea
                        placeholder={`Write your reply to ${comment.name}...`}
                        required
                        rows={3}
                        value={replyData.comment}
                        onChange={(e) =>
                          setReplyData({ ...replyData, comment: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-950 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-none leading-relaxed"
                      />

                      {replyMessage && (
                        <div
                          className={`p-3 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                            replyMessage.type === "success"
                              ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                              : "bg-red-50 text-red-900 border border-red-300"
                          }`}
                        >
                          {replyMessage.type === "success" && <Check className="w-3.5 h-3.5 shrink-0 text-emerald-700" />}
                          <span>{replyMessage.text}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="px-3.5 py-1.5 text-xs text-stone-600 hover:text-stone-950 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReply}
                          className="px-5 py-1.5 bg-stone-950 hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isSubmittingReply ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Posting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3" />
                              <span>Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Thread Collapse / Expand Toggle */}
                {hasReplies && (
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => toggleThread(comment._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 cursor-pointer"
                    >
                      {isThreadExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5 text-stone-500" />
                          <span>Hide {replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                          <span>View {replies.length} {replies.length === 1 ? "reply" : "replies"}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Threaded Nested Replies */}
                {hasReplies && isThreadExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-100 space-y-3 pl-4 sm:pl-6 border-l-2 border-stone-200">
                    {replies.map((reply) => {
                      const replyUserLiked = userReactions[reply._id] || [];
                      const replyInitials = getInitials(reply.name);

                      return (
                        <div
                          key={reply._id}
                          className="bg-stone-50/80 rounded-xl p-4 sm:p-5 border border-stone-200/80 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-stone-800 text-white font-serif font-bold text-[10px] flex items-center justify-center shrink-0 select-none">
                                {replyInitials}
                              </div>
                              <span className="font-bold text-sm text-stone-950">
                                {reply.name}
                              </span>
                            </div>
                            <span className="text-xs text-stone-500 font-medium">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>

                          <p className="text-stone-900 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                            {reply.comment}
                          </p>

                          {/* Reply Reactions Bar */}
                          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                            {reply.reactions &&
                              Object.entries(reply.reactions).map(([emoji, count]) => {
                                if (count <= 0) return null;
                                const active = replyUserLiked.includes(emoji);
                                return (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleToggleReaction(reply._id, emoji)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                                      active
                                        ? "bg-red-50 border-brand-primary text-brand-primary"
                                        : "bg-white hover:bg-stone-100 border-stone-200 text-stone-900"
                                    }`}
                                    title={`${count} ${emoji}`}
                                  >
                                    <span className="text-xs leading-none">{emoji}</span>
                                    <span>{count}</span>
                                  </button>
                                );
                              })}

                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setPickerOpenCommentId(
                                    pickerOpenCommentId === reply._id ? null : reply._id
                                  )
                                }
                                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-950 bg-white hover:bg-stone-100 border border-stone-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                                title="React"
                              >
                                <Smile className="w-3 h-3 text-amber-600" />
                                <span>React</span>
                              </button>

                              {pickerOpenCommentId === reply._id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setPickerOpenCommentId(null)}
                                  />
                                  <div className="absolute left-0 mt-1 z-40 flex items-center gap-1 p-1 bg-white border border-stone-300 rounded-lg shadow-lg">
                                    {AVAILABLE_EMOJIS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => handleToggleReaction(reply._id, emoji)}
                                        className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 transition-transform hover:scale-125 text-sm cursor-pointer"
                                        title={`React ${emoji}`}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        /* Refined Editorial Empty State */
        <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h5 className="font-serif font-bold text-stone-900 text-lg mb-1">
            No reflections yet
          </h5>
          <p className="text-stone-500 text-sm max-w-sm mx-auto">
            Be the first to share your thoughts, reflections, or prayer intentions.
          </p>
        </div>
      )}
    </section>
  );
}
