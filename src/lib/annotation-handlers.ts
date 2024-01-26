import OpenSeadragon from "openseadragon";
import { type CanvasNormalized } from "@iiif/presentation-3";

export function zoomToXYWHTarget(
  target: string,
  zoomLevel: number,
  canvas: CanvasNormalized,
  openSeadragonViewer: OpenSeadragon.Viewer,
) {
  if (!target.includes("#xywh=")) return;

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

export function zoomToPointTarget(
  target: any,
  zoomLevel: number,
  canvas: CanvasNormalized,
  openSeadragonViewer: OpenSeadragon.Viewer,
) {
  const scale = 1 / canvas.width;
  const x = target.selector.x;
  const y = target.selector.y;
  const w = 40;
  const h = 40;
  const rect = new OpenSeadragon.Rect(
    x * scale - (w / 2) * scale * zoomLevel,
    y * scale - (h / 2) * scale * zoomLevel,
    w * scale * zoomLevel,
    h * scale * zoomLevel,
  );

  openSeadragonViewer.viewport.fitBounds(rect);
}
