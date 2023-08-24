import {
  AboutContent,
  AboutStyled,
} from "src/components/Viewer/Navigator/About/About.styled";
import {
  Homepage,
  Id,
  Metadata,
  RequiredStatement,
  Rights,
  SeeAlso,
  Summary,
  Thumbnail,
} from "src/components/Viewer/Properties";
import {
  IIIFExternalWebResource,
  ManifestNormalized,
} from "@iiif/presentation-3";
import { PrimitivesExternalWebResource } from "src/types/primitives";
import React, { useEffect, useState } from "react";
import { useViewerState } from "src/context/viewer-context";

const About: React.FC = () => {
  const viewerState: any = useViewerState();
  const { activeManifest, vault } = viewerState;

  const [manifest, setManifest] = useState<ManifestNormalized>();

  const [homepage, setHomepage] = useState<IIIFExternalWebResource[]>([]);
  const [seeAlso, setSeeAlso] = useState<IIIFExternalWebResource[]>([]);
  const [thumbnail, setThumbnail] = useState<IIIFExternalWebResource[]>([]);

  useEffect(() => {
    const data = vault.get(activeManifest);
    setManifest(data);

    if (data.homepage?.length > 0) setHomepage(vault.get(data.homepage));
    if (data.seeAlso?.length > 0) setSeeAlso(vault.get(data.seeAlso));
    if (data.thumbnail?.length > 0) setThumbnail(vault.get(data.thumbnail));
  }, [activeManifest, vault]);

  if (!manifest) return <></>;

  return (
    <AboutStyled>
      <AboutContent>
        <Thumbnail thumbnail={thumbnail} label={manifest.label} />
        <Summary summary={manifest.summary} />
        <Metadata metadata={manifest.metadata} />
        <RequiredStatement requiredStatement={manifest.requiredStatement} />
        <Rights rights={manifest.rights} />
        <Homepage
          homepage={homepage as unknown as PrimitivesExternalWebResource[]}
        />
        <SeeAlso
          seeAlso={seeAlso as unknown as PrimitivesExternalWebResource[]}
        />
        <Id id={manifest.id} htmlLabel="IIIF Manifest" />
      </AboutContent>
    </AboutStyled>
  );
};

export default About;