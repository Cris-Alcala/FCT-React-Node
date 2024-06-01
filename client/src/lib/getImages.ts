export const getImages = async (imageId: string) => {
  let type = imageId.endsWith(".svg")
    ? "image/svg+xml"
    : imageId.endsWith(".png")
    ? "image/png"
    : "image/jpeg";
  const response = await fetch(
    `${import.meta.env.VITE_ENDPOINT_SERVER}/getimage/${imageId}`
  );
  const blob = await response.json();
  const blobUrl = new Blob([new Uint8Array(blob.Body.data)], {
    type,
  });
  return {
    imageUrl: URL.createObjectURL(blobUrl),
  };
};
