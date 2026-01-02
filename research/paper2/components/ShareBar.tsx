import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Link, Share2 } from 'lucide-react';

export const ShareBar = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = "The Hidden Watts of Attention";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        // Could add toast notification here
    };

    const shareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const shareLinkedin = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-full shadow-lg">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 mr-2 flex items-center gap-2">
                    <Share2 size={12} />
                    Share
                </span>

                <button onClick={shareTwitter} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400 transition-colors">
                    <Twitter size={16} />
                </button>

                <button onClick={shareLinkedin} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400 transition-colors">
                    <Linkedin size={16} />
                </button>

                <div className="w-px h-4 bg-stone-300 dark:bg-stone-700 mx-1"></div>

                <button onClick={copyToClipboard} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-600 dark:text-stone-400 transition-colors" title="Copy Link">
                    <Link size={16} />
                </button>
            </div>
        </motion.div>
    );
};
