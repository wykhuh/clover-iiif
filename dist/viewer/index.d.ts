// Generated by dts-bundle-generator v8.1.2

import { IncomingHttpHeaders } from 'http';
import { Options as OpenSeadragonOptions } from 'openseadragon';
import React from 'react';

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
export type CustomDisplay = {
	component: React.ElementType;
	target: string;
	options?: {
		[k: string]: string | number;
	};
};
export interface CloverViewerProps {
	canvasIdCallback?: (arg0: string) => void;
	osdViewerCallback?: (viewer: any, OpenSeadragon: any, vault: any, activeCanvas: any) => void;
	customDisplays?: Array<CustomDisplay>;
	customTheme?: any;
	iiifContent: string;
	id?: string;
	manifestId?: string;
	options?: ViewerConfigOptions;
}
declare const CloverViewer: React.FC<CloverViewerProps>;

export {
	CloverViewer as default,
};

export {};
