import type { Book } from "../discover/types";

export interface CatalogBook extends Book {
  copiesTotal: number;
  copiesAvailable: number;
}

export type CatalogFormValues = Pick<
  CatalogBook,
  "title" | "author" | "isbn" | "coverUrl" | "isFree" | "copiesTotal" | "copiesAvailable"
>;