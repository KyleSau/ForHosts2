import { TIME_FACTORS } from "./constants";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: "no-store" });

  return response.json();
}

export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncate = (str: string, num: number) => {
  if (!str) return "";
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
  try {
    const response = await fetch(
      `https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`,
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    return "data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  }
};

export const placeholderBlurhash =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg==";

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const chunkIntoSizeNSubarrays = (arr: Array<number>, subarrySize: number) => {
  const n = subarrySize;
  return Array.from({ length: Math.floor(arr.length / n) + arr.length % n }, (_, i) =>
    arr.slice(i * n, i * n + n)
  );
}

export const calcDateDelta = (refDate: Date, futureDate: Date) => {
  const diff = futureDate.getTime() - refDate.getTime();
  const sign = (diff < 0) ? -1 : 1;
  let remainingMilliseconds = Math.abs(diff);

  const numDays = Math.floor(remainingMilliseconds / TIME_FACTORS.MS_PER_DAY);
  remainingMilliseconds %= TIME_FACTORS.MS_PER_DAY;
  const numHours = Math.floor(remainingMilliseconds / TIME_FACTORS.MS_PER_HOUR);
  remainingMilliseconds %= TIME_FACTORS.MS_PER_HOUR;
  const numMinutes = Math.floor(remainingMilliseconds / TIME_FACTORS.MS_PER_MINUTE);
  remainingMilliseconds %= TIME_FACTORS.MS_PER_MINUTE;
  const numSeconds = Math.floor(remainingMilliseconds / TIME_FACTORS.MS_PER_SECOND);
  remainingMilliseconds %= TIME_FACTORS.MS_PER_SECOND;

  const deltaTime = [numDays, numHours, numMinutes, numSeconds, remainingMilliseconds];
  return deltaTime.map((unit: number) => (unit != 0) ? unit * sign : unit);
};

export const calcRelativeDate = (refDate: Date, query: string) => {
  const queryArgs = query.match(/^[\+\-+0-9]+|[A-za-z]+/gm);
  const queryNum: number = queryArgs && queryArgs.length >= 1 ? parseInt(queryArgs[0]) : 0;
  const queryTimeUnit: string = queryArgs && queryArgs.length >= 2 ? queryArgs[1] : "null";

  if (queryNum === 0 || queryTimeUnit === "null") {
    return refDate;
  }

  const resultDate = new Date(refDate);

  switch (queryTimeUnit) {
    case "hr" || "hour":
      resultDate.setHours(refDate.getHours() + queryNum);
      break;
    case "dy" || "day":
      resultDate.setHours(refDate.getHours() + queryNum * 24);
      break;
    case "wk" || "week":
      resultDate.setDate(refDate.getDate() + queryNum * 7);
      break;
    case "mo" || "month":
      resultDate.setMonth(refDate.getMonth() + queryNum);
      break;
    case "yr" || "year":
      resultDate.setFullYear(refDate.getFullYear() + queryNum);
      break;
  }

  return resultDate;
};

//used for multi text search
export const createCleanQueryList = (multiQueryString: string) => {
  let queryList = multiQueryString.split(/(?:,| )+/).filter(query => query !== ""); //remove empty string
  const compoundQueries = multiQueryString.split(",").map(query => query.trim()).filter(query => query !== "");
  queryList.concat(compoundQueries);
  queryList = queryList.filter((query: string, i: number) => queryList.indexOf(query) === i); //remove duplicates
  return queryList;
};

export const humanReadableFileSize = (size: number | undefined) => {
  // file.size unit is in bytes
  if (size !== undefined) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (
      (size / Math.pow(1024, i)).toFixed(2) +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  }
  return 0.0;
};