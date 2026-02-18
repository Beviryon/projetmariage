"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getThumbnailUrl, getCloudinaryUrl } from "@/lib/cloudinary";

export interface TimelineStep {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
  video?: string;
  moment?: "compagnons" | "preparatifs" | "ceremonie" | "soiree";
}

interface TimelineProps {
  steps: TimelineStep[];
}

export function Timeline({ steps }: TimelineProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-champagne-300 -translate-x-px" />

      <div className="space-y-8 sm:space-y-12">
        {steps.map((step, i) => (
          <motion.article
            key={step.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`relative flex flex-col md:flex-row items-center gap-4 sm:gap-8 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1 w-full min-w-0 md:max-w-[45%] order-2 md:order-1">
              <div
                className={`ml-11 sm:ml-16 md:ml-0 pl-2 ${
                  i % 2 === 1 ? "md:mr-8 md:text-right" : "md:mr-8"
                }`}
              >
                <span className="text-rose-400 font-serif text-xs sm:text-sm">{step.date}</span>
                <h3 className="font-serif text-lg sm:text-2xl text-stone-800 mt-1">{step.title}</h3>
                <p className="text-stone-600 mt-2 sm:mt-3 leading-relaxed text-sm sm:text-base">{step.description}</p>
              </div>
            </div>

            <div
              className={`absolute left-4 sm:left-8 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-rose-400 border-2 sm:border-4 border-champagne-50 -translate-x-1/2 z-10 shrink-0 ${
                i % 2 === 1 ? "md:translate-x-1/2" : "md:-translate-x-1/2"
              }`}
            />

            <div
              className={`flex-1 w-full min-w-0 md:max-w-[45%] order-1 md:order-2 ${
                i % 2 === 1 ? "md:pr-8" : "md:pl-8"
              }`}
            >
              {step.image && (
                <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={getThumbnailUrl(step.image, "image")}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                </div>
              )}
              {step.video && !step.image && (
                <div className="relative aspect-video rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                  <video
                    src={getCloudinaryUrl(step.video, "video")}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
