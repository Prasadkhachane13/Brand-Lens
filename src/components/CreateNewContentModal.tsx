import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, AlertCircle, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { useBrandLens } from '../lib/store';

interface CreateNewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNewContentModal: React.FC<CreateNewContentModalProps> = ({ isOpen, onClose }) => {
  // Use `as any` to bypass the TypeScript error if your store uses a different name
  const { createContent } = useBrandLens() as any; 
  
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('BLOG');
  const [format, setFormat] = useState('TEXT');
  const [rawContent, setRawContent] = useState('');
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFindings, setImageFindings] = useState<any[]>([]); // Store findings from upload
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle between Local File and URL input
  const [inputMode, setInputMode] = useState<'FILE' | 'URL'>('FILE');
  const [manualUrl, setManualUrl] = useState('');

  if (!isOpen) return null;

  // 1. Handle Local File Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setIsAnalyzingImage(true);
    setUploadError(null);
    setImageFindings([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        if (data.findings && data.findings.length > 0) {
          setImageFindings(data.findings);
        }
      } else {
        setUploadError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      setUploadError('Network error during upload');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // 2. Handle URL Analysis
  const handleAnalyzeUrl = async () => {
    if (!manualUrl.trim()) return;
    setIsAnalyzingImage(true);
    setUploadError(null);
    setImageUrl(''); 
    setImageFindings([]);

    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: manualUrl.trim() }),
      });
      
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        setImageFile(null);
        if (data.findings && data.findings.length > 0) {
          setImageFindings(data.findings);
        }
      } else {
        setUploadError(data.error || 'Failed to analyze URL');
      }
    } catch (err) {
      console.error(err);
      setUploadError('Network error while analyzing URL');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl('');
    setManualUrl('');
    setImageFindings([]);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Pass the verified URL AND the findings to the store
    createContent({
      title,
      channel,
      format,
      rawContent,
      mediaUrl: imageUrl || undefined,
      imageFindings: imageFindings, // <-- This ensures the visual blockers are saved!
    });

    // Reset form
    setTitle('');
    setChannel('BLOG');
    setFormat('TEXT');
    setRawContent('');
    handleRemoveImage();
    onClose();
  };

  const loadTestDraft = () => {
    setTitle('Q4 EcoMode Launch Press Release');
    setFormat('TEXT');
    setRawContent(
      "Northwind Home is proud to announce our best-in-class EcoMode Smart Thermostat. It is guaranteed to reduce your energy bills by 100% and is the #1 smart thermostat on the market. We are super excited to launch this cheap product for everyone!"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#131B2A] border border-[#1E293B] rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0E1524]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Create New Content Collateral</h2>
              <p className="text-[11px] text-slate-400">Add marketing copy, landing pages, or documents for pre-publication governance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <form id="create-content-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Document Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 EcoMode Launch Press Release"
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Channel & Format */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">Channel</label>
                <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                  <option value="BLOG">BLOG</option>
                  <option value="PRESS">PRESS</option>
                  <option value="SOCIAL">SOCIAL</option>
                  <option value="EMAIL">EMAIL</option>
                  <option value="LANDING">LANDING</option>
                  <option value="INTERNAL">INTERNAL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                  <option value="TEXT">TEXT</option>
                  <option value="MARKDOWN">MARKDOWN</option>
                  <option value="DOCX">DOCX</option>
                  <option value="PDF">PDF</option>
                  <option value="IMAGE">IMAGE</option>
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase text-slate-300">
                  Image Asset (For Visual Analysis)
                </label>
                
                {/* Toggle between File and URL */}
                <div className="flex items-center space-x-1 bg-[#0B111E] p-0.5 rounded border border-[#1E293B]">
                  <button type="button" onClick={() => setInputMode('FILE')} className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${inputMode === 'FILE' ? 'bg-[#1E293B] text-white' : 'text-slate-400 hover:text-slate-200'}`}>Local File</button>
                  <button type="button" onClick={() => setInputMode('URL')} className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${inputMode === 'URL' ? 'bg-[#1E293B] text-white' : 'text-slate-400 hover:text-slate-200'}`}>Via URL</button>
                </div>
              </div>
              
              <input type="file" accept="image/png, image/jpeg, image/webp" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

              {/* If no image is uploaded yet */}
              {!imageUrl ? (
                inputMode === 'FILE' ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isAnalyzingImage ? 'border-blue-500/50 bg-blue-900/10' : 'border-[#1E293B] hover:border-blue-500/50 bg-[#0B111E]'
                    }`}
                  >
                    {isAnalyzingImage ? (
                      <>
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="text-xs text-blue-400 font-mono">Analyzing image hashes...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-300 font-medium">Click to upload image from system</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, or WEBP</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      className="flex-1 bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAnalyzeUrl}
                      disabled={!manualUrl.trim() || isAnalyzingImage}
                      className="px-3 py-2 bg-[#1E293B] hover:bg-[#2E3F5B] text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                    >
                      {isAnalyzingImage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LinkIcon className="w-3.5 h-3.5" />}
                      <span>Analyze</span>
                    </button>
                  </div>
                )
              ) : (
                /* If image has been analyzed successfully (File or URL) */
                <div className="flex items-center justify-between bg-[#0B111E] border border-emerald-900/50 rounded-lg p-2.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-[#131B2A] border border-[#1E293B] overflow-hidden flex items-center justify-center">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setUploadError('Image failed to render (CORS or invalid URL)')} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Uploaded & Hashed</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate max-w-50">
                        {imageFile ? imageFile.name : manualUrl}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveImage} className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer px-2 py-1">
                    Remove
                  </button>
                </div>
              )}
              
              {uploadError && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{uploadError}</span>
                </p>
              )}
            </div>

            {/* Raw Content Text */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase text-slate-300">Raw Content Text / Copy</label>
                <button type="button" onClick={loadTestDraft} className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer">Load test sample draft</button>
              </div>
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                rows={5}
                placeholder="Paste or write content here..."
                className="w-full bg-[#0B111E] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#0E1524] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Pre-analyzed locally against 7 brand criteria.</span>
          <div className="flex items-center space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer">Cancel</button>
            <button type="submit" form="create-content-form" disabled={!title.trim() || isAnalyzingImage} className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer ${!title.trim() || isAnalyzingImage ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Initialize & Analyze</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};