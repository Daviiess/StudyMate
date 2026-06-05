import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // typically react-router-dom
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import aiService from '../../services/aiService';
import StudyCard from '../common/StudyCard/StudyCard.jsx';
import './SummaryAction.scss';

// Robust parsing function that extracts JSON even if the AI adds conversational text
const parseSummary = (raw) => {
    if (!raw) return null;
    
    // If it's already a JS object, return it directly
    if (typeof raw === 'object' && !raw.summary) return raw;
    
    // Handle cases where the API wraps the response in { summary: "..." }
    const stringToParse = typeof raw === 'object' ? raw.summary : raw;
    if (!stringToParse) return null;

    try {
        // Extract everything between the first { and last }
        const match = stringToParse.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        return JSON.parse(stringToParse);
    } catch (error) {
        console.error("Failed to parse AI summary", error);
        return null;
    }
};

const SummaryAction = ({ toggleSummary }) => {
    const { id: documentId } = useParams();
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setIsLoading] = useState(true); // Start true to prevent crashing on initial render

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            try {
                const response = await aiService.generateSummary(documentId);
                const parsed = parseSummary(response);
                
                if (!parsed) {
                    throw new Error("Could not read the summary format.");
                }
                
                setSummaryData(parsed);
            } catch (error) {
                toast.error(error.message || 'Failed to generate summary.');
            } finally {
                setIsLoading(false);
            }
        };

        if (documentId) {
            fetchSummary();
        }
    }, [documentId]);
console.log('summary: ', summaryData);
    return (
        <div className='summary-action'>
            <div className='summary-action__overlay'>
                <div className='summary-action__header'>
                    
                    <h3 className='summary-action__title'>
                        {summaryData?.title || 'Document Summary'}
                    </h3>
                    <div className='summary-action__divider' />
                </div>
                
                <div className='summary-action__body'>
                    {loading ? (
                        <div className='summary-action__loading'> 
                            <span>Generating summary...</span>
                            <div className='loading-chat__animation' style={{ margin: 0 }}>
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    ) : summaryData ? (
                        // Pass the parsed object directly
                        <StudyCard data={summaryData}/> 
                    ) : (
                        <div className='summary-action__error' style={{ padding: '2rem', textAlign: 'center' }}>
                            <p>Failed to load summary content.</p>
                        </div>
                    )}
                </div>
                
                <button className='summary-action__cancel-btn' onClick={toggleSummary}>
                    <X/>
                </button>
            </div>
        </div>
    );
};

export default SummaryAction;