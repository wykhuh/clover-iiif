import {
  Annotation,
  AnnotationBody,
  AnnotationPage,
  AnnotationTarget,
  CanvasNormalized,
  ContentResource,
  IIIFExternalWebResource,
  InternationalString,
} from "@iiif/presentation-3";

export type FormattedAnnotationItem = {
  [k: string]: any;
};

export type LabeledAnnotationedResource = {
  id: string;
  label: InternationalString;
  motivation: string | string[] | undefined;
  items: FormattedAnnotationItem[];
};

type GroupedResource = {
  body: AnnotationBody | AnnotationBody[] | undefined;
  target: AnnotationTarget | AnnotationTarget[] | undefined;
  motivation: string | string[] | undefined;
  localizedLabel: InternationalString;
};

export const getAnnotationResources = async (
  vault: any,
  activeCanvas: string,
): Promise<LabeledAnnotationedResource[]> => {
  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  if (!canvas?.annotations || !canvas.annotations[0]) return [];

  const annotationPage: AnnotationPage = vault.get(canvas.annotations[0]);

  if (!annotationPage.items) return [];

  let annotations: Annotation[] = [];
  // handle embedded annotations
  if (annotationPage.items.length > 0) {
    annotations = vault.get(annotationPage.items);
    // handle referenced annotations that are in a separate AnnotationPage
  } else {
    const annotationPageReferenced = await vault.load(annotationPage.id);
    annotations = vault.get(annotationPageReferenced.items);
  }

  const filteredAnnotations = annotations.filter((annotation) => {
    return annotation.body !== undefined;
  });

  return formatAnnotations(vault, filteredAnnotations);
};

function formatAnnotations(vault: any, annotations: Annotation[]) {
  const groupedResources = {} as { [k: string]: GroupedResource[] };
  annotations.forEach((annotation) => {
    const annotationBody = annotation.body as
      | ContentResource
      | ContentResource[];

    if (Array.isArray(annotationBody)) {
      if (annotationBody.length === 1) {
        const resource: IIIFExternalWebResource = vault.get(
          annotationBody[0].id,
        );
        if (resource.format === "text/vtt") return;

        annotation.body = resource;
      } else {
        const bodies: IIIFExternalWebResource[] = [];
        annotationBody.forEach((body) => {
          const resource: IIIFExternalWebResource = vault.get(body.id);
          if (resource.format === "text/vtt") return;

          bodies.push(resource);
        });

        annotation.body = bodies;
      }
    } else {
      const resource: IIIFExternalWebResource = vault.get(annotationBody.id);
      if (resource.format === "text/vtt") return;

      annotation.body = resource;
    }

    const localizedLabel = annotation.label || { en: ["Annotation"] };
    const labelValue = Object.values(localizedLabel)[0] as string[];
    const label = labelValue[0];

    if (!groupedResources[label]) {
      groupedResources[label] = [];
    }
    groupedResources[label].push({
      body: annotation.body,
      target: annotation.target,
      motivation: annotation.motivation && annotation.motivation[0],
      localizedLabel: localizedLabel,
    });
  });

  const results: LabeledAnnotationedResource[] = [];
  for (const [key, values] of Object.entries(groupedResources)) {
    const data = {
      id: key,
      label: values[0].localizedLabel,
      motivation: values[0].motivation,
      items: [] as any,
    };
    values.forEach((value) => {
      data.items.push({
        target: value.target,
        body: value.body,
      });
    });
    results.push(data);
  }

  return results;
}
