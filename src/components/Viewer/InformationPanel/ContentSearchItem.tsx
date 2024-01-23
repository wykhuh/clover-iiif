import React, { useEffect } from "react";
import { Item } from "src/components/Viewer/InformationPanel/ContentSearchItem.styled";
import {
  ViewerContextStore,
  useViewerState,
  useViewerDispatch,
} from "src/context/viewer-context";
import OpenSeadragon from "openseadragon";
import { type CanvasNormalized } from "@iiif/presentation-3";
import { FormattedAnnotationItem } from "src/hooks/use-iiif/getAnnotationResources";

type Props = {
  item: FormattedAnnotationItem;
  activeTarget: string | undefined;
  setActiveTarget: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const SearchContentItem: React.FC<Props> = ({
  item,
  activeTarget,
  setActiveTarget,
}) => {
  const dispatch: any = useViewerDispatch();
  const viewerState: ViewerContextStore = useViewerState();
  const { openSeadragonViewer, vault, activeCanvas, configOptions } =
    viewerState;
  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  useEffect(() => {
    if (!openSeadragonViewer) return;
    if (item.target != activeTarget) return;

    const zoomLevel = configOptions.annotationOverlays?.zoomLevel || 1;

    if (typeof item.target === "string") {
      if (!item.target.includes("#xywh=")) return;

      zoomToXYWHTarget(item.target, zoomLevel, canvas, openSeadragonViewer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSeadragonViewer]);

  function handleClick(e) {
    if (!openSeadragonViewer) return;

    const target = JSON.parse(e.target.dataset.target);
    const canvasId = e.target.dataset.canvas;

    // handle cases where canvas stays the same
    if (activeCanvas === canvasId) {
      const zoomLevel = configOptions.annotationOverlays?.zoomLevel || 1;

      if (typeof target === "string") {
        if (!target.includes("#xywh=")) return;
        zoomToXYWHTarget(item.target, zoomLevel, canvas, openSeadragonViewer);
      }
      // handle cases where canvas changes
    } else {
      dispatch({
        type: "updateActiveCanvas",
        canvasId: canvasId,
      });
      setActiveTarget(target);
    }
  }

  function renderItemBody(body, target, canvas, i = 0) {
    if (body.value) {
      return (
        <span key={i} data-target={target} data-canvas={canvas}>
          {body.value}
        </span>
      );
    }
  }

  const targetJson = JSON.stringify(item.target);

  if (Array.isArray(item.body)) {
    return (
      <Item
        onClick={handleClick}
        data-target={targetJson}
        data-canvas={item.canvas}
      >
        {item.body.map((body, i) =>
          renderItemBody(body, targetJson, item.canvas, i),
        )}
      </Item>
    );
  }

  return (
    <Item
      onClick={handleClick}
      data-target={targetJson}
      data-canvas={item.canvas}
    >
      {renderItemBody(item.body, targetJson, item.canvas)}
    </Item>
  );
};

export default SearchContentItem;

function zoomToXYWHTarget(target, zoomLevel, canvas, openSeadragonViewer) {
  const parts = target.split("#xywh=");
  if (parts && parts[1]) {
    const [x, y, w, h] = parts[1].split(",").map((value) => Number(value));
    const scale = 1 / canvas.width;
    const rect = new OpenSeadragon.Rect(
      x * scale - ((w * scale) / 2) * (zoomLevel - 1),
      y * scale - ((h * scale) / 2) * (zoomLevel - 1),
      w * scale * zoomLevel,
      h * scale * zoomLevel,
    );

    openSeadragonViewer.viewport.fitBounds(rect);
  }
}
