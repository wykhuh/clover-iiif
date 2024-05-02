import {
  AnnotationResources,
  AnnotationResource,
  ContentSearchQuery,
} from "src/types/annotations";
import { CanvasNormalized } from "@iiif/presentation-3";

export const getAnnotationResources = (
  vault: any,
  activeCanvas: string,
): AnnotationResources => {
  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  if (!canvas?.annotations || !canvas.annotations[0]) return [];

  const annotationPages: AnnotationResources = vault.get(canvas.annotations);

  /**
   * Filter out annotation pages that don't have any Annotations in the items array.
   */
  return annotationPages
    .filter((annotationPage) => {
      if (!annotationPage.items || !annotationPage.items.length) return false;
      return annotationPage;
    })
    .map((annotationPage) => {
      /**
       * If the annotation page doesn't have a label, add a default label.
       * Set this value in a CONFIG and not here.
       */
      const label = annotationPage.label || { none: ["Annotations"] };
      return { ...annotationPage, label };
    });
};

export const getContentSearchResources = async (
  contentSearchVault: any,
  searchUrl: string,
  tabLabel: string,
  searchQuery?: ContentSearchQuery,
): Promise<AnnotationResource> => {
  if (searchQuery == undefined || searchQuery["q"] == undefined) {
    // must return a label because Information Panel tab requires a label
    return { label: { none: [tabLabel] } } as unknown as AnnotationResource;
  }

  // TODO: handle other query params (e.g. motivation, date, user) defined in
  // Content Search spec
  const url = `${searchUrl}?q=${searchQuery["q"].trim()}`;

  let annotationPage;
  try {
    annotationPage = await contentSearchVault.load(url);
  } catch (error) {
    console.log("Could not load content search.");
    return {} as AnnotationResource;
  }

  if (annotationPage.label == undefined) {
    annotationPage.label = { none: [tabLabel] };
  }
  return annotationPage;
};
