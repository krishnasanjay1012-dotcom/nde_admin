/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useBlocker } from "react-router-dom";
import UnsavedChangesDrawer from "../components/common/NDE-UnsavedChanges";

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
  const location = useLocation();
  const [isDirty, setIsDirty] = useState(false);
  const isDirtyRef = useRef(isDirty);
  const [open, setOpen] = useState(false);

  const dirtyInputsRef = useRef(new Set());
  const manualDirtyRef = useRef(false);

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    setIsDirty(false);
    manualDirtyRef.current = false;
    dirtyInputsRef.current.clear();
    isSubmittingRef.current = false;
  }, [location.pathname]);

  const ignoredPaths = ["/login", "/signup"];

  useEffect(() => {
    const handleSubmit = () => {
      isSubmittingRef.current = true;
    };

    window.addEventListener("submit", handleSubmit);
    return () => window.removeEventListener("submit", handleSubmit);
  }, []);

  const checkNodeValidAndDirty = useCallback((node) => {
    if (!document.body.contains(node)) return false;

    // Multi-select custom attribute check
    if (node.dataset && node.dataset.multiValue === "dirty") return true;

    if (node.type === "radio" || node.type === "checkbox") {
      if (node.checked === node.defaultChecked) return false;
    } else {
      const val = node.isContentEditable ? node.innerText : node.value;
      if (!val || val.trim() === "") return false;
    }

    return true;
  }, []);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      // If we're submitting, don't block
      if (isSubmittingRef.current) return false;

      if (!isDirtyRef.current) return false;

      // Filter out invalid/hidden/empty nodes
      let hasAttachedDirtyInput = false;
      for (const node of dirtyInputsRef.current) {
        if (!checkNodeValidAndDirty(node)) {
          dirtyInputsRef.current.delete(node);
        } else {
          hasAttachedDirtyInput = true;
        }
      }

      if (!manualDirtyRef.current && !hasAttachedDirtyInput) {
        setTimeout(() => setIsDirty(false), 0);
        return false;
      }

      return (
        isDirtyRef.current &&
        currentLocation.pathname !== nextLocation.pathname &&
        !ignoredPaths.includes(currentLocation.pathname)
      );
    }
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setOpen(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    const dirtyInputs = dirtyInputsRef.current;

    const handleChange = (e) => {
      if (ignoredPaths.includes(location.pathname)) return;

      const target = e.target;
      if (!target || !target.tagName) return;

      const tag = target.tagName.toLowerCase();

      const isIgnored =
        target.getAttribute("data-no-dirty") === "true" ||
        target.type === "search" ||
        target.type === "hidden" ||
        target.classList.contains("no-dirty");

      if (isIgnored) return;

      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable
      ) {
        if (target.type === "radio" && target.name) {
          const radios = document.querySelectorAll(`input[type="radio"][name="${target.name}"]`);
          for (const r of radios) {
            if (r.checked !== r.defaultChecked) {
              dirtyInputs.add(r);
            } else {
              dirtyInputs.delete(r);
            }
          }
        } else if (target.type === "checkbox") {
          if (target.checked !== target.defaultChecked) {
            dirtyInputs.add(target);
          } else {
            dirtyInputs.delete(target);
          }
        } else {
          const value = target.isContentEditable ? target.innerText : target.value;
          if (value && value.trim() !== "") {
            dirtyInputs.add(target);
          } else {
            dirtyInputs.delete(target);
          }
        }

        // Clean up detached nodes
        for (const node of dirtyInputs) {
          if (!document.body.contains(node)) {
            dirtyInputs.delete(node);
          }
        }

        if (dirtyInputs.size > 0 || manualDirtyRef.current) {
          if (!isDirtyRef.current) {
            console.log("Form marked as dirty due to input in:", tag);
            setIsDirty(true);
          }
        } else {
          if (isDirtyRef.current) {
            console.log("Form marked as clean because all modified fields are emptied");
            setIsDirty(false);
          }
        }
      }
    };

    window.addEventListener("input", handleChange);
    window.addEventListener("change", handleChange);

    return () => {
      window.removeEventListener("input", handleChange);
      window.removeEventListener("change", handleChange);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // First, filter out invalid/hidden/empty nodes
      let hasAttachedDirtyInput = false;
      for (const node of dirtyInputsRef.current) {
        if (!checkNodeValidAndDirty(node)) {
          dirtyInputsRef.current.delete(node);
        } else {
          hasAttachedDirtyInput = true;
        }
      }

      if (
        isDirtyRef.current &&
        (manualDirtyRef.current || hasAttachedDirtyInput) &&
        !ignoredPaths.includes(location.pathname)
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [location.pathname, checkNodeValidAndDirty]);

  const handleStay = useCallback(() => {
    setOpen(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker]);

  const handleLeave = useCallback(() => {
    setOpen(false);
    setIsDirty(false);
    manualDirtyRef.current = false;
    dirtyInputsRef.current.clear();
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  }, [blocker]);

  const markDirty = useCallback(() => {
    manualDirtyRef.current = true;
    setIsDirty(true);
  }, []);

  const markClean = useCallback(() => {
    manualDirtyRef.current = false;
    dirtyInputsRef.current.clear();
    setIsDirty(false);
  }, []);

  const registerDirtyInput = useCallback((node) => {
    if (!node) return;
    dirtyInputsRef.current.add(node);
    if (!isDirtyRef.current) setIsDirty(true);
  }, []);

  const unregisterDirtyInput = useCallback((node) => {
    if (!node) return;
    dirtyInputsRef.current.delete(node);
    if (dirtyInputsRef.current.size === 0 && !manualDirtyRef.current) {
      setIsDirty(false);
    }
  }, []);

  return (
    <UnsavedChangesContext.Provider
      value={{
        isDirty,
        setIsDirty,
        markDirty,
        markClean,
        setOpen,
        registerDirtyInput,
        unregisterDirtyInput,
      }}
    >
      {children}

      <UnsavedChangesDrawer
        open={open}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) {
    return {
      isDirty: false,
      setIsDirty: () => { },
      markDirty: () => { },
      markClean: () => { },
      setOpen: () => { },
    };
  }
  return context;
};