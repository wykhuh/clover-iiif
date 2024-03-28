import { AnnotationResources, AnnotationResource } from "src/types/annotations";
import { CanvasNormalized } from "@iiif/presentation-3";

export const getAnnotationResources = async (
  vault: any,
  activeCanvas: string,
): Promise<AnnotationResources> => {
  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  if (!canvas?.annotations || !canvas.annotations[0]) return [];

  const annotationPages: AnnotationResources = vault.get(canvas.annotations);

  /**
   * Filter out annotation pages that don't have any Annotations in the items array.
   */
  const filteredPages = annotationPages.filter((annotationPage) => {
    if (!annotationPage.items) return false;
    return annotationPage;
  });

  const pages: AnnotationResources = [];
  for (const annotationPage of filteredPages) {
    // handle embedded annotations
    if (annotationPage.items.length > 0) {
      const label = annotationPage.label || { none: ["Annotations"] };
      pages.push({ ...annotationPage, label: label });
      // handle referenced annotations that are in a separate AnnotationPage
    } else {
      let annotationPageReferenced = {} as any;
      try {
        annotationPageReferenced = await vault.load(annotationPage.id);
      } catch (error) {
        console.log(error);
      }
      if (
        annotationPageReferenced.items &&
        annotationPageReferenced.items.length > 0
      ) {
        const label = annotationPageReferenced.label || {
          none: ["Annotations"],
        };
        pages.push({ ...annotationPageReferenced, label: label });
      }
    }
  }
  return pages;
};

export const getContentSearchResources = async (
  contentSearchVault: any,
  searchUrl: string,
  tabLabel: string,
): Promise<AnnotationResource> => {
  let annotationPage;
  try {
    annotationPage = await contentSearchVault.load(searchUrl);
  } catch (error) {
    console.log("Could not load content search.");
    return {} as AnnotationResource;
  }

  if (annotationPage.label == undefined) {
    annotationPage.label = { none: [tabLabel] };
  }
  return annotationPage;
};
