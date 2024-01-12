import { Vault } from "@iiif/vault";
import { getAnnotationResources } from "./getAnnotationResources";
import {
  multipleHighlighting,
  simpleAnnotations,
  simpleTagging,
  nonRectangularPolygon,
  imagesAnnotations,
  referencedAnnotations,
} from "src/fixtures/use-iiif/get-annotation-resources";
import {
  manifestNoAnnotations,
  vttManifest,
} from "src/fixtures/use-iiif/get-supplementing-resources";

describe("getAnnotationResources method", () => {
  it("processes manifest with simple annotations", async () => {
    const vault = new Vault();
    await vault.loadManifest(simpleAnnotations);

    const result = await getAnnotationResources(
      vault,
      simpleAnnotations.items[0].id,
    );

    const expected = [
      {
        id: "Annotation",
        label: {
          en: ["Annotation"],
        },
        motivation: "commenting",
        items: [
          {
            body: {
              format: "text/plain",
              id: "vault://929e073a",
              language: "de",
              type: "TextualBody",
              value: "Göttinger Marktplatz mit Gänseliesel Brunnen",
            },
            target:
              "https://iiif.io/api/cookbook/recipe/0266-full-canvas-annotation/canvas-1",
          },
        ],
      },
    ];

    expect(result).toStrictEqual(expected);
  });

  it("processes manifest with simple tagging annotations", async () => {
    const vault = new Vault();
    await vault.loadManifest(simpleTagging);

    const result = await getAnnotationResources(
      vault,
      simpleTagging.items[0].id,
    );

    const expected = [
      {
        id: "Annotation",
        label: {
          en: ["Annotation"],
        },
        motivation: "tagging",
        items: [
          {
            body: {
              format: "text/plain",
              id: "vault://605b9d93",
              language: "de",
              type: "TextualBody",
              value: "Gänseliesel-Brunnen",
            },
            target:
              "https://iiif.io/api/cookbook/recipe/0021-tagging/canvas/p1#xywh=265,661,1260,1239",
          },
        ],
      },
    ];
    expect(result).toStrictEqual(expected);
  });

  it("processes manifest with non-rectangular polygon annotations", async () => {
    const vault = new Vault();
    await vault.loadManifest(nonRectangularPolygon);

    const result = await getAnnotationResources(
      vault,
      nonRectangularPolygon.items[0].id,
    );

    const expected = [
      {
        id: "Annotation",
        label: {
          en: ["Annotation"],
        },
        motivation: "tagging",
        items: [
          {
            body: {
              format: "text/plain",
              id: "vault://605b9d93",
              language: "de",
              type: "TextualBody",
              value: "Gänseliesel-Brunnen",
            },
            target: {
              selector: {
                type: "SvgSelector",
                value:
                  "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><path d='M270.000000,1900.000000 L1530.000000,1900.000000 L1530.000000,1610.000000 L1315.000000,1300.000000 L1200.000000,986.000000 L904.000000,661.000000 L600.000000,986.000000 L500.000000,1300.000000 L270,1630 L270.000000,1900.000000' /></g></svg>",
              },
              source:
                "https://iiif.io/api/cookbook/recipe/0261-non-rectangular-commenting/canvas/p1",
              type: "SpecificResource",
            },
          },
        ],
      },
    ];
    expect(result).toStrictEqual(expected);
  });

  it("processes manifest with multiple highlighting annotations", async () => {
    const vault = new Vault();
    await vault.loadManifest(multipleHighlighting);

    const result = await getAnnotationResources(
      vault,
      multipleHighlighting.items[0].id,
    );

    const expected = [
      {
        id: "Search results",
        label: {
          en: ["Search results"],
        },
        motivation: "highlighting",
        items: [
          {
            body: {
              format: "text/plain",
              id: "vault://772e4338",
              language: "de",
              type: "TextualBody",
              value: "Berliner",
            },
            target:
              "https://wykhuh.github.io/newspaper-manifest/canvas/i1p1#xywh=839,3259,118,27",
          },
          {
            body: {
              format: "text/plain",
              id: "vault://772e4338",
              language: "de",
              type: "TextualBody",
              value: "Berliner",
            },
            target:
              "https://wykhuh.github.io/newspaper-manifest/canvas/i1p1#xywh=161,459,1063,329",
          },
          {
            body: {
              format: "text/plain",
              id: "vault://772e4338",
              language: "de",
              type: "TextualBody",
              value: "Berliner",
            },
            target:
              "https://wykhuh.github.io/newspaper-manifest/canvas/i1p1#xywh=1942,1579,106,23",
          },
          {
            body: {
              format: "text/plain",
              id: "vault://64b23806",
              language: "de",
              type: "TextualBody",
              value: "„Berliner",
            },
            target:
              "https://wykhuh.github.io/newspaper-manifest/canvas/i1p1#xywh=1608,4429,123,25",
          },
        ],
      },
    ];
    expect(result).toStrictEqual(expected);
  });

  it("processes manifest with images in the annotations", async () => {
    const vault = new Vault();
    await vault.loadManifest(imagesAnnotations);

    const result = await getAnnotationResources(
      vault,
      imagesAnnotations.items[0].id,
    );

    const expected = [
      {
        id: "Annotation",
        items: [
          {
            body: [
              {
                format: "image/jpeg",
                id: "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-fountain/full/300,/0/default.jpg",
                type: "Image",
              },
              {
                id: "vault://69cc99ce",
                language: "en",
                type: "TextualBody",
                value:
                  "Night picture of the Gänseliesel fountain in Göttingen taken during the 2019 IIIF Conference",
              },
            ],
            target:
              "https://iiif.io/api/cookbook/recipe/0377-image-in-annotation/canvas-1#xywh=138,550,1477,1710",
          },
        ],
        label: {
          en: ["Annotation"],
        },
        motivation: "commenting",
      },
    ];
    expect(result).toStrictEqual(expected);
  });

  it("process manifest with referenced annotation page", async () => {
    const vault = new Vault();
    await vault.loadManifest(referencedAnnotations);

    const result = await getAnnotationResources(
      vault,
      referencedAnnotations.items[0].id,
    );

    const expected = [
      {
        id: "Annotation",
        items: [
          {
            body: {
              format: "text/plain",
              id: "vault://929e073a",
              language: "de",
              type: "TextualBody",
              value: "Göttinger Marktplatz mit Gänseliesel Brunnen",
            },
            target:
              "https://iiif.io/api/cookbook/recipe/0269-embedded-or-referenced-annotations/canvas-1",
          },
        ],
        label: {
          en: ["Annotation"],
        },
        motivation: "commenting",
      },
    ];
    expect(result).toStrictEqual(expected);
  });

  it("returns an empty array if there are no annotations", async () => {
    const vault = new Vault();
    await vault.loadManifest(manifestNoAnnotations);

    const result = await getAnnotationResources(
      vault,
      manifestNoAnnotations.items[0].id,
    );

    expect(result).toHaveLength(0);
  });

  it("returns an empty array if manifest has VTT", async () => {
    const vault = new Vault();
    await vault.loadManifest(vttManifest);

    const result = await getAnnotationResources(vault, vttManifest.items[0].id);

    expect(result).toHaveLength(0);
  });
});
