// Simple hash function (FNV-1a 32-bit)
const hashFnv32a = (str: string) => {
  let hval = 0x811c9dc5;
  for (let i = 0; i < str.length; ++i) {
    hval ^= str.charCodeAt(i);
    hval +=
      (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return hval >>> 0; // force unsigned
};

export const uuidToColor = (uuid: string) => {
  const hash = hashFnv32a(uuid);
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};
