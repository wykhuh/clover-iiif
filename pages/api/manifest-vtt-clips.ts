import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    "@context": "http://iiif.io/api/presentation/3/context.json",
    id: "http://localhost:3000/api/manifest-vtt-clips",
    type: "Manifest",
    label: { none: [] },
    metadata: [],
    items: [
      {
        id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254",
        type: "Canvas",
        label: { none: [""] },
        width: 13016,
        height: 8494,
        thumbnail: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/96671_ca_object_representations_media_254_thumbnail.jpg",
            type: "Image",
            format: "image/jpeg",
            width: 120,
            height: 78,
          },
        ],
        items: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254-item-page",
            type: "AnnotationPage",
            items: [
              {
                id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254-annotation",
                type: "Annotation",
                motivation: "painting",
                target:
                  "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254",
                body: {
                  id: "https://seagate.whirl-i-gig.com/admin/service.php/IIIF/representation:254:1/full/max/0/default.jpg",
                  type: "Image",
                  format: "image/tiff",
                  width: 13016,
                  height: 8494,
                  service: [
                    {
                      id: "https://seagate.whirl-i-gig.com/admin/service.php/IIIF/representation:254:1",
                      type: "ImageService2",
                      profile: 'http://iiif.io/api/image/2/level2.json"',
                    },
                  ],
                },
              },
            ],
          },
        ],
        annotations: [],
        placeholderCanvas: {
          id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254-placeholder",
          type: "Canvas",
          width: 400,
          height: 261,
          items: [
            {
              id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254-placeholder-annotation-page",
              type: "AnnotationPage",
              items: [
                {
                  id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254-placeholder-annotation",
                  type: "Annotation",
                  motivation: "painting",
                  body: {
                    id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/9302_ca_object_representations_media_254_medium.jpg",
                    type: "Image",
                    format: "image/jpeg",
                    width: 400,
                    height: 261,
                  },
                  target:
                    "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-254-placeholder",
                },
              ],
            },
          ],
        },
      },
      {
        id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253",
        type: "Canvas",
        label: { none: [""] },
        width: "640",
        height: "480",
        duration: 71,
        thumbnail: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/17419_ca_object_representations_media_253_thumbnail.jpg",
            type: "Image",
            format: "image/jpeg",
            width: 120,
            height: 90,
          },
        ],
        items: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-item-page",
            type: "AnnotationPage",
            items: [
              {
                id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-annotation",
                type: "Annotation",
                motivation: "painting",
                target:
                  "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253",
                body: {
                  id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/quicktime/2/78426_ca_object_representations_media_253_original.m4v",
                  type: "Video",
                  format: "video/mp4",
                  width: "640",
                  height: "480",
                  duration: 71,
                },
              },
            ],
          },
        ],
        annotations: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-annotation-subtitles-3",
            type: "AnnotationPage",
            items: [
              {
                id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-annotation-subtitles-vtt-3",
                type: "Annotation",
                motivation: "supplementing",
                body: {
                  id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/workspace/0/34451_ca_object_representation_captions_caption_file_3.vtt",
                  type: "Text",
                  format: "text/vtt",
                  label: { en: ["Subtitles"] },
                  language: "en",
                },
                target:
                  "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253",
              },
              {
                id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-annotation-vtt-clips-json-3",
                type: "Annotation",
                motivation: "supplementing",
                body: {
                  id: "http://localhost:3000/api/vtt-clips",
                  type: "Text",
                  format: "text/vtt",
                  label: { en: ["Clips"] },
                  language: "en",
                },
                target:
                  "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253",
              },
            ],
          },
        ],
        placeholderCanvas: {
          id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-placeholder",
          type: "Canvas",
          width: 400,
          height: 300,
          items: [
            {
              id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-placeholder-annotation-page",
              type: "AnnotationPage",
              items: [
                {
                  id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-placeholder-annotation",
                  type: "Annotation",
                  motivation: "painting",
                  body: {
                    id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/47665_ca_object_representations_media_253_medium.jpg",
                    type: "Image",
                    format: "image/jpeg",
                    width: 400,
                    height: 300,
                  },
                  target:
                    "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-253-placeholder",
                },
              ],
            },
          ],
        },
      },
      {
        id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255",
        type: "Canvas",
        label: { none: [""] },
        width: 612,
        height: 792,
        thumbnail: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/47694_ca_object_representations_media_255_thumbnail.jpg",
            type: "Image",
            format: "image/jpeg",
            width: 93,
            height: 120,
          },
        ],
        items: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255-item-page",
            type: "AnnotationPage",
            items: [
              {
                id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255-annotation",
                type: "Annotation",
                motivation: "painting",
                target:
                  "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255",
                body: {
                  id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/17015_ca_object_representations_media_255_original.pdf",
                  type: "Text",
                  format: "application/pdf",
                  width: 612,
                  height: 792,
                },
              },
            ],
          },
        ],
        annotations: [],
        placeholderCanvas: {
          id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255-placeholder",
          type: "Canvas",
          width: 310,
          height: 400,
          items: [
            {
              id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255-placeholder-annotation-page",
              type: "AnnotationPage",
              items: [
                {
                  id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255-placeholder-annotation",
                  type: "Annotation",
                  motivation: "painting",
                  body: {
                    id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/28852_ca_object_representations_media_255_medium.jpg",
                    type: "Image",
                    format: "image/jpeg",
                    width: 310,
                    height: 400,
                  },
                  target:
                    "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-255-placeholder",
                },
              ],
            },
          ],
        },
      },
      {
        id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257",
        type: "Canvas",
        label: { none: [""] },
        width: 3810,
        height: 5121,
        thumbnail: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/51435_ca_object_representations_media_257_thumbnail.jpg",
            type: "Image",
            format: "image/jpeg",
            width: 89,
            height: 120,
          },
        ],
        items: [
          {
            id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257-item-page",
            type: "AnnotationPage",
            items: [
              {
                id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257-annotation",
                type: "Annotation",
                motivation: "painting",
                target:
                  "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257",
                body: {
                  id: "https://seagate.whirl-i-gig.com/admin/service.php/IIIF/representation:257:1/full/max/0/default.jpg",
                  type: "Image",
                  format: "image/jpeg",
                  width: 3810,
                  height: 5121,
                  service: [
                    {
                      id: "https://seagate.whirl-i-gig.com/admin/service.php/IIIF/representation:257:1",
                      type: "ImageService2",
                      profile: 'http://iiif.io/api/image/2/level2.json"',
                    },
                  ],
                },
              },
            ],
          },
        ],
        annotations: [],
        placeholderCanvas: {
          id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257-placeholder",
          type: "Canvas",
          width: 298,
          height: 400,
          items: [
            {
              id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257-placeholder-annotation-page",
              type: "AnnotationPage",
              items: [
                {
                  id: "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257-placeholder-annotation",
                  type: "Annotation",
                  motivation: "painting",
                  body: {
                    id: "https://seagate.whirl-i-gig.com/admin/media/collectiveaccess/images/2/94140_ca_object_representations_media_257_medium.jpg",
                    type: "Image",
                    format: "image/jpeg",
                    width: 298,
                    height: 400,
                  },
                  target:
                    "https://seagate.whirl-i-gig.com/admin/service/IIIF/manifest/ca_objects:170-257-placeholder",
                },
              ],
            },
          ],
        },
      },
    ],
  });
}
