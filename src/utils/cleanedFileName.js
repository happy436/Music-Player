export const cleanedFileName = (fileName) => {
    return fileName.replace(/_/g, " ").replace(/\.mp3/g, "");
};