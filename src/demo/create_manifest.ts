import { type MysqlIssueDetails } from "src/demo/mysql_utils";
import { type TextCoordinates } from "src/demo/page_files_utils";

export function createSearchResultsAnnotation(pageId, coordinatesData) {
  const filteredCoordinatesData = coordinatesData[pageId];
  if (!filteredCoordinatesData) {
    return [];
  }

  const annotation = {
    id: "annotation_" + pageId,
    type: "AnnotationPage",
    items: [] as any,
  };

  Object.keys(filteredCoordinatesData).forEach((text, i) => {
    filteredCoordinatesData[text].forEach((coordinate, j) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_stringId, h, w, y, x] = coordinate;
      const target = `${x},${y},${w},${h}`;
      annotation.items.push({
        id: `annotation_${pageId}_${i}_${j}`,
        type: "Annotation",
        label: {
          en: ["Search results"],
        },
        motivation: "highlighting",
        body: {
          type: "TextualBody",
          format: "text/plain",
          language: "en",
          value: `${text} (${target})`,
        },
        target: `page-${pageId}#xywh=${target}`,
      });
    });
  });

  return [annotation];
}

export function editBaseManifest(
  baseManifest: any,
  issue_id: number,
  searchTerm: string,
  issuePagesGroupedByPageOrder: { [k: number]: MysqlIssueDetails },
  coordinatesByPageId: { [k: number]: TextCoordinates },
) {
  baseManifest.id = `${process.env.NEXT_PUBLIC_API_BASE}manifests/${issue_id}?q=${searchTerm}`;

  baseManifest.label.en = baseManifest.label.en + ` (id: ${issue_id})`;

  const newItems = baseManifest.items.map((item, i) => {
    const pageOrder = Number(item.id.split("-")[1]);
    const page = issuePagesGroupedByPageOrder[pageOrder];
    baseManifest.items[i].width = page.width;
    baseManifest.items[i].height = page.height;

    return {
      ...item,
      annotations: createSearchResultsAnnotation(page.id, coordinatesByPageId),
    };
  });

  baseManifest.items = newItems;

  return baseManifest;
}
