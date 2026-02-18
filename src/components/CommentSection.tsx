"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getComments, addComment, MAX_COMMENT_LENGTH } from "@/lib/firestore";
import { useVisitorId } from "@/hooks/useVisitorId";
import { useVisitorName } from "@/hooks/useVisitorName";
import { NameModal } from "./NameModal";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  mediaId: string;
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function CommentSection({ mediaId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "error" | "rate_limit" | null>(null);

  const visitorId = useVisitorId();
  const { name, hasName, setVisitorName } = useVisitorName();

  useEffect(() => {
    getComments(mediaId).then(setComments).finally(() => setLoading(false));
  }, [mediaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || !visitorId) return;
    if (!hasName) {
      setShowNameModal(true);
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const id = await addComment(mediaId, visitorId, name!, trimmed);
      if (id && id !== "rate_limit") {
        setComments((prev) => [
          {
            id,
            mediaId,
            visitorId,
            authorName: name!,
            content: trimmed,
            createdAt: new Date(),
            isApproved: true,
          },
          ...prev,
        ]);
        setContent("");
        setFeedback("success");
      } else if (id === "rate_limit") {
        setFeedback("rate_limit");
      } else {
        setFeedback("error");
      }
    } catch {
      setFeedback("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-serif text-lg text-stone-800 mb-3">Commentaires</h4>

      {loading ? (
        <p className="text-stone-500 text-sm">Chargement...</p>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.length === 0 ? (
            <p className="text-stone-500 text-sm italic">Aucun commentaire pour le moment.</p>
          ) : (
            comments.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-champagne-100/50 rounded-lg p-3"
              >
                <p className="font-medium text-stone-800 text-sm">{c.authorName}</p>
                <p className="text-stone-600 text-sm mt-1">{c.content}</p>
                <p className="text-stone-400 text-xs mt-2">{formatDate(c.createdAt)}</p>
              </motion.div>
            ))
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
          placeholder={hasName ? "Ajouter un commentaire..." : "Cliquez pour entrer votre prénom"}
          maxLength={MAX_COMMENT_LENGTH}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-champagne-300 bg-white focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none resize-none text-sm"
          onClick={() => !hasName && setShowNameModal(true)}
        />
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
          <span className="text-xs text-stone-400 order-2 sm:order-1">
            {content.length}/{MAX_COMMENT_LENGTH}
          </span>
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="px-4 py-2.5 sm:py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium touch-manipulation min-h-[44px] order-1 sm:order-2"
          >
            {submitting ? "Envoi..." : "Publier"}
          </button>
        </div>
      </form>

      {feedback === "success" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 text-sm mt-2"
        >
          Merci pour votre commentaire !
        </motion.p>
      )}
      {feedback === "rate_limit" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-600 text-sm mt-2"
        >
          Veuillez patienter une minute avant d&apos;ajouter un autre commentaire.
        </motion.p>
      )}
      {feedback === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm mt-2"
        >
          Impossible d&apos;ajouter le commentaire. Vérifiez votre connexion et réessayez.
        </motion.p>
      )}

      <NameModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSave={(n) => {
          setVisitorName(n);
          setShowNameModal(false);
        }}
      />
    </div>
  );
}
