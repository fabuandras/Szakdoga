// Cart utilities: localStorage-backed API with events and window bindings
const CART_KEY = 'szakdoga_cart_v1';

function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse cart from localStorage:', e);
    return [];
  }
}

function readCart() {
  const raw = localStorage.getItem(CART_KEY);
  return safeParse(raw);
}

function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdated(cart);
  } catch (e) {
    console.error('Failed to write cart to localStorage:', e);
  }
}

function dispatchCartUpdated(cart) {
  try {
    const evt = new CustomEvent('cartUpdated', { detail: { cart } });
    window.dispatchEvent(evt);
  } catch (e) {
    // Older browsers may fail creating CustomEvent; fallback to a plain event
    const evt = document.createEvent ? document.createEvent('Event') : null;
    if (evt && evt.initEvent) {
      evt.initEvent('cartUpdated', true, true);
      evt.detail = { cart };
      window.dispatchEvent(evt);
    }
  }
}

export function getCart() {
  return readCart();
}

export function getCartCount() {
  return readCart().reduce((sum, it) => sum + (it.quantity || 0), 0);
}

export function saveCart(cart) {
  writeCart(cart || []);
}

export function addToCart(product, quantity = 1) {
  if (!product) return getCart();
  const cart = readCart();
  const pid = product.id ?? product._id ?? product.productId ?? product.sku ?? null;

  let existingIndex = -1;
  if (pid !== null) {
    existingIndex = cart.findIndex(i => {
      const id = i.product && (i.product.id ?? i.product._id ?? i.product.productId ?? i.product.sku);
      return id == pid;
    });
  } else {
    // fallback: try to match by deep-equal of product object keys that commonly identify
    existingIndex = cart.findIndex(i => JSON.stringify(i.product) === JSON.stringify(product));
  }

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 0) + quantity;
  } else {
    cart.push({ product, quantity });
  }

  writeCart(cart);
  return cart;
}

export function updateQuantity(productId, quantity) {
  const cart = readCart();
  const idx = cart.findIndex(i => {
    const id = i.product && (i.product.id ?? i.product._id ?? i.product.productId ?? i.product.sku);
    return id == productId;
  });
  if (idx > -1) {
    if (quantity <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx].quantity = quantity;
    }
    writeCart(cart);
  }
  return cart;
}

export function removeFromCart(productId) {
  const cart = readCart();
  const filtered = cart.filter(i => {
    const id = i.product && (i.product.id ?? i.product._id ?? i.product.productId ?? i.product.sku);
    return id != productId;
  });
  writeCart(filtered);
  return filtered;
}

export function clearCart() {
  writeCart([]);
  return [];
}

// attach to window for components that rely on global helpers
try {
  window.cartUtils = window.cartUtils || {};
  window.cartUtils.getCart = getCart;
  window.cartUtils.getCartCount = getCartCount;
  window.cartUtils.addToCart = addToCart;
  window.cartUtils.updateQuantity = updateQuantity;
  window.cartUtils.removeFromCart = removeFromCart;
  window.cartUtils.clearCart = clearCart;
  // also attach top-level shortcuts for older code
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
} catch (e) {
  // ignore if environment prevents attaching to window
}

export default {
  getCart,
  getCartCount,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};