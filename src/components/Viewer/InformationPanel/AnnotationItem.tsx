import React from "react";
import { Item } from "src/components/Viewer/InformationPanel/AnnotationItem.styled";
import { ViewerContextStore, useViewerState } from "src/context/viewer-context";
import { type CanvasNormalized } from "@iiif/presentation-3";
import {
  zoomToXYWHTarget,
  zoomToPointTarget,
} from "src/lib/annotation-handlers";

type Props = {
  item: any;
};

export const AnnotationItem: React.FC<Props> = ({ item }) => {
  const viewerState: ViewerContextStore = useViewerState();
  const { openSeadragonViewer, vault, activeCanvas, configOptions } =
    viewerState;
  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  function handleClick(e) {
    if (!openSeadragonViewer) return;

    const target = JSON.parse(e.target.dataset.target);
    const zoomLevel = configOptions.annotationOverlays?.zoomLevel || 1;

    if (typeof target === "string") {
      zoomToXYWHTarget(target, zoomLevel, canvas, openSeadragonViewer);
    } else {
      if (target.selector?.type === "PointSelector") {
        zoomToPointTarget(target, zoomLevel, canvas, openSeadragonViewer);
      } else if (target.selector?.type === "SvgSelector") {
        // TODO: figure out how to get the bounding box for an svg
      }
    }
  }

  function renderItemBody(body, target, i = 0) {
    if (body.format === "text/html") {
      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: body.value }}></div>
      );
    } else if (body.value) {
      return (
        <div key={i} data-target={target}>
          {body.value}
        </div>
      );
    } else if (body.type === "Image") {
      return <img src={body.id} key={i} data-target={target} />;
    }
  }

  const targetJson = JSON.stringify(item.target);

  if (Array.isArray(item.body)) {
    return (
      <Item onClick={handleClick} data-target={targetJson}>
        {item.body.map((body, i) => renderItemBody(body, targetJson, i))}
      </Item>
    );
  }

  return (
    <Item onClick={handleClick} data-target={targetJson}>
      {renderItemBody(item.body, targetJson)}
    </Item>
  );
};

export default AnnotationItem;
