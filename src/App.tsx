import { useState } from 'react';
import './App.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pizza Margarita",
    description: "Salsa de tomate, mozzarella fresca y albahaca.",
    price: 8500,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80"
  },
  {
    id: 2,
    name: "Hamburguesa Clásica",
    description: "Doble carne, queso cheddar, lechuga, tomate y salsa especial.",
    price: 6900,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80"
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
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80"
  }
];

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

        <section className="menu-section">
          <h2 className="section-title">Nuestro Menú</h2>
          <div className="product-grid">
            {PRODUCTS.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
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
    </div>
  );
}

export default App;
