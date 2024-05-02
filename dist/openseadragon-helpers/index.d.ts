// Generated by dts-bundle-generator v8.0.1

import { Annotation, AnnotationNormalized, CanvasNormalized, IIIFExternalWebResource } from '@iiif/presentation-3';
import OpenSeadragon from 'openseadragon';

export type OverlayOptions = {
	backgroundColor?: string;
	borderColor?: string;
	borderType?: string;
	borderWidth?: string;
	opacity?: string;
	renderOverlays?: boolean;
	zoomLevel?: number;
};
export interface ParsedAnnotationTarget {
	id: string;
	point?: {
		x: number;
		y: number;
	};
	rect?: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
	svg?: string;
	t?: string;
}
declare enum OpenSeadragonImageTypes {
	TiledImage = "tiledImage",
	SimpleImage = "simpleImage"
}
export declare function addOverlaysToViewer(viewer: OpenSeadragon.Viewer, canvas: CanvasNormalized, configOptions: OverlayOptions, annotations: Annotation[] | AnnotationNormalized[], overlaySelector: string): void;
export declare function createOpenSeadragonRect(canvas: CanvasNormalized, parsedAnnotationTarget: ParsedAnnotationTarget, zoomLevel: number): OpenSeadragon.Rect;
export declare function addSvgOverlay(viewer: any, svgString: string, configOptions: OverlayOptions, scale: number, overlaySelector: string): void;
export declare function svg_handleElementNode(child: any, configOptions: OverlayOptions, scale: number): any;
export declare const parseImageBody: (body: IIIFExternalWebResource) => {
	uri: string | undefined;
	imageType: OpenSeadragonImageTypes;
};
export declare const parseSrc: (src: string, isTiledImage: boolean) => {
	uri: string;
	imageType: OpenSeadragonImageTypes;
};
export declare function removeOverlaysFromViewer(viewer: OpenSeadragon.Viewer, overlaySelector: string): void;
export declare function panToTarget(openSeadragonViewer: any, zoomLevel: any, target: any, canvas: any): void;

export {};
