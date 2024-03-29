declare module "utf8" {
  export function encode(str: string): Uint8Array;
  export function decode(bytes: string): string;
}
