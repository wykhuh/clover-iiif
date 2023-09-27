import type { NextApiRequest, NextApiResponse } from "next";

// Just a local example... the WEBVTT content would be hosted as its own .vtt file
// similar to the subtitles/captions .vtt file
const vttContent = `
WEBVTT

00:01.100 --> 00:02.400
Clip Link #1

00:05.000 --> 00:12.400
Circular movement begins

00:14.000 --> 00:16.000
A spin

00:32.000 --> 00:42.000
Break

00:43.000 --> 00:51.000
Jumping for Joy
`;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(vttContent);
}
