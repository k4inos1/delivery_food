import { useState, useEffect } from 'react';
import './App.css';
import { fetchProducts, type Product } from './data/productsService';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';



interface CartItem extends Product {
  quantity: number;
}

const WHATSAPP_NUMBER = "56978022258";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    let orderText = `*¡Hola! Quiero hacer un pedido:*%0A%0A`;
    cart.forEach(item => {
      orderText += `- ${item.quantity}x ${item.name} (${formatMoney(item.price * item.quantity)})%0A`;
    });
    
    orderText += `%0A*Total: ${formatMoney(cartTotal)}*%0A`;
    orderText += `%0A*Datos del cliente:*%0A`;
    orderText += `Nombre: ${customerName}%0A`;
    orderText += `Dirección: ${customerAddress}%0A`;
    orderText += `Método de pago: ${paymentMethod}%0A`;
    
    if (paymentMethod.includes('Transbank')) {
      orderText += `%0A_Quedo atento al link de pago._`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${orderText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="app-container">
      <Header cartItemCount={cartItemCount} onCartOpen={() => setIsCartOpen(true)} />

      <main>
        <HeroSection />

        <section className="menu-section" id="menu">
          <h2 className="section-title">Nuestro Menú</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">{formatMoney(product.price)}</span>
                    <button className="add-btn" onClick={() => addToCart(product)}>Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Cart Overlay */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      
      {/* Cart Sidebar */}
      <aside className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Tu Pedido</h2>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Tu carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <span className="cart-item-price">{formatMoney(item.price * item.quantity)}</span>
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => removeFromCart(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>{formatMoney(cartTotal)}</span>
          </div>
          
          <form className="checkout-form" onSubmit={handleCheckout}>
            <h3>Datos de envío</h3>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input 
                type="text" 
                id="name" 
                required 
                placeholder="Ej: Juan Pérez"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Dirección de entrega</label>
              <input 
                type="text" 
                id="address" 
                required 
                placeholder="Calle 123, Depto 4B"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="payment">Método de pago</label>
              <select 
                id="payment" 
                required
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="">Selecciona un método...</option>
                <option value="Transbank (Link por chat)">Transbank (Link Webpay)</option>
                <option value="Efectivo al recibir">Efectivo al recibir</option>
                <option value="Transferencia">Transferencia bancaria</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="checkout-btn"
              disabled={cart.length === 0}
            >
              Enviar pedido por WhatsApp 📲
            </button>
          </form>
        </div>
      </aside>

      <Footer />
    </div>
  );
}

export default App;
