import { createSearchResultsAnnotation } from "./create_manifest";

describe("createSearchResultsAnnotation", () => {
  it("creates annotation for manifest", () => {
    const id = 10;

    const coordinatesByPage = {
      "10": {
        RAPIDS: [
          [10, 11, 12, 13, 14],
          [15, 16, 17, 18, 19],
          [20, 21, 22, 23, 24],
        ],
      },
      "11": {
        rapids: [[100, 101, 102, 103, 104]],
      },
    };
    const res = createSearchResultsAnnotation(id, coordinatesByPage);

    const expected = [
      {
        id: "annotation_10",
        items: [
          {
            body: {
              format: "text/plain",
              language: "en",
              type: "TextualBody",
              value: "RAPIDS (14,13,12,11)",
            },
            id: "annotation_10_0_0",
            label: {
              en: ["Search results"],
            },
            motivation: "highlighting",
            target: "page-10#xywh=14,13,12,11",
            type: "Annotation",
          },
          {
            body: {
              format: "text/plain",
              language: "en",
              type: "TextualBody",
              value: "RAPIDS (19,18,17,16)",
            },
            id: "annotation_10_0_1",
            label: {
              en: ["Search results"],
            },
            motivation: "highlighting",
            target: "page-10#xywh=19,18,17,16",
            type: "Annotation",
          },
          {
            body: {
              format: "text/plain",
              language: "en",
              type: "TextualBody",
              value: "RAPIDS (24,23,22,21)",
            },
            id: "annotation_10_0_2",
            label: {
              en: ["Search results"],
            },
            motivation: "highlighting",
            target: "page-10#xywh=24,23,22,21",
            type: "Annotation",
          },
        ],
        type: "AnnotationPage",
      },
    ];

    expect(res).toStrictEqual(expected);
  });
});
