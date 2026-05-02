export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pizza Margarita",
    description: "Salsa de tomate, mozzarella fresca y albahaca.",
    price: 8500,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80",
    badge: "Popular"
  },
  {
    id: 2,
    name: "Hamburguesa Clásica",
    description: "Doble carne, queso cheddar, lechuga, tomate y salsa especial.",
    price: 6900,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    badge: "Favorito"
  },
  {
    id: 3,
    name: "Sushi Roll",
    description: "Roll tempura de camarón, palta y queso crema.",
    price: 7500,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80"
  },
  {
    id: 4,
    name: "Papas Fritas XL",
    description: "Porción grande de papas fritas con salsa de queso y tocino.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80",
    badge: "Oferta"
  }
];
