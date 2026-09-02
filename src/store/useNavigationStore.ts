import {create} from "zustand";

import type {GalleryMode} from "@/types/gallery";

interface NavigationState {
  galleryMode: GalleryMode;

  setGalleryMode: (mode: GalleryMode) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  galleryMode: "walkthrough",

  setGalleryMode: (mode) => set({galleryMode: mode})
}));
