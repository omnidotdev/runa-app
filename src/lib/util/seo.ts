const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
} = {}) => {
  const tags = [
    { title: title ? `Runa | ${title}` : "Runa" },
    {
      name: "description",
      content: description ?? "A beautiful Kanban board application",
    },
    { name: "keywords", content: keywords },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:creator", content: "@omnidotdev" },
    { name: "og:type", content: "website" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },
    ...(image
      ? [
          { name: "twitter:image", content: image },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "og:image", content: image },
        ]
      : []),
  ];

  return tags;
};

export default seo;
