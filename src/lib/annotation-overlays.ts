import {
  type CanvasNormalized,
  SvgSelector,
  PointSelector,
} from "@iiif/presentation-3";
import OpenSeadragon from "openseadragon";
import { type ViewerConfigOptions } from "src/context/viewer-context";
import { OsdSvgOverlay } from "src/lib/openseadragon-svg";

import { type FormattedAnnotationItem } from "src/hooks/use-iiif/getAnnotationResources";

export function addOverlaysToViewer(
  viewer: OpenSeadragon.Viewer,
  canvas: CanvasNormalized,
  configOptions: ViewerConfigOptions,
  items: FormattedAnnotationItem[],
  overlaySelector: string,
): void {
  if (!viewer) return;
  if (!canvas) return;

  const scale = 1 / canvas.width;

  items.forEach((item) => {
    if (typeof item.target === "string") {
      if (item.target.includes("#xywh=")) {
        handleXywhString(
          item.target,
          viewer,
          configOptions,
          scale,
          overlaySelector,
        );
      }
    } else if (item.target && item.target.type === "SpecificResource") {
      const selector = item.target.selector;
      if (typeof selector === "object" && !Array.isArray(selector)) {
        if (selector.type === "PointSelector") {
          handlePointSelector(
            selector,
            viewer,
            configOptions,
            scale,
            overlaySelector,
          );
        } else if (selector.type === "SvgSelector") {
          handleSvgSelector(
            selector,
            viewer,
            configOptions,
            scale,
            overlaySelector,
          );
        }
      }
    }
  });
}

function handleXywhString(
  target: string,
  viewer: OpenSeadragon.Viewer,
  configOptions: ViewerConfigOptions,
  scale: number,
  overlaySelector: string,
): void {
  const parts = target.split("#xywh=");
  if (parts && parts[1]) {
    const [x, y, w, h] = parts[1].split(",").map((value) => Number(value));

    addRectangularOverlay(
      viewer,
      x * scale,
      y * scale,
      w * scale,
      h * scale,
      configOptions,
      overlaySelector,
    );
  }
}

function handlePointSelector(
  selector: PointSelector,
  viewer: OpenSeadragon.Viewer,
  configOptions: ViewerConfigOptions,
  scale: number,
  overlaySelector: string,
): void {
  const x = selector.x;
  const y = selector.y;

  const svg = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${x}" cy="${y}" r="20" />
    </svg>
  `;

  addSvgOverlay(viewer, svg, configOptions, scale, overlaySelector);
}

function handleSvgSelector(
  selector: SvgSelector,
  viewer: OpenSeadragon.Viewer,
  configOptions: ViewerConfigOptions,
  scale: number,
  overlaySelector: string,
) {
  if ("id" in selector) return;

  const svgString = selector.value;
  addSvgOverlay(viewer, svgString, configOptions, scale, overlaySelector);
}

function addRectangularOverlay(
  viewer: OpenSeadragon.Viewer,
  x: number,
  y: number,
  w: number,
  h: number,
  configOptions: ViewerConfigOptions,
  overlaySelector: string,
): void {
  const rect = new OpenSeadragon.Rect(x, y, w, h);
  const div = document.createElement("div");

  if (configOptions.annotationOverlays) {
    const { backgroundColor, opacity, borderType, borderColor, borderWidth } =
      configOptions.annotationOverlays;

    div.style.backgroundColor = backgroundColor as string;
    div.style.opacity = opacity as string;
    div.style.border = `${borderType} ${borderWidth} ${borderColor}`;
    div.className = overlaySelector;
  }

  viewer.addOverlay(div, rect);
}

function convertSVGStringToHTML(svgString) {
  if (!svgString) return null;
  const template = document.createElement("template");
  template.innerHTML = svgString.trim();
  const result = template.content.children;

  return result[0];
}

export function addSvgOverlay(
  viewer: any,
  svgString: string,
  configOptions: ViewerConfigOptions,
  scale: number,
  overlaySelector: string,
) {
  const svgEl = convertSVGStringToHTML(svgString);
  if (svgEl) {
    for (const child of svgEl.children) {
      svg_processChild(viewer, child, configOptions, scale, overlaySelector);
    }
  }
}

function svg_processChild(
  viewer: any,
  child: ChildNode,
  configOptions: ViewerConfigOptions,
  scale: number,
  overlaySelector: string,
) {
  if (child.nodeName === "#text") {
    svg_handleTextNode(child);
  } else {
    const newElement = svg_handleElementNode(child, configOptions, scale);
    const overlay = OsdSvgOverlay(viewer);
    overlay.node().append(newElement);
    overlay._svg?.setAttribute("class", overlaySelector);

    // BUG: svg with children elements aren't formated correctly.
    child.childNodes.forEach((child) => {
      svg_processChild(viewer, child, configOptions, scale, overlaySelector);
    });
  }
}

export function svg_handleElementNode(
  child: any,
  configOptions: ViewerConfigOptions,
  scale: number,
) {
  let hasStrokeColor = false;
  let hasStrokeWidth = false;
  let hasFillColor = false;
  let hasFillOpacity = false;

  const newElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    child.nodeName,
  );

  if (child.attributes.length > 0) {
    for (let index = 0; index < child.attributes.length; index++) {
      const element = child.attributes[index];
      switch (element.name) {
        case "fill":
          hasFillColor = true;
          break;
        case "stroke":
          hasStrokeColor = true;
          break;
        case "stroke-width":
          hasStrokeWidth = true;
          break;
        case "fill-opacity":
          hasFillOpacity = true;
          break;
      }
      newElement.setAttribute(element.name, element.textContent);
    }
  }

  if (!hasStrokeColor) {
    newElement.style.stroke = configOptions.annotationOverlays
      ?.borderColor as string;
  }
  if (!hasStrokeWidth) {
    newElement.style.strokeWidth = configOptions.annotationOverlays
      ?.borderWidth as string;
  }
  if (!hasFillColor) {
    newElement.style.fill = configOptions.annotationOverlays
      ?.backgroundColor as string;
  }
  if (!hasFillOpacity) {
    newElement.style.fillOpacity = configOptions.annotationOverlays
      ?.opacity as string;
  }
  newElement.setAttribute("transform", `scale(${scale})`);

  return newElement;
}

function svg_handleTextNode(child: ChildNode) {
  if (!child.textContent) {
    return;
  }
  if (child.textContent.includes("\n")) {
    return;
  }
  console.log(
    "nodeName:",
    child.nodeName,
    ", textContent:",
    child.textContent,
    ", childNodes.length",
    child.childNodes.length,
  );
}

export function removeOverlaysFromViewer(
  viewer: OpenSeadragon.Viewer,
  overlaySelector: string,
) {
  if (!viewer) return;

  if (!overlaySelector.startsWith(".")) {
    overlaySelector = "." + overlaySelector;
  }
  const elements = document.querySelectorAll(overlaySelector);
  if (elements) {
    elements.forEach((element) => viewer.removeOverlay(element));
  }
}
