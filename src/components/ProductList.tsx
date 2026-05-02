import './ProductList.css';
import ProductCard from './ProductCard';
import { PRODUCTS } from '../data/products';
import type { Product } from '../data/products';

interface ProductListProps {
  onAddToCart: (product: Product) => void;
  formatMoney: (amount: number) => string;
}

export default function ProductList({ onAddToCart, formatMoney }: ProductListProps) {
  return (
    <section className="product-list">
      <h2 className="product-list__title">Nuestro Menú</h2>
      <div className="product-list__grid">
        {PRODUCTS.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            formatMoney={formatMoney}
          />
        ))}
      </div>
    </section>
  );
}
