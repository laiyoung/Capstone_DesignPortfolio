/** Imports for Helper Functions */
import { useEffect } from "react";

/** Project Links */
export { default as ProjectOne } from "./Project1.jsx";
export { default as ProjectTwo } from "./Project2.jsx";
export { default as ProjectThree } from "./Project3.jsx";
export { default as ProjectFour } from "./Project4.jsx";
export { default as ProjectFive } from "./Project5.jsx";
export { default as ProjectSix } from "./Project6.jsx";
export { default as ProjectSeven } from "./Project7.jsx";

/** Array Map for Establishing Project Routes */
export const projectsRoutes = [
  { id: 1, route: "/project-one" },
  { id: 2, route: "/project-two" },
  { id: 3, route: "/project-three" },
  { id: 4, route: "/project-four" },
  { id: 5, route: "/project-five" },
  { id: 6, route: "/project-six" },
  { id: 7, route: "/project-seven" },
];

/** Object Map for Converting Project Marker Types to CSS Classes */
export const markerTypeToClass = {
  "Languages & Tools": "lang-tools",
  "Competencies": "competencies",
  "Additional Critical Proficiencies": "additional-critical",
};

/** Search Utillity for Next or Previous Project */
export function getNextProject(currentId) {
  const index = projectsRoutes.findIndex((project) => project.id === currentId);
  if (index === -1) return null;

  const nextIndex = (index + 1) % projectsRoutes.length;
  return projectsRoutes[nextIndex];
}

export function getPreviousProject(currentId) {
  const index = projectsRoutes.findIndex((project) => project.id === currentId);
  if (index === -1) return null;

  const prevIndex = (index - 1 + projectsRoutes.length) % projectsRoutes.length;
  return projectsRoutes[prevIndex];
}

/** 
 * Custom Hook Helper Function to Preload the Next and Previous Image in a Project 
 * Image Carousel (loads 1 image ahead to prevent lagging) 
 * */
export function usePreloadAdjacentImages(images = [], currentIndex = 0) {
  useEffect(() => {
    if (!images || images.length === 0) return;

    const preloadImage = (url) => {
      const img = new Image();
      img.src = url;
    };

    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;

    if (images[nextIndex]?.image_url) {
      preloadImage(images[nextIndex].image_url);
    }

    if (images[prevIndex]?.image_url) {
      preloadImage(images[prevIndex].image_url);
    }
  }, [images, currentIndex]);
}