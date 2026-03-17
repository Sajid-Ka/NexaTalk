export const HashAlgorithm = {
  SHA256: "sha256",
  SHA512: "sha512",
  MD5: "md5",
} as const;

export type HashAlgorithm = (typeof HashAlgorithm)[keyof typeof HashAlgorithm];

export const Encoding = {
  HEX: "hex",
  BASE64: "base64",
  UTF8: "utf8",
} as const;

export type Encoding = (typeof Encoding)[keyof typeof Encoding];
