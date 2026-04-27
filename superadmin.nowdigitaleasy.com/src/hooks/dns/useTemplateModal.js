import { useState, useCallback } from "react";
 
export function useTemplateModal() {
  const [state, setState] = useState({ isOpen: false, data: null });
 
  const open = useCallback((data = null) => {
    setState({ isOpen: true, data });
  }, []);
 
  const close = useCallback(() => {
    setState({ isOpen: false, data: null });
  }, []);
 
  return {
    isOpen: state.isOpen,
    data:   state.data,
    open,
    close,
  };
}