const prepareImagesForSubmit = (arr: any[]) => {
  const urls = new Set<string>();
  const files: File[] = [];

  arr.forEach((img: any) => {
    if (typeof img === "string") urls.add(img);
    else if (img instanceof File) files.push(img);
  });

  return {
    existingImages: Array.from(urls),
    newImages: files,
  };
};
