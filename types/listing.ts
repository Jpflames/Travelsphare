export type PropertyType = "Apartment" | "Villa" | "Resort" | "Cabin";

export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  type: PropertyType;
  reviews: number;
}
