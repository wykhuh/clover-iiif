function formatUrl(annotationServer: string, activeCanvas: string) {
  return `${annotationServer}/?canvas=${activeCanvas}`;
}

export async function saveAnnotation(
  annotation: any,
  activeCanvas: string,
  unit: "pixel" | "percent",
  token?: string,
  annotationServer?: string,
) {
  if (token && annotationServer) {
    await fetch(formatUrl(annotationServer, activeCanvas), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(convertWebAnnotation(annotation, unit)),
    });
  } else if (!token) {
    let annotations: any = {};
    const savedAnnotations = window.localStorage.getItem("annotations");
    if (savedAnnotations) {
      const annotationsObj = JSON.parse(savedAnnotations);
      if (annotationsObj[activeCanvas] == undefined) {
        annotationsObj[activeCanvas] = {
          id: activeCanvas,
          items: [],
          type: "AnnotationPage",
        };
      }
      annotationsObj[activeCanvas].items.push(
        convertWebAnnotation(annotation, unit),
      );
      annotations = annotationsObj;
    } else {
      annotations[activeCanvas] = {
        id: activeCanvas,
        items: [convertWebAnnotation(annotation, unit)],
        type: "AnnotationPage",
      };
    }

    window.localStorage.setItem("annotations", JSON.stringify(annotations));
  }
}

function convertWebAnnotation(webAnnotation, unit: "pixel" | "percent") {
  const annotation = {} as any;

  if (webAnnotation.body.length == 1) {
    annotation.body = {
      type: webAnnotation.body[0].type,
      value: webAnnotation.body[0].value,
    };
  } else if (webAnnotation.body.length > 1) {
    annotation.body = webAnnotation.body.map((ann) => {
      return {
        type: ann.type,
        value: ann.value,
      };
    });
  }

  annotation.id = webAnnotation.id;
  annotation.motivation = webAnnotation.body[0]
    ? webAnnotation.body[0].purpose
    : "commenting";
  annotation.target = {
    type: "SpecificResource",
    source: webAnnotation.target.source,
    selector: {
      type: webAnnotation.target.selector.type,
      conformsTo: webAnnotation.target.selector.conformsTo,
      value: webAnnotation.target.selector.value.replace(`${unit}:`, ""),
    },
  };
  annotation.type = "Annotation";

  return annotation;
}

export async function fetchAnnotation(
  activeCanvas: string,
  unit: "pixel" | "percent",
  token?: string,
  annotationServer?: string,
) {
  let annotations: any = [];

  if (token && annotationServer) {
    const res = await fetch(formatUrl(annotationServer, activeCanvas), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const savedAnnotation = await res.json();
      annotations = processSavedAnnotation(savedAnnotation, unit);
    } else {
      const error = await res.json();
      console.error(error);
    }
  } else if (!token) {
    const savedAnnotationsAll = window.localStorage.getItem("annotations");
    if (savedAnnotationsAll) {
      const savedAnnotation = JSON.parse(savedAnnotationsAll)[activeCanvas];
      if (savedAnnotation) {
        annotations = processSavedAnnotation(savedAnnotation, unit);
      }
    }
  }

  return annotations;
}

function processSavedAnnotation(savedAnnotation, unit: "pixel" | "percent") {
  const webAnnotations = [] as any;

  savedAnnotation.items.forEach((ann) => {
    let body;
    if (Array.isArray(ann.body)) {
      body = ann.body.map((b) => {
        return { ...b, purpose: "commenting" };
      });
    } else {
      body = [{ ...ann.body, purpose: "commenting" }];
    }
    webAnnotations.push({
      "@context": "http://www.w3.org/ns/anno.jsonld",
      type: "Annotation",
      body: body,
      target: {
        source: ann.target.source,
        selector: {
          type: ann.target.selector.type,
          conformsTo: ann.target.selector.conformsTo,
          value: ann.target.selector.value.replace("xywh=", `xywh=${unit}:`),
        },
      },
      id: ann.id,
    });
  });
  return webAnnotations;
}

export async function deleteAnnotation(
  annotation,
  activeCanvas: string,
  unit: "pixel" | "percent",
  token?: string,
  annotationServer?: string,
) {
  if (token && annotationServer) {
    await fetch(formatUrl(annotationServer, activeCanvas), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(convertWebAnnotation(annotation, unit)),
    });
  } else if (!token) {
    const savedAnnotations = window.localStorage.getItem("annotations");
    if (savedAnnotations) {
      const annotations = JSON.parse(savedAnnotations);
      const selectedAnnotations = annotations[activeCanvas];
      if (selectedAnnotations) {
        const otherAnnotations = selectedAnnotations.items.filter(
          (ann) => ann.id !== annotation.id,
        );
        annotations[activeCanvas] = {
          id: activeCanvas,
          items: otherAnnotations,
          type: "AnnotationPage",
        };
        window.localStorage.setItem("annotations", JSON.stringify(annotations));
      }
    }
  }
}

export async function updateAnnotation(
  annotation,
  activeCanvas: string,
  unit: "pixel" | "percent",
  token?: string,
  annotationServer?: string,
) {
  if (token && annotationServer) {
    await fetch(formatUrl(annotationServer, activeCanvas), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(convertWebAnnotation(annotation, unit)),
    });
  } else if (!token) {
    const savedAnnotations = window.localStorage.getItem("annotations");
    if (savedAnnotations) {
      const annotations = JSON.parse(savedAnnotations);
      const selectedAnnotations = annotations[activeCanvas];
      if (selectedAnnotations) {
        const updatedAnnotations: any = [];
        selectedAnnotations.items.forEach((ann) => {
          if (ann.id === annotation.id) {
            updatedAnnotations.push(convertWebAnnotation(annotation, unit));
          } else {
            updatedAnnotations.push(ann);
          }
        });
        annotations[activeCanvas] = {
          id: activeCanvas,
          items: updatedAnnotations,
          type: "AnnotationPage",
        };
        window.localStorage.setItem("annotations", JSON.stringify(annotations));
      }
    }
  }
}
