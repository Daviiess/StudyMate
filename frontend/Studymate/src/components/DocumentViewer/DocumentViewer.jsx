import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './DocumentViewer.scss';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const DocumentViewer = ({ pdfUrl, aiConcept }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'ArrowLeft') {
        setPageNumber(prev => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        setPageNumber(prev => (numPages && prev < numPages ? prev + 1 : prev));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages]);

  return (
    <div className="doc-viewer">
      <div className='doc-viewer__header'>
        <span>Document Viewer</span>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={18} /> Open in new tab
        </a>
      </div>

      <div className='doc-viewer__holder'>
        <div className="doc-viewer__toolbar">
         
          <div className="doc-viewer__pill">
            <button 
              disabled={pageNumber <= 1} 
              onClick={() => setPageNumber(prev => prev - 1)}
              className='doc-viewer__icon-btn'
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="doc-viewer__page-selector">
              <input 
                type="number" 
                value={pageNumber}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= numPages) setPageNumber(val);
                }}
                className="doc-viewer__page-input"
              />
              <span className="doc-viewer__page-total">of {numPages || '--'}</span>
            </div>

            <button 
              disabled={pageNumber >= numPages} 
              onClick={() => setPageNumber(prev => prev + 1)}
              className='doc-viewer__icon-btn'
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Zoom Group */}
          <div className="doc-viewer__pill">
            <button 
              onClick={() => setScale(prev => Math.max(prev - 0.25, 0.5))}
              className="doc-viewer__icon-btn"
              disabled={scale <= 0.5} 
            >
              <ZoomOut size={18} />
            </button>
            
            <span className="doc-viewer__zoom-text">{Math.round(scale * 100)}%</span>
            
            <button 
              onClick={() => setScale(prev => Math.min(prev + 0.25, 2.0))} 
              className="doc-viewer__icon-btn"
              disabled={scale >= 2.0} 
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="doc-viewer__canvas-container">
        <Document
          file={pdfUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="doc-viewer__loading">Loading PDF...</div>}
          error={<div className="doc-viewer__error">Failed to load PDF.</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={true} 
            renderAnnotationLayer={true} 
            className="doc-viewer__pdf-page"
          />
        </Document>
      </div>
    </div>
  );
};

export default DocumentViewer;