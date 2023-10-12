import {toDate, formatInTimeZone } from "date-fns-tz";

export const formatDate = (date: Date, format: string) => {
  const formatted = formatInTimeZone(
    date,
    "UTC",
    format
  );

  return formatted;
};

export const toServerDate = (date: Date) => {
  return toDate(date, {timeZone: "UTC"})
}