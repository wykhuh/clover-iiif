import { styled } from "src/styles/stitches.config";

export const List = styled("ol", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  listStyle: "auto",
  margin: "0.5rem 1.618rem",
});

export const Item = styled("li", {
  position: "relative",
  cursor: "pointer",
  lineHeight: "1.5em",
  margin: "0 1.618rem",

  "&:hover": {
    backgroundColor: "$secondaryMuted",
  },
});

export const Message = styled("div", {
  margin: "0 1.618rem",
});
