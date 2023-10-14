/**
 * Takes in a list of search terms and returns a qualified search
 * string for Postgres TextSearch
 * @param search Search term
 * @returns Postgres TextSearch valid string
 */
export const generateSearchString = (search: string) => {
  return search
    .split(" ")
    .map((s) => `${s}:*`)
    .join(" | ");
};
