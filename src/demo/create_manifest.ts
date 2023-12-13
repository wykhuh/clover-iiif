function createAnnotation(pageData, coordinatesData) {
  const data = [] as any;

  if (!coordinatesData[pageData]) {
    return [];
  }

  Object.keys(coordinatesData[pageData]).forEach((text, i) => {
    const annotation = {
      id: "annotation_" + i,
      type: "AnnotationPage",
      items: [] as any,
    };
    coordinatesData[pageData][text].forEach((coordinate, j) => {
      const [_stringId, h, w, x, y] = coordinatesData[pageData][text][j];
      const target = `${x},${y},${w},${h}`;
      annotation.items.push({
        id: "annotation_" + i + "_" + j,
        type: "Annotation",
        label: {
          en: ["Search results"],
        },
        motivation: "highlighting",
        body: {
          type: "TextualBody",
          format: "text/plain",
          language: "en",
          value: text,
        },
        target: `page-${pageData}#xywh=${target}`,
      });
    });
    data.push(annotation);
  });

  return data;
}

export function createManifest(manifestId, issueData, coordinatesByPage) {
  const issueDate = issueData[0].date.toISOString().split("T")[0];
  const manifest = {
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id: `http://localhost:3000/api/details/${manifestId}`,
    type: "Manifest",
    label: {
      en: `Grand Rapids Herald ${issueDate}`,
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
    thumbnail: [
      {
        id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/3/8/4/38837_ca_object_representations_media_38410_small.jpg",
        type: "Image",
        format: "image/jpeg",
      },
    ],
    navDate: issueDate,
    items: [
      {
        id: "page-1",
        type: "Canvas",
        label: {
          en: ["Page 1"],
        },
        width: issueData[0].width,
        height: issueData[0].height,
        items: [
          {
            id: "annotation-page-1",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-1",
                target: "page-1",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/5/8509_ca_object_representation_multifiles_media_119598_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:1",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],

        annotations: createAnnotation(issueData[0].id, coordinatesByPage),
      },
      {
        id: "page-2",
        type: "Canvas",
        label: {
          en: ["Page 2"],
        },
        width: issueData[1].width,
        height: issueData[1].height,
        items: [
          {
            id: "annotation-page-2",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-2",
                target: "page-2",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/5/73740_ca_object_representation_multifiles_media_119599_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:2",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],
        annotations: createAnnotation(
          issueData[1].id,
          coordinatesByPage,
        ),
      },
      {
        id: "page-3",
        type: "Canvas",
        label: {
          en: ["Page 3"],
        },
        width: issueData[2].width,
        height: issueData[2].height,
        items: [
          {
            id: "annotation-page-3",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-3",
                target: "page-3",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/6/45358_ca_object_representation_multifiles_media_119600_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:3",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],
        annotations: createAnnotation(
          issueData[2].id,
          coordinatesByPage,
        ),
      },
      {
        id: "page-4",
        type: "Canvas",
        label: {
          en: ["Page 4"],
        },
        width: issueData[3].width,
        height: issueData[3].height,
        items: [
          {
            id: "annotation-page-4",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-4",
                target: "page-4",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/6/49912_ca_object_representation_multifiles_media_119601_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:4",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],
        annotations: createAnnotation(
          issueData[3].id,
          coordinatesByPage,
        ),
      },
      {
        id: "page-5",
        type: "Canvas",
        label: {
          en: ["Page 5"],
        },
        width: issueData[4].width,
        height: issueData[4].height,
        items: [
          {
            id: "annotation-page-5",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-5",
                target: "page-5",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/6/93849_ca_object_representation_multifiles_media_119602_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:5",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],
        annotations: createAnnotation(
          issueData[4].id,
          coordinatesByPage,
        ),
      },
      {
        id: "page-6",
        type: "Canvas",
        label: {
          en: ["Page 6"],
        },
        width: issueData[5].width,
        height: issueData[5].height,
        items: [
          {
            id: "annotation-page-6",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-6",
                target: "page-6",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/6/6585_ca_object_representation_multifiles_media_119603_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:6",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],
        annotations: createAnnotation(
          issueData[5].id,
          coordinatesByPage,
        ),
      },
      {
        id: "page-7",
        type: "Canvas",
        label: {
          en: ["Page 7"],
        },
        width: issueData[6].width,
        height: issueData[6].height,
        items: [
          {
            id: "annotation-page-7",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-7",
                target: "page-7",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/6/65983_ca_object_representation_multifiles_media_119604_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:7",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],
        annotations: createAnnotation(
          issueData[6].id,
          coordinatesByPage,
        ),
      },
      {
        id: "page-8",
        type: "Canvas",
        label: {
          en: ["Page 8"],
        },
        width: issueData[7].width,
        height: issueData[7].height,
        items: [
          {
            id: "annotation-page-8",
            type: "AnnotationPage",
            items: [
              {
                id: "annotation-page-painting-8",
                target: "page-8",
                motivation: "painting",
                body: {
                  id: "https://grpl.whirl-i-gig.com/admin/media/collectiveaccess/images/1/1/9/6/49357_ca_object_representation_multifiles_media_119605_page_preview.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  service: {
                    id: "https://grpl.whirl-i-gig.com/admin/service.php/IIIF/representation:38410:8",
                    type: "ImageService3",
                    profile: "level1",
                  },
                },
              },
            ],
          },
        ],
        annotations: createAnnotation(
          issueData[7].id,
          coordinatesByPage,
        ),
      },
    ],
  };

  return manifest;
}
