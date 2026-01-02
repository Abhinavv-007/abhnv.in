import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookReaderProps {
    chapters: any[];
}

export const BookReader = ({ chapters }: BookReaderProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

    const nextPage = () => {
        if (currentPage < chapters.length - 1) {
            setDirection(1);
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setDirection(-1);
            setCurrentPage(prev => prev - 1);
        }
    };

    // 3D Book flip animation variants
    const pageVariants = {
        enter: (dir: number) => ({
            rotateY: dir > 0 ? 90 : -90,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (dir: number) => ({
            rotateY: dir > 0 ? -90 : 90,
            opacity: 0,
            scale: 0.95,
        }),
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-center p-4" style={{ perspective: '1200px' }}>
            {/* Page Content */}
            <div className="relative w-full aspect-[3/4] md:aspect-[4/3] bg-white dark:bg-stone-900 shadow-2xl rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800" style={{ transformStyle: 'preserve-3d' }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentPage}
                        custom={direction}
                        variants={pageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1], // Custom ease for "paper" feel
                        }}
                        className="absolute inset-0 p-8 md:p-16 overflow-y-auto bg-stone-50 dark:bg-stone-900 shadow-[inset_20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-none"
                        style={{
                            transformStyle: 'preserve-3d',
                            transformOrigin: direction > 0 ? 'left center' : 'right center',
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        <div className="max-w-prose mx-auto">
                            <span className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-2 block">
                                Chapter {currentPage + 1} / {chapters.length}
                            </span>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
                                {chapters[currentPage].title}
                            </h2>
                            <h3 className="text-xl font-serif italic text-stone-600 dark:text-stone-400 mb-8">
                                {chapters[currentPage].subtitle}
                            </h3>

                            <div className="prose dark:prose-invert prose-stone leading-relaxed">
                                {chapters[currentPage].content.map((block: any, idx: number) => (
                                    <React.Fragment key={idx}>
                                        {typeof block === 'string' ? (
                                            <p className="mb-4">{block}</p>
                                        ) : (
                                            <div className="my-6">{block}</div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {chapters[currentPage].diagram && (
                                <div className="my-8 flex justify-center">
                                    {chapters[currentPage].diagram}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Page number footer */}
                <div className="absolute bottom-4 right-8 text-xs font-mono text-stone-400 select-none z-10">
                    {currentPage + 1}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mt-8">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-800 dark:text-stone-200"
                >
                    <ChevronLeft size={24} />
                </motion.button>

                <div className="font-mono text-sm text-stone-500">
                    {currentPage + 1} of {chapters.length}
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextPage}
                    disabled={currentPage === chapters.length - 1}
                    className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-stone-800 dark:text-stone-200"
                >
                    <ChevronRight size={24} />
                </motion.button>
            </div>
        </div>
    );
};
