import { useState, useEffect } from 'react';
import './App.css';
import { fetchProducts, type Product } from './data/productsService';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import ProductList from './components/ProductList';

interface CartItem extends Product {
  quantity: number;
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_BUSINESS_NUMBER || "56900000000";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [customerLocation, setCustomerLocation] = useState<string | null>(null);

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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCustomerLocation(`${lat},${lng}`);
        alert('¡Ubicación obtenida con éxito!');
      },
      (error) => {
        console.error('Error getting location', error);
        alert('No se pudo obtener la ubicación. Por favor, asegúrate de dar los permisos necesarios.');
      }
    );
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
    
    let mapsLink = '';
    if (customerLocation) {
      mapsLink = `https://www.google.com/maps?q=${customerLocation}`;
    } else if (customerAddress) {
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;
    }
    
    if (mapsLink) {
      orderText += `Ubicación en mapa: ${mapsLink}%0A`;
    }

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

        <ProductList products={products} onAddToCart={addToCart} formatMoney={formatMoney} />
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
              <div className="address-input-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  id="address" 
                  required={!customerLocation}
                  placeholder="Calle 123, Depto 4B"
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  className="location-btn"
                  onClick={handleGetLocation}
                  title="Obtener ubicación actual"
                >
                  📍
                </button>
              </div>
              {customerLocation && (
                <small className="location-success" style={{ color: '#28a745', marginTop: '4px', display: 'block' }}>
                  ✓ Ubicación obtenida correctamente
                </small>
              )}
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
