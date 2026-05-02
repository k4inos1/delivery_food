import { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import type { Product } from './data/products';

interface CartItem extends Product {
  quantity: number;
}

const WHATSAPP_NUMBER = "56978022258";

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

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
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🍕 Sabor a Casa</h1>
          <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)}>
            🛒 <span className="cart-badge">{cartItemCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <h2>Comida deliciosa, directo a tu puerta</h2>
            <p>Haz tu pedido rápido y fácil. Paga con Transbank o Efectivo al recibir.</p>
          </div>
        </section>

        <ProductList onAddToCart={addToCart} formatMoney={formatMoney} />
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
    </div>
  );
}

export default App;
