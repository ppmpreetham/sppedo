export const updateCartCount = (count: number) => {
  localStorage.setItem('sppedo_cart_count', count.toString());
};

export const updateFavoritesCount = (count: number) => {
  localStorage.setItem('sppedo_favorites_count', count.toString());
};

export const getCounts = () => {
  const cartCount = localStorage.getItem('sppedo_cart_count');
  const favoritesCount = localStorage.getItem('sppedo_favorites_count');
  return {
    cartCount: cartCount ? parseInt(cartCount) : 0,
    favoritesCount: favoritesCount ? parseInt(favoritesCount) : 0
  };
};