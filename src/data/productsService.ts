import productsData from './products.json';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

/**
 * Fetches all food products from the local mock database.
 * Simulates an async API call with a short delay.
 */
export async function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productsData as Product[]);
    }, 300);
  });
}
