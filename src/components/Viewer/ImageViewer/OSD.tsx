import {
  Navigator,
  Viewport,
  Wrapper,
} from "src/components/Viewer/ImageViewer/ImageViewer.styled";
import OpenSeadragon, { Options } from "openseadragon";
import React, { useEffect, useState } from "react";
import {
  ViewerContextStore,
  useViewerState,
  useViewerDispatch,
} from "src/context/viewer-context";

import Controls from "src/components/Viewer/ImageViewer/Controls";
import { getInfoResponse } from "src/lib/iiif";
import { v4 as uuidv4 } from "uuid";
import { LabeledAnnotationedResource } from "src/hooks/use-iiif/getAnnotationResources";
import { addOverlaysToViewer } from "src/lib/annotation-overlays";
import { type CanvasNormalized } from "@iiif/presentation-3";

export type osdImageTypes = "tiledImage" | "simpleImage" | undefined;

interface OSDProps {
  uri: string | undefined;
  hasPlaceholder: boolean;
  imageType: osdImageTypes;
  annotationResources: LabeledAnnotationedResource[];
}

const OSD: React.FC<OSDProps> = ({
  uri,
  hasPlaceholder,
  imageType,
  annotationResources,
}) => {
  const [osdUri, setOsdUri] = useState<string>();
  const [osdInstance, setOsdInstance] = useState<string>();
  const viewerState: ViewerContextStore = useViewerState();
  const { configOptions, vault, activeCanvas } = viewerState;
  const dispatch: any = useViewerDispatch();
  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  const config: Options = {
    id: `openseadragon-viewport-${osdInstance}`,
    loadTilesWithAjax: true,
    fullPageButton: "fullPage",
    homeButton: "reset",
    rotateLeftButton: "rotateLeft",
    rotateRightButton: "rotateRight",
    zoomInButton: "zoomIn",
    zoomOutButton: "zoomOut",
    showNavigator: true,
    showFullPageControl: true,
    showHomeControl: true,
    showRotationControl: true,
    showZoomControl: true,
    navigatorBorderColor: "transparent",
    navigatorId: `openseadragon-navigator-${osdInstance}`,
    gestureSettingsMouse: {
      clickToZoom: true,
      dblClickToZoom: true,
      pinchToZoom: true,
      scrollToZoom: true,
    },
    ...configOptions.openSeadragon,
    ajaxWithCredentials: configOptions.withCredentials,
  };

  useEffect(() => {
    if (uri !== osdUri) {
      setOsdUri(uri);
      setOsdInstance(uuidv4());
    }
  }, [osdUri, uri]);

  useEffect(() => {
    if (osdUri) {
      switch (imageType) {
        case "simpleImage":
          const viewer = OpenSeadragon(config);
          viewer.addSimpleImage({
            url: osdUri,
          });
          dispatch({
            type: "updateOpenSeadragonViewer",
            openSeadragonViewer: viewer,
          });
          if (configOptions.annotationOverlays?.renderOverlays) {
            addOverlaysToViewer(
              viewer,
              canvas,
              configOptions,
              annotationResources,
            );
          }
          break;
        case "tiledImage":
          getInfoResponse(osdUri).then((tileSource) => {
            const viewer = OpenSeadragon(config);
            viewer.addTiledImage({
              tileSource: tileSource,
            });
            dispatch({
              type: "updateOpenSeadragonViewer",
              openSeadragonViewer: viewer,
            });
            if (configOptions.annotationOverlays?.renderOverlays) {
              addOverlaysToViewer(
                viewer,
                canvas,
                configOptions,
                annotationResources,
              );
            }
          });
          break;
        default:
          console.warn(
            `Unable to render ${osdUri} in OpenSeadragon as type: "${imageType}"`,
          );
          break;
      }
    }
  }, [osdUri]);

  if (!osdInstance) return null;

  return (
    <Wrapper
      css={{
        backgroundColor: configOptions.canvasBackgroundColor,
        height: configOptions.canvasHeight,
      }}
    >
      <Controls hasPlaceholder={hasPlaceholder} options={config} />
      <Navigator id={`openseadragon-navigator-${osdInstance}`} />
      <Viewport id={`openseadragon-viewport-${osdInstance}`} />
    </Wrapper>
  );
};

export default OSD;
