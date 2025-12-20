import app from "@/lib/config/app.config";
import { BASE_URL } from "@/lib/config/env.config";

/**
 * Create meta tags.
 */
const createMetaTags = ({
  title: _title,
  description: _description,
  url: _url,
  keywords,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
} = {}) => {
  const title = _title ? `${_title} | ${app.name}` : app.name,
    description = _description ?? app.description,
    url = _url ?? BASE_URL;

  const tags = [
    { title: title },
    {
      name: "description",
      content: description,
    },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    {
      name: "twitter:description",
      content: description,
    },
    { name: "twitter:creator", content: "@omnidotdev" },
    { name: "twitter:url", content: url },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    {
      name: "og:description",
      content: description,
    },
    { name: "og:url", content: url },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
          { name: "og:image:width", content: "1200" },
          { name: "og:image:height", content: "630" },
        ]
      : [
          { name: "twitter:image", content: `${BASE_URL}/runa_og.png` },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: `${BASE_URL}/runa_og.png` },
          { name: "og:image:width", content: "1200" },
          { name: "og:image:height", content: "630" },
        ]),
  ];

  return tags;
};

export default createMetaTags;
