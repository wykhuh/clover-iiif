import { createManifest } from "./create_manifest";

describe("createManifest", () => {
  it("foo", () => {
    const id = 123;
    const issueData = [
      {
        id: 10,
        date: "1909-01-01T06:00:00.000Z",
        width: 1000,
        height: 1001,
      },
      {
        id: 11,
        date: "1909-01-01T06:00:00.000Z",
        width: 1100,
        height: 1101,
      },
      {
        id: 12,
        date: "1909-01-01T06:00:00.000Z",
        width: 1200,
        height: 1201,
      },
      {
        id: 13,
        date: "1909-01-01T06:00:00.000Z",
        width: 1300,
        height: 1301,
      },
      {
        id: 14,
        date: "1909-01-01T06:00:00.000Z",
        width: 1400,
        height: 1401,
      },
      {
        id: 15,
        date: "1909-01-01T06:00:00.000Z",
        width: 1500,
        height: 1501,
      },
      {
        id: 16,
        date: "1909-01-01T06:00:00.000Z",
        width: 1600,
        height: 1601,
      },
      {
        id: 17,
        date: "1909-01-01T06:00:00.000Z",
        width: 1700,
        height: 1701,
      },
    ];
    const coordinatesByPage = {
      "10": {
        RAPIDS: [
          [10, 11, 12, 13, 14],
          [15, 16, 17, 18, 19],
        ],
        "Rapids.": [[20, 21, 22, 23, 24]],
      },
      "11": {
        rapids: [[10, 11, 12, 13, 14]],
      },
      "13": {
        rapids: [[10, 11, 12, 13, 14]],
      },
      "14": {
        rapids: [[10, 11, 12, 13, 14]],
      },
      "15": {
        rapids: [[10, 11, 12, 13, 14]],
      },
      "16": {
        rapids: [[10, 11, 12, 13, 14]],
      },
      "17": {
        rapids: [[10, 11, 12, 13, 14]],
      },
    };
    const res = createManifest(id, issueData, coordinatesByPage);
    const expected = {
      "@context": "http://iiif.io/api/presentation/3/context.json",

      id: "http://localhost:3000/api/details/123",
      items: [
        {
          height: 1001,
          id: "page-1",
          items: [
            {
              id: "annotation-page-1",
              items: [
                {
                  body: {
                    format: "image/jpeg",
                    id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/5/8509_ca_object_representation_multifiles_media_119598_page_preview.jpg",
                    service: {
                      id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:1",
                      profile: "level1",
                      type: "ImageService3",
                    },
                    type: "Image",
                  },
                  id: "annotation-page-painting-1",
                  motivation: "painting",
                  target: "page-1",
                },
              ],
              type: "AnnotationPage",
            },
          ],
          label: {
            en: ["Page 1"],
          },
          type: "Canvas",
          width: 1000,
          annotations: [
            {
              id: "annotation_0",
              type: "AnnotationPage",
              items: [
                {
                  id: "annotation_0-0",
                  type: "Annotation",
                  label: {
                    en: ["Search results"],
                  },
                  motivation: "highlighting",
                  body: {
                    type: "TextualBody",
                    format: "text/plain",
                    language: "en",
                    value: "RAPIDS",
                  },
                  target: "page-10#xywh=13,14,12,11",
                },
                {
                  id: "annotation_0-1",
                  type: "Annotation",
                  label: {
                    en: ["Search results"],
                  },
                  motivation: "highlighting",
                  body: {
                    type: "TextualBody",
                    format: "text/plain",
                    language: "en",
                    value: "RAPIDS",
                  },
                  target: "page-10#xywh=18,19,17,16",
                },
                {
                  id: "annotation_0-2",
                  type: "Annotation",
                  label: {
                    en: ["Search results"],
                  },
                  motivation: "highlighting",
                  body: {
                    type: "TextualBody",
                    format: "text/plain",
                    language: "en",
                    value: "Rapids.",
                  },
                  target: "page-1#xywh=21, 22, 23, 24",
                },
              ],
            },
          ],
        },
      ],
      label: {
        en: "Grand Rapids Herald ${issueData.date}",
      },
      metadata: [
        {
          label: {
            en: ["type"],
          },
          value: {
            en: ["Newspaper", "Newspaper Issue"],
          },
        },
        {
          label: {
            en: ["language"],
          },
          value: {
            en: ["English"],
          },
        },
      ],
      navDate: "1909-01-01T06:00:00.000Z",
      thumbnail: [
        {
          format: "image/jpeg",
          id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/3/8/4/38837_ca_object_representations_media_38410_small.jpg",
          type: "Image",
        },
      ],
      type: "Manifest",
    };

    expect(res).toStrictEqual(expected);
  });
});
