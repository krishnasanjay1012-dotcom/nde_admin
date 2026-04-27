import { create } from "zustand";
import { persist } from "zustand/middleware";

const useIsSetUpCompleted = create(
  persist(
    (set) => ({
      isSetUpCompleted: false,
      multiWorkspace: false,
      setIsSetUpCompleted: (newValue) => set({ isSetUpCompleted: newValue }),
      setMultiWorkspace: (newValue) => set({ multiWorkspace: newValue })
    }),
    { name: "is-setup-completed" }
  )
);

const useIsSetUpRoute = create((set) => ({
  currentRoute: "/setup",
  setCurrentRoute: (newValue) => set({ currentRoute: newValue })
}));

const useSetupScore = create((set) => ({
  setupScore: 0,
  setSetupScore: (newValue) => set({ setupScore: newValue })
}));

const useSelectedAppsStore = create((set) => ({
  selectedAppId: ["nde-connect"],
  setSelectedAppId: (ids) => set({ selectedAppId: ids }),
  toggleAppId: (id) =>
    set((state) => {
      if (id === "nde-connect") return state;
      const alreadySelected = state.selectedAppId.includes(id);
      const updated = alreadySelected
        ? state.selectedAppId.filter((appId) => appId !== id)
        : [...state.selectedAppId, id];
      return { selectedAppId: updated };
    })
}));

export {
  useIsSetUpCompleted,
  useSetupScore,
  useSelectedAppsStore,
  useIsSetUpRoute
};
