import { upcase } from "./upcase";


export const humanize = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z]+)/g, "$1 $2")
    .split(/\s|_|\-/)
    .filter((i) => i)
    .map(upcase)
    .join(" ");
};
