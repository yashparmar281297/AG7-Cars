export type CarStatus = "available" | "booked" | "sold";
export type CarCondition = "new" | "preowned";
export type BodyType = "coupe" | "convertible" | "sedan" | "suv" | "hypercar" | "muvmpv" | "hatchback";
export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  body: BodyType;
  fuel: FuelType;
  kilometers: number;
  transmission: string;
  color: string | null;
  description: string | null;
  status: CarStatus;
  condition: CarCondition;
  featured: boolean;
  images: string[];
  horsepower: number | null;
  torque: number | null;
  created_at: string;
  updated_at: string;
}

// Static asset map so seeded paths still resolve through Vite's bundler
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import car5 from "@/assets/car-5.jpg";
import car6 from "@/assets/car-6.jpg";
import car7 from "@/assets/car-7.jpg";

const STATIC_ASSETS: Record<string, string> = {
  "/src/assets/car-1.jpg": car1,
  "/src/assets/car-2.jpg": car2,
  "/src/assets/car-3.jpg": car3,
  "/src/assets/car-4.jpg": car4,
  "/src/assets/car-5.jpg": car5,
  "/src/assets/car-6.jpg": car6,
  "/src/assets/car-7.jpg": car7,
};

export function resolveImage(src: string): string {
  return STATIC_ASSETS[src] ?? src;
}

export function formatPrice(price: number): string {
  // Indian-style with crores / lakhs
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} L`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}

export function formatKm(km: number): string {
  if (km === 0) return "Brand New";
  return `${km.toLocaleString("en-IN")} km`;
}
