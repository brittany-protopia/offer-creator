
import React, { useState, useEffect } from 'react';
import { ProposalData, defaultProposal } from './types';
import { ProposalEditor } from './components/ProposalEditor';
import { ProposalView } from './components/ProposalView';
import { Button } from './components/ui/button';
import { PanelLeftClose, PanelLeftOpen, Printer, Share2, Copy } from 'lucide-react';
import { cn } from '../lib/utils';
import { Toaster, toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import '../styles/fonts.css';

export default function App() {
  const [data, setData] = useState<ProposalData>(defaultProposal);
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  // New state for custom base URL support
  const [baseUrl, setBaseUrl] = useState('');
  const [encodedData, setEncodedData] = useState('');

  // Migration effect: Ensure valueBullets exists if it's missing from current state
  // This handles hot-reloading or existing state sessions
  useEffect(() => {
    if (!data.valueBullets) {
      setData(prev => ({
        ...prev,
        valueBullets: defaultProposal.valueBullets
      }));
    }
  }, [data.valueBullets]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Check for host_url param (passed from embedding site)
    const hostUrlParam = params.get('host_url');
    if (hostUrlParam) {
      setBaseUrl(hostUrlParam);
    } else {
      setBaseUrl(`${window.location.origin}${window.location.pathname}`);
    }

    const sharedData = params.get('data');
    if (sharedData) {
      try {
        // Decode Base64 with Unicode support
        const json = decodeURIComponent(Array.prototype.map.call(atob(sharedData), 
          (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        
        const parsed = JSON.parse(json);
        
        // Revive Date objects
        parsed.effectiveDate = new Date(parsed.effectiveDate);
        parsed.milestones = parsed.milestones.map((m: any) => ({
           ...m,
           date: new Date(m.date)
        }));
        
        // Merge with default proposal to ensure new fields (like valueBullets) are present
        // even if loading from an older link
        setData({
            ...defaultProposal,
            ...parsed
        });
        toast.success('Proposal loaded from shared link');
      } catch (e) {
        console.error("Failed to parse shared data", e);
        toast.error('Failed to load proposal from link');
      }
    }
  }, []);

  // Update shareUrl whenever baseUrl or encodedData changes
  useEffect(() => {
    if (encodedData && baseUrl) {
        // Remove trailing slash if present to avoid double slashes, but careful with root path
        const cleanBase = baseUrl.endsWith('/') && baseUrl.length > 1 ? baseUrl.slice(0, -1) : baseUrl;
        setShareUrl(`${cleanBase}?data=${encodedData}`);
    }
  }, [baseUrl, encodedData]);

  const toggleEditor = () => setIsEditorOpen(!isEditorOpen);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      const json = JSON.stringify(data);
      // Encode Base64 with Unicode support
      const encoded = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(_match, p1) {
              return String.fromCharCode(parseInt(p1, 16));
      }));
      
      setEncodedData(encoded);
      
      // Use current baseUrl if available, otherwise fallback to location
      const currentBaseUrl = baseUrl || `${window.location.origin}${window.location.pathname}`;
      const url = `${currentBaseUrl}?data=${encoded}`;
      setShareUrl(url);

      // Try to copy to clipboard automatically
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Share link copied to clipboard');
      } catch (clipboardError) {
        // If clipboard fails (e.g. permissions), open the dialog
        setIsShareDialogOpen(true);
      }
      
      // Always open dialog to allow URL customization
      setIsShareDialogOpen(true);
      
    } catch (e) {
      toast.error('Failed to generate link');
    }
  };

  const copyFromDialog = () => {
    try {
      // Fallback for manual copy button in dialog
      const input = document.getElementById('share-url-input') as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand('copy'); // Legacy fallback
        toast.success('Copied to clipboard');
        navigator.clipboard.writeText(shareUrl).catch(() => {}); // Try modern API too
      }
    } catch (e) {
      toast.error('Please copy the link manually');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Toaster position="top-center" />
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Proposal</DialogTitle>
            <DialogDescription>
              Copy the link below to share this proposal configuration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="base-url-input" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Hosting URL (WordPress / HubSpot)
                </Label>
                <Input 
                    id="base-url-input"
                    value={baseUrl} 
                    onChange={(e) => setBaseUrl(e.target.value)} 
                    placeholder="https://your-site.com/proposal"
                    className="bg-gray-50 border-gray-200"
                />
                <p className="text-[11px] text-gray-400 leading-tight">
                    Edit this URL to match the page where you are hosting this tool.
                </p>
              </div>

              <div className="flex items-end space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="share-url-input" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Generated Link
                  </Label>
                  <Input
                    id="share-url-input"
                    value={shareUrl}
                    readOnly
                    className="w-full font-mono text-xs bg-gray-50 text-gray-600"
                  />
                </div>
                <Button type="button" size="icon" className="shrink-0 bg-[#3D3DF5] hover:bg-[#2b2bb8]" onClick={copyFromDialog}>
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Editor Sidebar */}
      <div 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative z-20 flex-shrink-0 print:hidden",
          isEditorOpen ? "w-[400px] translate-x-0" : "w-0 -translate-x-full opacity-0"
        )}
      >
        <div className="h-full overflow-hidden w-[400px]">
           <ProposalEditor data={data} onUpdate={setData} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {/* Floating Controls */}
        <div className="fixed top-4 left-4 z-50 flex gap-2 print:hidden">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleEditor}
            className="bg-white shadow-md border-gray-200 hover:bg-gray-50"
            title={isEditorOpen ? "Close Editor" : "Open Editor"}
          >
            {isEditorOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="bg-white shadow-md border-gray-200 hover:bg-gray-50 gap-2"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleShare}
            className="bg-white shadow-md border-gray-200 hover:bg-gray-50 gap-2 text-[#3D3DF5] border-[#3D3DF5]/20 hover:bg-[#3D3DF5]/5"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share Link</span>
          </Button>
        </div>

        {/* Preview */}
        <div className="min-h-full">
          <ProposalView data={data} />
        </div>
      </div>
    </div>
  );
}
