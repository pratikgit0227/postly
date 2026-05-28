import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getCharCount(text: string) {
  return text.length;
}

export function splitIntoTweets(text: string, limit = 280): string[] {
  if (text.length <= limit) return [text];

  const words = text.split(" ");
  const tweets: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length <= limit - 10) {
      current = test;
    } else {
      if (current) tweets.push(current);
      current = word;
    }
  }
  if (current) tweets.push(current);

  return tweets;
}
