"use client";

import { useState } from "react";
import { User, Send, Loader2 } from "lucide-react";
//

interface Comment {
  _id?: string;
  name: string;
  comment: string;
  _createdAt: string;
}

interface CommentsProps {
  postId: string;
  comments: Comment[];
}

export default function Comments({ postId, comments = [] }: CommentsProps) {
  const [formData, setFormData] = useState({ name: "", email: "", comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({ ...formData, _id: postId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit comment");

      setMessage({ text: "Comment submitted! It will appear after approval.", type: "success" });
      setFormData({ name: "", email: "", comment: "" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 max-w-2xl mx-auto">
      <h3 className="text-3xl font-serif font-bold mb-8 text-foreground">
        Join the Conversation
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-xl shadow-lg  mb-12">
        <h4 className="text-xl font-semibold mb-4">Leave a Reply</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
            <input
              type="email"
              placeholder="Your Email (will not be published)"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
          <textarea
            placeholder="Your Comment..."
            required
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none"
          />
          
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className=" bg-blue-300 px-4 py-2 rounded-lg text-black cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Existing Comments */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          <h4 className="text-xl font-semibold mb-4">{comments.length} Comments</h4>
          {comments.map((comment, index) => (
            <div key={comment._id || index} className="flex gap-4 p-6 bg-surface/50 rounded-xl border border-border ">
              <div className="w-10 h-10 rounded-full bg-amber-300/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-semibold text-lg">{comment.name}</span>
                  <span className="text-xs text-muted-foreground uppercase opacity-70">
                    {new Date(comment._createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-foreground/80 leading-relaxed text-sm md:text-base">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center italic py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </section>
  );
}
