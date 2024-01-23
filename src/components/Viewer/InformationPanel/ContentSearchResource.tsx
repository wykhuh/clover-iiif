import React, { useState } from "react";
import { LabeledContentSearchResource } from "src/hooks/use-iiif/getAnnotationResources";
import SearchContentItem from "src/components/Viewer/InformationPanel/ContentSearchItem";
import { List } from "src/components/Viewer/InformationPanel/ContentSearchItem.styled";

type Props = {
  contentSearchResource: LabeledContentSearchResource;
};

export const ContentSearchResource: React.FC<Props> = ({
  contentSearchResource,
}) => {
  const [activeTarget, setActiveTarget] = useState<string | undefined>();

  return (
    <div>
      {Object.entries(contentSearchResource.items).map(
        ([label, annotations], i) => (
          <List key={i}>
            {label}
            {annotations &&
              annotations.map((annotation, i) => (
                <SearchContentItem
                  key={i}
                  item={annotation}
                  activeTarget={activeTarget}
                  setActiveTarget={setActiveTarget}
                />
              ))}
          </List>
        ),
      )}
    </div>
  );
};

export default ContentSearchResource;
