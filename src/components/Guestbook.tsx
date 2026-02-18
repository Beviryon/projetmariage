"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getGuestbookEntries, addGuestbookEntry } from "@/lib/firestore";
import { useVisitorId } from "@/hooks/useVisitorId";
import { useVisitorName } from "@/hooks/useVisitorName";
import { NameModal } from "./NameModal";
import type { GuestbookEntry as GuestbookEntryType } from "@/lib/types";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntryType[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);

  const visitorId = useVisitorId();
  const { name, hasName, setVisitorName } = useVisitorName();

  useEffect(() => {
    getGuestbookEntries().then(setEntries).finally(() => setLoading(false));
  }, []);

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
      const id = await addGuestbookEntry(visitorId, name!, trimmed);
      if (id) {
        setEntries((prev) => [
          {
            id,
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
    <section id="livre-or" className="py-10 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-3 sm:px-6">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-serif text-3xl sm:text-4xl text-stone-800 text-center mb-8 sm:mb-12"
      >
        Livre d&apos;or
      </motion.h2>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8 sm:mb-12">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 1000))}
            placeholder={hasName ? "Laissez-nous un message..." : "Cliquez pour entrer votre prénom"}
            maxLength={1000}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-champagne-300 bg-white focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none resize-none text-base min-h-[100px] touch-manipulation"
            onClick={() => !hasName && setShowNameModal(true)}
          />
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mt-2">
            <span className="text-xs text-stone-400 order-2 sm:order-1">{content.length}/1000</span>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-6 py-3 sm:py-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium touch-manipulation min-h-[44px] order-1 sm:order-2"
            >
              {submitting ? "Envoi..." : "Publier"}
            </button>
          </div>
        </form>

        {feedback === "success" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 mb-6"
          >
            Merci pour votre message !
          </motion.p>
        )}
        {feedback === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-6"
          >
            Impossible d&apos;ajouter le message.
          </motion.p>
        )}

        {loading ? (
          <p className="text-stone-500 text-center py-8">Chargement...</p>
        ) : (
          <div className="space-y-6">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-champagne-100/50 rounded-xl p-4 sm:p-6 border border-champagne-200"
              >
                <p className="text-stone-800 leading-relaxed">{entry.content}</p>
                <p className="text-primary-600 font-medium mt-3">{entry.authorName}</p>
                <p className="text-stone-400 text-sm mt-1">{formatDate(entry.createdAt)}</p>
              </motion.div>
            ))}
            {entries.length === 0 && (
              <p className="text-stone-500 text-center py-8 italic">
                Soyez le premier à nous laisser un message !
              </p>
            )}
          </div>
        )}
      </div>

      <NameModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSave={(n) => {
          setVisitorName(n);
          setShowNameModal(false);
        }}
      />
    </section>
  );
}
