import * as Collapsible from "@radix-ui/react-collapsible";

import {
  ExternalResourceTypes,
  InternationalString,
  ManifestNormalized,
  CanvasNormalized,
} from "@iiif/presentation-3";
import React, { useCallback, useEffect, useState } from "react";
import {
  ViewerContextStore,
  useViewerDispatch,
  useViewerState,
} from "src/context/viewer-context";
import {
  getAnnotationResources,
  getPaintingResource,
} from "src/hooks/use-iiif";

import { AnnotationResources } from "src/types/annotations";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "src/components/Viewer/Viewer/ErrorFallback";
import { IIIFExternalWebResource } from "@iiif/presentation-3";
import ViewerContent from "src/components/Viewer/Viewer/Content";
import ViewerHeader from "src/components/Viewer/Viewer/Header";
import { Wrapper } from "src/components/Viewer/Viewer/Viewer.styled";
import { media } from "src/styles/stitches.config";
import { useBodyLocked } from "src/hooks/useBodyLocked";
import { useMediaQuery } from "src/hooks/useMediaQuery";

interface ViewerProps {
  manifest: ManifestNormalized;
  theme?: unknown;
}

const Viewer: React.FC<ViewerProps> = ({ manifest, theme }) => {
  /**
   * Viewer State
   */
  const viewerState: ViewerContextStore = useViewerState();
  const viewerDispatch: any = useViewerDispatch();
  const {
    activeCanvas,
    informationOpen,
    vault,
    configOptions,
    openSeadragonViewer,
    plugins,
  } = viewerState;

  /**
   * Local state
   */

  const [isInformationPanel, setIsInformationPanel] = useState<boolean>(false);
  const [isAudioVideo, setIsAudioVideo] = useState(false);
  const [painting, setPainting] = useState<IIIFExternalWebResource[]>([]);
  const [annotationResources, setAnnotationResources] =
    useState<AnnotationResources>([]);

  const [isBodyLocked, setIsBodyLocked] = useBodyLocked(false);
  const isSmallViewport = useMediaQuery(media.sm);

  const setInformationOpen = useCallback(
    (open: boolean) => {
      viewerDispatch({
        type: "updateInformationOpen",
        informationOpen: open,
      });
    },
    [viewerDispatch],
  );

  const canvas: CanvasNormalized = vault.get({
    id: activeCanvas,
    type: "Canvas",
  });

  useEffect(() => {
    if (configOptions?.informationPanel?.open) {
      setInformationOpen(!isSmallViewport);
    }
  }, [
    isSmallViewport,
    configOptions?.informationPanel?.open,
    setInformationOpen,
  ]);

  useEffect(() => {
    if (!isSmallViewport) {
      setIsBodyLocked(false);
      return;
    }
    setIsBodyLocked(informationOpen);
  }, [informationOpen, isSmallViewport, setIsBodyLocked]);

  useEffect(() => {
    const painting = getPaintingResource(vault, activeCanvas);

    if (painting) {
      setIsAudioVideo(
        ["Sound", "Video"].indexOf(painting[0].type as ExternalResourceTypes) >
          -1
          ? true
          : false,
      );
      setPainting(painting);
    }
    getAnnotationResources(vault, activeCanvas).then((annotationResources) => {
      setAnnotationResources(annotationResources);

      setIsInformationPanel(annotationResources.length !== 0);
    });
  }, [activeCanvas, annotationResources.length, vault]);

  function renderPlugins() {
    return plugins.map((plugin, i) => {
      const PluginComponent = plugin.component as unknown as React.ElementType;
      return (
        <PluginComponent
          key={i}
          {...plugin?.componentProps}
          activeManifest={manifest.id}
          canvas={canvas}
          viewerConfigOptions={configOptions}
          openSeadragonViewer={openSeadragonViewer}
          useViewerDispatch={useViewerDispatch}
          useViewerState={useViewerState}
        ></PluginComponent>
      );
    });
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Wrapper
        className={`${theme} clover-viewer`}
        css={{ background: configOptions?.background }}
        data-body-locked={isBodyLocked}
        data-information-panel={isInformationPanel}
        data-information-panel-open={informationOpen}
      >
        <Collapsible.Root
          open={informationOpen}
          onOpenChange={setInformationOpen}
        >
          <ViewerHeader
            manifestLabel={manifest.label as InternationalString}
            manifestId={manifest.id}
          />
          {activeCanvas && openSeadragonViewer && renderPlugins()}
          <ViewerContent
            activeCanvas={activeCanvas}
            painting={painting}
            annotationResources={annotationResources}
            items={manifest.items}
            isAudioVideo={isAudioVideo}
          />
        </Collapsible.Root>
      </Wrapper>
    </ErrorBoundary>
  );
};

export default Viewer;
