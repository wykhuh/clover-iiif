import React, { useReducer } from "react";

import {
  CollectionNormalized,
  InternationalString,
} from "@iiif/presentation-3";
import { IncomingHttpHeaders } from "http";
import OpenSeadragon, { Options as OpenSeadragonOptions } from "openseadragon";
import { Vault } from "@iiif/vault";
import { deepMerge } from "src/lib/utils";

export type ViewerConfigOptions = {
  annotationOverlays?: {
    backgroundColor?: string;
    borderColor?: string;
    borderType?: string;
    borderWidth?: string;
    opacity?: string;
    renderOverlays?: boolean;
    zoomLevel?: number;
  };
  background?: string;
  canvasBackgroundColor?: string;
  canvasHeight?: string;
  ignoreCaptionLabels?: string[];
  ignoreAnnotationOverlaysLabels?: string[];
  informationPanel?: {
    open?: boolean;
    renderAbout?: boolean;
    renderSupplementing?: boolean;
    renderToggle?: boolean;
    renderAnnotation?: boolean;
  };
  openSeadragon?: OpenSeadragonOptions;
  requestHeaders?: IncomingHttpHeaders;
  showIIIFBadge?: boolean;
  showTitle?: boolean;
  withCredentials?: boolean;
};

const defaultConfigOptions = {
  annotationOverlays: {
    backgroundColor: "#ff6666",
    borderColor: "#990000",
    borderType: "solid",
    borderWidth: "1px",
    opacity: "0.5",
    renderOverlays: true,
    zoomLevel: 2,
  },
  background: "transparent",
  canvasBackgroundColor: "#6662",
  canvasHeight: "61.8vh",
  ignoreCaptionLabels: [],
  ignoreAnnotationOverlaysLabels: [],
  informationPanel: {
    open: true,
    renderAbout: true,
    renderSupplementing: true,
    renderToggle: true,
    renderAnnotation: true,
  },
  openSeadragon: {},
  requestHeaders: { "Content-Type": "application/json" },
  showIIIFBadge: true,
  showTitle: true,
  withCredentials: false,
};

export type CustomDisplay = {
  display: {
    component: React.ElementType;
    componentProps?: Record<string, unknown>;
  };
  target: {
    canvasId?: string[];
    paintingFormat?: string[];
  };
};
export type Plugin = {
  id: string;
  menu?: {
    component: React.ElementType;
    componentProps?: Record<string, unknown>;
  };
  informationPanel?: {
    component: React.ElementType;
    componentProps?: Record<string, unknown>;
    label?: InternationalString;
  };
};

export interface ViewerContextStore {
  activeCanvas: string;
  activeManifest: string;
  collection?: CollectionNormalized | Record<string, never>;
  configOptions: ViewerConfigOptions;
  customDisplays: Array<CustomDisplay>;
  plugins: Array<Plugin>;
  informationOpen: boolean;
  isLoaded: boolean;
  vault: Vault;
  openSeadragonViewer: OpenSeadragon.Viewer | null;
}

export interface ViewerAction {
  type: string;
  canvasId: string;
  collection: CollectionNormalized;
  configOptions: ViewerConfigOptions;
  informationOpen: boolean;
  isLoaded: boolean;
  manifestId: string;
  vault: Vault;
  openSeadragonViewer: OpenSeadragon.Viewer;
}

export const defaultState: ViewerContextStore = {
  activeCanvas: "",
  activeManifest: "",
  collection: {},
  configOptions: defaultConfigOptions,
  customDisplays: [],
  plugins: [],
  informationOpen: defaultConfigOptions?.informationPanel?.open,
  isLoaded: false,
  vault: new Vault(),
  openSeadragonViewer: null,
};

const ViewerStateContext =
  React.createContext<ViewerContextStore>(defaultState);
const ViewerDispatchContext =
  React.createContext<ViewerContextStore>(defaultState);

function viewerReducer(state: ViewerContextStore, action: ViewerAction) {
  switch (action.type) {
    case "updateActiveCanvas": {
      /**
       * Set canvasId to empty string if it comes back undefined.
       */
      if (!action.canvasId) action.canvasId = "";
      return {
        ...state,
        activeCanvas: action.canvasId,
      };
    }
    case "updateActiveManifest": {
      return {
        ...state,
        activeManifest: action.manifestId,
      };
    }
    case "updateCollection": {
      return {
        ...state,
        collection: action.collection,
      };
    }
    case "updateConfigOptions": {
      return {
        ...state,
        configOptions: deepMerge(state.configOptions, action.configOptions),
      };
    }
    case "updateInformationOpen": {
      return {
        ...state,
        informationOpen: action.informationOpen,
      };
    }
    case "updateIsLoaded": {
      return {
        ...state,
        isLoaded: action.isLoaded,
      };
    }
    case "updateOpenSeadragonViewer": {
      return {
        ...state,
        openSeadragonViewer: action.openSeadragonViewer,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

interface ViewerProviderProps {
  initialState?: ViewerContextStore;
  children: React.ReactNode;
}

const ViewerProvider: React.FC<ViewerProviderProps> = ({
  initialState = defaultState,
  children,
}) => {
  const [state, dispatch] = useReducer<
    React.Reducer<ViewerContextStore, ViewerAction>
  >(viewerReducer, initialState);

  return (
    <ViewerStateContext.Provider value={state}>
      <ViewerDispatchContext.Provider
        value={dispatch as unknown as ViewerContextStore}
      >
        {children}
      </ViewerDispatchContext.Provider>
    </ViewerStateContext.Provider>
  );
};

function useViewerState() {
  const context = React.useContext(ViewerStateContext);
  if (context === undefined) {
    throw new Error("useViewerState must be used within a ViewerProvider");
  }
  return context;
}

function useViewerDispatch() {
  const context = React.useContext(ViewerDispatchContext);
  if (context === undefined) {
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  }
  return context;
}

export { ViewerProvider, useViewerState, useViewerDispatch };
