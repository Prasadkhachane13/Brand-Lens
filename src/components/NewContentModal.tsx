import React, { useState } from 'react';
import { X, Plus, Sparkles, FileText, Image, FileCode, Send } from 'lucide-react';
import { useBrandLens } from '../lib/store';
import { ContentChannel, ContentFormat } from '../lib/types';

interface NewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewContentModal: React.FC<NewContentModalProps> = ({ isOpen, onClose }) => {
  const { createNewContentItem } = useBrandLens();

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<ContentChannel>('PRESS');
  const [format, setFormat] = useState<ContentFormat>('TEXT');
  const [rawContent, setRawContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawContent.trim()) return;

    createNewContentItem({
      title: title.trim(),
      channel,
      format,
      rawContent: rawContent.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
    });

    onClose();
    setTitle('');
    setRawContent('');
    setMediaUrl('');
  };

  const loadSampleDraft = () => {
    setTitle('Fall Campaign Email: Revolutionary Savings');
    setChannel('EMAIL');
    setFormat('TEXT');
    setRawContent(
      'NW Home is thrilled to present the #1 best-in-class home thermal hub! Guaranteed to cut your power bill by 60%. Please click here to order your unit before stock runs out.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-[#131B2A] border border-[#1E293B] rounded-2xl shadow-2xl max-w-xl w-full p-6 z-10 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Create New Content Collateral</h3>
              <p className="text-xs text-slate-400">Add marketing copy, landing pages, or documents for pre-publication governance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Document Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 EcoMode Launch Press Release"
              required
              className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as ContentChannel)}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="PRESS">PRESS</option>
                <option value="BLOG">BLOG</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="LANDING">LANDING</option>
                <option value="SOCIAL">SOCIAL</option>
                <option value="EMAIL">EMAIL</option>
                <option value="SUPPORT">SUPPORT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ContentFormat)}
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="TEXT">TEXT</option>
                <option value="MARKDOWN">MARKDOWN</option>
                <option value="DOCX">DOCX</option>
                <option value="PDF">PDF</option>
                <option value="IMAGE">IMAGE</option>
              </select>
            </div>
          </div>

          {format === 'IMAGE' && (
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Image Asset URL (for visual analysis)</label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... or /assets/..."
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600 font-mono"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase text-slate-400">Raw Content Text / Copy</label>
              <button
                type="button"
                onClick={loadSampleDraft}
                className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Load test sample draft
              </button>
            </div>
            <textarea
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              rows={5}
              placeholder="Paste or write content here..."
              required
              className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500 placeholder-slate-600 font-sans"
            />
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Pre-analyzed locally against 7 brand criteria.
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Initialize & Analyze</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
