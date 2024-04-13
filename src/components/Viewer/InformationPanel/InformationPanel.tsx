import {
  Content,
  List,
  Scroll,
  Trigger,
  Wrapper,
} from "src/components/Viewer/InformationPanel/InformationPanel.styled";
import React, { useEffect, useState } from "react";
import {
  ViewerContextStore,
  useViewerDispatch,
  useViewerState,
  type PluginConfig,
} from "src/context/viewer-context";

import AnnotationPage from "src/components/Viewer/InformationPanel/Annotation/Page";
import ContentSearch from "src/components/Viewer/InformationPanel/ContentSearch/ContentSearch";
import { AnnotationResources, AnnotationResource } from "src/types/annotations";
import Information from "src/components/Viewer/InformationPanel/About/About";
import {
  InternationalString,
  AnnotationPageNormalized,
  CanvasNormalized,
} from "@iiif/presentation-3";
import { Label } from "src/components/Primitives";
import { setupPlugins } from "src/lib/plugin-helpers";
import ErrorFallback from "../../UI/ErrorFallback/ErrorFallback";

import { ErrorBoundary } from "react-error-boundary";

const UserScrollTimeout = 1500; // 1500ms without a user-generated scroll event reverts to auto-scrolling

interface NavigatorProps {
  activeCanvas: string;
  annotationResources?: AnnotationResources;
  searchServiceUrl?: string;
  setContentSearchResource: React.Dispatch<
    React.SetStateAction<AnnotationPageNormalized | undefined>
  >;
  contentSearchResource?: AnnotationResource;
}

export const InformationPanel: React.FC<NavigatorProps> = ({
  activeCanvas,
  annotationResources,
  searchServiceUrl,
  setContentSearchResource,
  contentSearchResource,
}) => {
  const dispatch: any = useViewerDispatch();
  const viewerState: ViewerContextStore = useViewerState();
  const {
    isAutoScrolling,
    isUserScrolling,
    vault,
    openSeadragonViewer,
    configOptions,
    plugins,
    activeManifest,
  } = viewerState;
  const { informationPanel } = configOptions;

  const [activeResource, setActiveResource] = useState<string>();

  const renderAbout = informationPanel?.renderAbout;
  const renderAnnotation = informationPanel?.renderAnnotation;
  const renderContentSearch = informationPanel?.renderContentSearch;

  let canvas: CanvasNormalized;
  try {
    canvas = vault.get({
      id: activeCanvas,
      type: "Canvas",
    });
  } catch (error) {
    console.error(error);
  }

  const { pluginsWithInfoPanel } = setupPlugins(plugins);

  function renderPluginInformationPanel(plugin: PluginConfig, i: number) {
    const PluginInformationPanelComponent = plugin?.informationPanel
      ?.component as unknown as React.ElementType;

    if (PluginInformationPanelComponent === undefined) {
      return <>no component</>;
    }

    return (
      <Content key={i} value={plugin.id}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PluginInformationPanelComponent
            {...plugin?.informationPanel?.componentProps}
            data-testid="meeeeee"
            activeManifest={activeManifest}
            canvas={canvas}
            viewerConfigOptions={configOptions}
            openSeadragonViewer={openSeadragonViewer}
            useViewerDispatch={useViewerDispatch}
            useViewerState={useViewerState}
          />
        </ErrorBoundary>
      </Content>
    );
  }

  useEffect(() => {
    if (activeResource) {
      return;
    } else if (renderContentSearch) {
      setActiveResource("manifest-content-search");
    } else if (renderAbout) {
      setActiveResource("manifest-about");
    } else if (
      annotationResources &&
      annotationResources?.length > 0 &&
      !renderAbout
    ) {
      setActiveResource(annotationResources[0].id);
    } else if (plugins.length > 0) {
      setActiveResource(plugins[0].id);
    }
  }, [
    activeCanvas,
    activeResource,
    renderAbout,
    renderContentSearch,
    annotationResources,
    contentSearchResource,
    plugins,
  ]);

  function handleScroll() {
    // console.log("Type of scroll: ", isAutoScrolling ? 'auto' : 'user');
    if (!isAutoScrolling) {
      clearTimeout(isUserScrolling);
      const timeout = setTimeout(() => {
        dispatch({
          type: "updateUserScrolling",
          isUserScrolling: undefined,
        });
      }, UserScrollTimeout);

      dispatch({
        type: "updateUserScrolling",
        isUserScrolling: timeout,
      });
    }
  }

  const handleValueChange = (value: string) => {
    setActiveResource(value);
  };

  return (
    <Wrapper
      data-testid="information-panel"
      defaultValue={activeResource}
      onValueChange={handleValueChange}
      orientation="horizontal"
      value={activeResource}
      className="clover-viewer-information-panel"
    >
      <List aria-label="select chapter" data-testid="information-panel-list">
        {renderContentSearch && contentSearchResource && (
          <Trigger value="manifest-content-search">
            <Label label={contentSearchResource.label as InternationalString} />
          </Trigger>
        )}
        {renderAbout && <Trigger value="manifest-about">About</Trigger>}
        {renderAnnotation &&
          annotationResources &&
          annotationResources.map((resource, i) => (
            <Trigger key={i} value={resource.id}>
              <Label label={resource.label as InternationalString} />
            </Trigger>
          ))}

        {pluginsWithInfoPanel &&
          pluginsWithInfoPanel.map((plugin, i) => (
            <Trigger key={i} value={plugin.id}>
              <Label
                label={plugin.informationPanel?.label as InternationalString}
              />
            </Trigger>
          ))}
      </List>
      <Scroll handleScroll={handleScroll}>
        {renderContentSearch && contentSearchResource && (
          <Content value="manifest-content-search">
            <ContentSearch
              searchServiceUrl={searchServiceUrl}
              setContentSearchResource={setContentSearchResource}
              activeCanvas={activeCanvas}
              annotationPage={contentSearchResource}
            />
          </Content>
        )}
        {renderAbout && (
          <Content value="manifest-about">
            <Information />
          </Content>
        )}
        {renderAnnotation &&
          annotationResources &&
          annotationResources.map((annotationPage) => (
            <Content key={annotationPage.id} value={annotationPage.id}>
              <AnnotationPage annotationPage={annotationPage} />
            </Content>
          ))}

        {pluginsWithInfoPanel &&
          pluginsWithInfoPanel.map((plugin, i) =>
            renderPluginInformationPanel(plugin, i),
          )}
      </Scroll>
    </Wrapper>
  );
};

export default InformationPanel;
