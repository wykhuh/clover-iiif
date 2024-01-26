import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { getContentSearchResources } from "src/hooks/use-iiif";
import {
  LabeledContentSearchResource,
  formatCanvasLabelObj,
} from "src/hooks/use-iiif/getAnnotationResources";
import { ManifestNormalized } from "@iiif/presentation-3";
import { ViewerContextStore, useViewerState } from "src/context/viewer-context";

type Props = {
  searchServiceUrl?: string;
  setContentSearchResource: React.Dispatch<
    React.SetStateAction<LabeledContentSearchResource | undefined>
  >;
  activeCanvas: string;
};

const SearchContent: React.FC<Props> = ({
  searchServiceUrl,
  setContentSearchResource,
}) => {
  const [searchTerms, setSearchTerms] = useState<string | undefined>();
  const viewerState: ViewerContextStore = useViewerState();
  const { vault, openSeadragonViewer, activeManifest } = viewerState;

  const manifest: ManifestNormalized = vault.get({
    id: activeManifest,
    type: "Manifest",
  });
  const canvasLabelObj = formatCanvasLabelObj(vault, manifest);

  async function searchSubmitHandler(e) {
    e.preventDefault();

    if (!openSeadragonViewer) return;
    if (!searchTerms) return;
    if (searchTerms.trim() === "") return;

    // connect to content search service
    const url = searchServiceUrl + "?q=" + searchTerms.trim();
    const res = await fetch(url);
    const searchManifest = await res.json();

    // set contentSearchResource
    getContentSearchResources(searchManifest, canvasLabelObj)
      .then((resources) => {
        setContentSearchResource(resources);
      })
      .catch((err) => console.log(err));
  }

  const handleChange = (e: any) => {
    e.preventDefault();
    setSearchTerms(e.target.value);
  };

  return (
    <div>
      <Form.Root onSubmit={searchSubmitHandler}>
        <Form.Field name="searchTerms" onChange={handleChange}>
          <Form.Label>Search</Form.Label>
          <Form.Control
            placeholder="Search"
            className="nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current"
          />
        </Form.Field>
        <Form.Submit />
      </Form.Root>
    </div>
  );
};

export default SearchContent;
