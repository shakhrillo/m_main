export const formatSize = (bytes: number, type: "str" | "num" = "str") => {
  if (bytes === 0 || !bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  return type === "num"
    ? parseFloat((bytes / Math.pow(k, i)).toFixed(2))
    : parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
