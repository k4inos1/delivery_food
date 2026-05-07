import { useState, useEffect, useCallback } from 'react';
import { signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from '../data/productsService';
import './AdminPanel.css';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  category: '',
};

type FormState = typeof EMPTY_FORM;

interface AdminPanelProps {
  user: User;
}

function AdminPanel({ user }: AdminPanelProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const loadProducts = useCallback(() => {
    return fetchProducts()
      .then(data => setProducts(data))
      .catch(() => showNotification('Error al cargar los productos.', 'error'))
      .finally(() => setLoading(false));
  }, [showNotification]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormState({
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl,
      category: product.category,
    });
    document.getElementById('admin-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormState(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const productData = {
      name: formState.name.trim(),
      description: formState.description.trim(),
      price: Number(formState.price),
      imageUrl: formState.imageUrl.trim(),
      category: formState.category.trim(),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
        showNotification('Producto actualizado exitosamente.', 'success');
      } else {
        await addProduct(productData);
        showNotification('Producto creado exitosamente.', 'success');
      }
      handleCancel();
      setLoading(true);
      await loadProducts();
    } catch {
      showNotification('Error al guardar el producto.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      showNotification('Producto eliminado exitosamente.', 'success');
      setLoading(true);
      await loadProducts();
    } catch {
      showNotification('Error al eliminar el producto.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);

  const userName = user.displayName?.trim() || user.email?.trim() || 'Administrador';
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <div className="admin-page">
      {/* Admin Navbar */}
      <header className="admin-navbar">
        <div className="admin-navbar-content">
          <div className="admin-brand">
            <span>🍕</span>
            <span>Sabor a Casa — Admin</span>
          </div>
          <div className="admin-navbar-actions">
            <div className="admin-user-chip">
              {user.photoURL ? (
                <img src={user.photoURL} alt={userName} className="admin-user-avatar" referrerPolicy="no-referrer" />
              ) : (
                <span className="admin-user-avatar admin-user-avatar--fallback" aria-hidden="true">
                  {avatarLetter}
                </span>
              )}
              <div className="admin-user-meta">
                <strong>{userName}</strong>
                {user.email && <span>{user.email}</span>}
              </div>
            </div>
            <button className="admin-logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Notification */}
        {notification && (
          <div className={`admin-notification admin-notification--${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Product Form */}
        <section className="admin-section" id="admin-form">
          <h2 className="admin-section-title">
            {editingId ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="name">Nombre *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleFormChange}
                  placeholder="Pizza Margarita"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="category">Categoría</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formState.category}
                  onChange={handleFormChange}
                  placeholder="Pizza, Burger, Sushi..."
                />
              </div>

              <div className="admin-form-group admin-form-group--full">
                <label htmlFor="description">Descripción *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                  placeholder="Salsa de tomate, mozzarella fresca y albahaca."
                  rows={3}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="price">Precio (CLP) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formState.price}
                  onChange={handleFormChange}
                  placeholder="8500"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="imageUrl">URL de Imagen *</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formState.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Guardando...' : editingId ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
              {editingId && (
                <button type="button" className="admin-btn admin-btn--secondary" onClick={handleCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Products Table */}
        <section className="admin-section">
          <h2 className="admin-section-title">Productos ({products.length})</h2>

          {loading ? (
            <div className="admin-loading">Cargando productos...</div>
          ) : products.length === 0 ? (
            <p className="admin-empty">No hay productos. ¡Agrega uno arriba!</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="admin-table-img"
                        />
                      </td>
                      <td className="admin-table-name">{product.name}</td>
                      <td className="admin-table-desc">{product.description}</td>
                      <td>
                        <span className="admin-badge">{product.category}</span>
                      </td>
                      <td className="admin-table-price">{formatMoney(product.price)}</td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-btn admin-btn--edit"
                            onClick={() => handleEdit(product)}
                          >
                            Editar
                          </button>
                          <button
                            className="admin-btn admin-btn--danger"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? '...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminPanel;
