import './ProductList.css';
import ProductCard from './ProductCard';
import type { Product } from '../data/productsService';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  formatMoney: (amount: number) => string;
}

export default function ProductList({ products, onAddToCart, formatMoney }: ProductListProps) {
  return (
    <section className="product-list">
      <h2 className="product-list__title">Nuestro Menú</h2>
      <div className="product-list__grid">
        {products.map(product => (
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
