import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSelectedWorkSpace = create(
  persist(
    (set, get) => ({
      selected: {},

      setSelectedWorkSpace: (newSelected) => {
        set({ selected: newSelected });
      },
      getSelectedWorkSpace: () => {
        return get().selected?.id;
      },
      getSelectedWorkSpaceLogo: () => {
        return get().selected?.logo_url;
      },
      getSelectedWorkSpaceDetail: () => {
        return get().selected;
      }
    }),
    {
      name: "selected-persist"
    }
  )
);

export default useSelectedWorkSpace;
