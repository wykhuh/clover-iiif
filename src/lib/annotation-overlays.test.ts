import { addOverlaysToViewer } from "./annotation-overlays";
import { LabeledAnnotationedResource } from "src/hooks/use-iiif/getAnnotationResources";
import { afterEach, describe, expect, it, vi, Mock } from "vitest";
import { type CanvasNormalized, SpecificResource } from "@iiif/presentation-3";

import { OsdSvgOverlay } from "src/lib/openseadragon-svg";
vi.mock("src/lib/openseadragon-svg");
const mockedOsdSvgOverlay = OsdSvgOverlay as Mock;

describe("addOverlaysToViewer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createAnnotations(
    target1: string | SpecificResource,
  ): LabeledAnnotationedResource[] {
    return [
      {
        id: "Search results",
        label: {
          en: ["Search results"],
        },
        motivation: "highlighting",
        items: [
          {
            target: target1,
            body: {
              id: "1",
              type: "TextualBody",
              format: "text/plain",
              language: "en",
              value: "cat",
            },
          },
        ],
      },
    ];
  }

  const viewer = {
    addOverlay: () => {},
    svgOverlay: () => {
      return {
        node: () => {
          return { append: () => {} };
        },
      };
    },
  } as any;
  const canvas = { width: 10 } as CanvasNormalized;
  const configOptions = {
    annotationOverlays: {
      backgroundColor: "#ff6666",
      borderColor: "#990000",
      borderType: "solid",
      borderWidth: "1px",
      opacity: "0.5",
      renderOverlays: true,
    },
  };

  function createDiv() {
    const div = document.createElement("div");
    const { backgroundColor, opacity, borderType, borderColor, borderWidth } =
      configOptions.annotationOverlays;

    div.style.backgroundColor = backgroundColor as string;
    div.style.opacity = opacity as string;
    div.style.border = `${borderType} ${borderWidth} ${borderColor}`;
    div.setAttribute("class", "overlay");

    return div;
  }

  it("adds a rectangle overlay when target string has #xywh=", () => {
    const spy = vi.spyOn(viewer, "addOverlay");
    const target1 = "https://example.com/1#xywh=100,101,102,103";
    const annotations = createAnnotations(target1);

    annotations.forEach((annotation) => {
      addOverlaysToViewer(
        viewer,
        canvas,
        configOptions,
        annotation.items,
        "overlay",
      );
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]).toEqual([
      createDiv(),
      {
        degrees: 0,
        height: 10.3,
        width: 10.200000000000001,
        x: 10,
        y: 10.100000000000001,
      },
    ]);
  });

  it("does not add overlay when target string does not have #xywh=", () => {
    const spy = vi.spyOn(viewer, "addOverlay");
    const target1 = "https://example.com/1";
    const annotations = createAnnotations(target1);

    annotations.forEach((annotation) => {
      addOverlaysToViewer(
        viewer,
        canvas,
        configOptions,
        annotation.items,
        "overlay",
      );
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("adds a circle overlay when target is PointSelector", async () => {
    const mockDataTable = {
      node: vi.fn().mockReturnThis(),
      append: vi.fn().mockReturnThis(),
    };
    mockedOsdSvgOverlay.mockReturnValueOnce(mockDataTable);

    const target1: SpecificResource = {
      type: "SpecificResource",
      source:
        "https://iiif.io/api/cookbook/recipe/0135-annotating-point-in-canvas/canvas.json",
      selector: {
        type: "PointSelector",
        x: 100,
        y: 101,
      },
    };
    const annotations = createAnnotations(target1);
    const newElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    newElement.setAttribute("cx", "100");
    newElement.setAttribute("cy", "101");
    newElement.setAttribute("r", "20");
    newElement.setAttribute("transform", "scale(0.1)");
    newElement.setAttribute(
      "style",
      "stroke: #990000; stroke-width: 1px; fill: #ff6666; fill-opacity: 0.5;",
    );

    annotations.forEach((annotation) => {
      addOverlaysToViewer(
        viewer,
        canvas,
        configOptions,
        annotation.items,
        "overlay",
      );
    });

    expect(mockedOsdSvgOverlay).toHaveBeenCalledTimes(1);
    expect(mockDataTable.append).toHaveBeenCalledTimes(1);
    expect(mockDataTable.append.mock.calls).toEqual([[newElement]]);
  });

  it("adds a SVG overlay when target is SvgSelector", () => {
    const mockDataTable = {
      node: vi.fn().mockReturnThis(),
      append: vi.fn().mockReturnThis(),
    };
    mockedOsdSvgOverlay.mockReturnValueOnce(mockDataTable);
    const target1: SpecificResource = {
      type: "SpecificResource",
      source:
        "https://iiif.io/api/cookbook/recipe/0261-non-rectangular-commenting/canvas/p1",
      selector: {
        type: "SvgSelector",
        value:
          "<svg xmlns='http://www.w3.org/2000/svg'><rect x='10' y='11' width='12' height='13'/></svg>",
      },
    };
    const annotations = createAnnotations(target1);
    const newElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    newElement.setAttribute("x", "10");
    newElement.setAttribute("y", "11");
    newElement.setAttribute("width", "12");
    newElement.setAttribute("height", "13");
    newElement.setAttribute("transform", "scale(0.1)");
    newElement.setAttribute(
      "style",
      "stroke: #990000; stroke-width: 1px; fill: #ff6666; fill-opacity: 0.5;",
    );

    annotations.forEach((annotation) => {
      addOverlaysToViewer(
        viewer,
        canvas,
        configOptions,
        annotation.items,
        "overlay",
      );
    });

    expect(mockedOsdSvgOverlay).toHaveBeenCalledTimes(1);
    expect(mockDataTable.append).toHaveBeenCalledTimes(1);
    expect(mockDataTable.append.mock.calls).toEqual([[newElement]]);
  });
});
