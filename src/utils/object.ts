export const base64ToBlob = (base64Data) => {
  // 1. 分离 MIME 类型和纯 Base64 数据
  const parts = base64Data.split(";base64,");
  const mimeType = parts[0].split(":")[1]; // 提取如 "image/jpeg"
  const rawBase64 = parts[1]; // 纯 Base64 数据

  // 2. 解码 Base64 为二进制
  const byteCharacters = atob(rawBase64);

  // 3. 转为 Uint8Array
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  // 4. 生成 Blob
  return new Blob([byteArray], { type: mimeType });
};
