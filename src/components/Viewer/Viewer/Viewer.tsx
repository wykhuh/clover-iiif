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
  getPaintingResource,
  getSupplementingResources,
  getAnnotationResources,
  getContentSearchResources,
} from "src/hooks/use-iiif";
import {
  addOverlaysToViewer,
  removeOverlaysFromViewer,
} from "src/lib/annotation-overlays";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "src/components/Viewer/Viewer/ErrorFallback";
import { IIIFExternalWebResource } from "@iiif/presentation-3";
import { LabeledResource } from "src/hooks/use-iiif/getSupplementingResources";
import {
  LabeledAnnotationedResource,
  LabeledContentSearchResource,
} from "src/hooks/use-iiif/getAnnotationResources";
import ViewerContent from "src/components/Viewer/Viewer/Content";
import ViewerHeader from "src/components/Viewer/Viewer/Header";
import { Wrapper } from "src/components/Viewer/Viewer/Viewer.styled";
import { media } from "src/styles/stitches.config";
import { useBodyLocked } from "src/hooks/useBodyLocked";
import { useMediaQuery } from "src/hooks/useMediaQuery";
import ContentSearchForm from "src/components/Viewer/Viewer/ContentSearchForm";

interface ViewerProps {
  manifest: ManifestNormalized;
  theme?: unknown;
  iiifContentSearch?: string;
}

const Viewer: React.FC<ViewerProps> = ({
  manifest,
  theme,
  iiifContentSearch,
}) => {
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
  } = viewerState;

  /**
   * Local state
   */

  const [isInformationPanel, setIsInformationPanel] = useState<boolean>(false);
  const [isAudioVideo, setIsAudioVideo] = useState(false);
  const [painting, setPainting] = useState<IIIFExternalWebResource[]>([]);
  const [resources, setResources] = useState<LabeledResource[]>([]);
  const [annotationResources, setAnnotationResources] = useState<
    LabeledAnnotationedResource[]
  >([]);
  const [contentSearchResource, setContentSearchResource] =
    useState<LabeledContentSearchResource>();

  const [isBodyLocked, setIsBodyLocked] = useBodyLocked(false);
  const isSmallViewport = useMediaQuery(media.sm);
  const [searchServiceUrl, setSearchServiceUrl] = useState();

  const setInformationOpen = useCallback(
    (open: boolean) => {
      viewerDispatch({
        type: "updateInformationOpen",
        informationOpen: open,
      });
    },
    [viewerDispatch],
  );

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
    const resources = getSupplementingResources(
      vault,
      activeCanvas,
      "text/vtt",
    );
    getAnnotationResources(vault, activeCanvas).then((annotationResources) => {
      setAnnotationResources(annotationResources);
    });
    if (painting) {
      setIsAudioVideo(
        ["Sound", "Video"].indexOf(painting[0].type as ExternalResourceTypes) >
          -1
          ? true
          : false,
      );
      setPainting(painting);
    }
    setResources(resources);
    setIsInformationPanel(
      resources.length !== 0 || annotationResources.length !== 0,
    );
  }, [activeCanvas, vault, annotationResources.length]);

  useEffect(() => {
    if (iiifContentSearch === undefined) return;

    fetch(iiifContentSearch)
      .then((response) => response.json())
      .then((data) => {
        const canvasLabelObj = {};
        manifest.items.forEach((item) => {
          const tmpCanvas = vault.get(item.id) as CanvasNormalized;
          if (tmpCanvas.label) {
            const values = Object.values(tmpCanvas.label);
            canvasLabelObj[item.id] = values[0] && values[0][0];
          }
        });

        return getContentSearchResources(data, canvasLabelObj);
      })
      .then((resources) => {
        setContentSearchResource(resources);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [iiifContentSearch, manifest.items, vault]);

  // add overlays for content search
  // 1) if iiifContentSearch is passed as a prop, fetch the content search manifest,
  // then add overlays
  // 2) if user selects content search result fron a non-active canvas, the canvas
  // and openSeadragonViewer will change, then add overlays
  useEffect(() => {
    if (!openSeadragonViewer) return;
    if (contentSearchResource === undefined) return;

    const canvas: CanvasNormalized = vault.get({
      id: activeCanvas,
      type: "Canvas",
    });

    // remove previous annotation overlays
    removeOverlaysFromViewer(openSeadragonViewer);

    // add overlays 2
    Object.values(contentSearchResource.items).forEach((items) => {
      const itemsCanvas = items[0].canvas;
      if (itemsCanvas && itemsCanvas === activeCanvas) {
        addOverlaysToViewer(openSeadragonViewer, canvas, configOptions, items);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSeadragonViewer, contentSearchResource]);

  const hasSearchService = manifest.service.some(
    (service: any) => service.type === "SearchService2",
  );

  useEffect(() => {
    if (hasSearchService) {
      const searchService: any = manifest.service.find(
        (service: any) => service.type === "SearchService2",
      );
      if (searchService) {
        setSearchServiceUrl(searchService.id);
      }
    }
  }, [manifest, hasSearchService]);

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
          {hasSearchService && (
            <ContentSearchForm
              searchServiceUrl={searchServiceUrl}
              setContentSearchResource={setContentSearchResource}
              activeCanvas={activeCanvas}
            />
          )}
          <ViewerContent
            activeCanvas={activeCanvas}
            painting={painting}
            resources={resources}
            annotationResources={annotationResources}
            contentSearchResource={contentSearchResource}
            items={manifest.items}
            isAudioVideo={isAudioVideo}
          />
        </Collapsible.Root>
      </Wrapper>
    </ErrorBoundary>
  );
};

export default Viewer;
