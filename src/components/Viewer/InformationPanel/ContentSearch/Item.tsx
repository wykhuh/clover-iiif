import React from "react";
import { Item as ItemStyled } from "./Item.styled";

import {
  ViewerContextStore,
  useViewerState,
  useViewerDispatch,
} from "src/context/viewer-context";
import {
  type CanvasNormalized,
  AnnotationNormalized,
  EmbeddedResource,
  InternationalString,
} from "@iiif/presentation-3";
import { panToTarget } from "src/lib/content-search-helpers";

import AnnotationItemPlainText from "./PlainText";

type Props = {
  annotation: AnnotationNormalized;
};

export const ContentSearchItem: React.FC<Props> = ({ annotation }) => {
  const dispatch: any = useViewerDispatch();
  const viewerState: ViewerContextStore = useViewerState();
  const {
    openSeadragonViewer,
    vault,
    contentSearchVault,
    activeCanvas,
    configOptions,
  } = viewerState;

  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  const annotationBody: Array<
    EmbeddedResource & {
      label?: InternationalString;
    }
  > = annotation.body.map((body) => contentSearchVault.get(body.id));

  const annotationBodyValue =
    annotationBody.find((body) => body.value)?.value || "";

  let annotationTarget;
  if (annotation.target) {
    if (typeof annotation.target === "string") {
      annotationTarget = annotation.target;
    }
  }

  let annotationCanvas;
  if (annotationTarget) {
    const parts = annotationTarget.split("#xywh");
    if (parts.length > 1) {
      annotationCanvas = parts[0];
    }
  }

  function handleClick(e) {
    if (!openSeadragonViewer) return;

    const target = JSON.parse(e.target.dataset.target);
    const canvasId = e.target.dataset.canvas;

    // if activeCanvas does not change, then zoom to target
    if (activeCanvas === canvasId) {
      panToTarget(openSeadragonViewer, configOptions, annotationTarget, canvas);

      // else change canvas and then zoom to target
    } else {
      dispatch({
        type: "updateActiveCanvas",
        canvasId: canvasId,
      });

      dispatch({
        type: "updateActiveContentSearchTarget",
        activeContentSearchTarget: target,
      });
    }
  }

  const targetJson = JSON.stringify(annotationTarget);

  return (
    <ItemStyled>
      <AnnotationItemPlainText
        target={targetJson}
        canvas={annotationCanvas}
        value={annotationBodyValue}
        handleClick={handleClick}
      />
    </ItemStyled>
  );
};

export default ContentSearchItem;
