import { nIndexOf } from "./index";

export default (pathname: string, n: number): string => {
  const subPathsIndex = nIndexOf(pathname, "/", n);
  return subPathsIndex !== -1 ? pathname.substr(0, subPathsIndex) : pathname;
};