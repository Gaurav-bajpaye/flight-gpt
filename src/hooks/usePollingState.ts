import { useState, useEffect, useCallback } from 'react';
import { PollingState } from '../types';

interface UsePollingStateOptions {
  pollingInterval?: number;
  maxPolls?: number;
}

export const usePollingState = <T>(
  asyncFn: () => Promise<T>,
  options: UsePollingStateOptions = {}
): [PollingState<T>, () => void] => {
  const { pollingInterval = 1000, maxPolls = 30 } = options;
  
  const [state, setState] = useState<PollingState<T>>({
    data: null,
    isLoading: false,
    error: null,
    isPending: false,
  });
  
  const [pollCount, setPollCount] = useState(0);
  const [shouldPoll, setShouldPoll] = useState(false);
  
  const startPolling = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, isPending: true, error: null }));
    setShouldPoll(true);
    setPollCount(0);
  }, []);
  
  useEffect(() => {
    if (!shouldPoll) return;
    
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout;
    
    const poll = async () => {
      try {
        if (pollCount >= maxPolls) {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            isPending: false,
            error: new Error('Polling timeout reached')
          }));
          setShouldPoll(false);
          return;
        }
        
        const result = await asyncFn();
        
        setState(prev => ({ 
          ...prev, 
          data: result, 
          isLoading: false,
          isPending: false
        }));
        
        setShouldPoll(false);
      } catch (error) {
        if (pollCount < maxPolls) {
          setPollCount(prev => prev + 1);
          timeoutId = setTimeout(poll, pollingInterval);
        } else {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            isPending: false,
            error: error instanceof Error ? error : new Error('Unknown error occurred')
          }));
          setShouldPoll(false);
        }
      }
    };
    
    poll();
    
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [asyncFn, shouldPoll, pollCount, pollingInterval, maxPolls]);
  
  return [state, startPolling];
}; 