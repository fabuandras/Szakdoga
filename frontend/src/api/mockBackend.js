import api from './axios';

const localData = {
  cart: (() => { try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(e){ return []; } })(),
  favorites: (() => { try { return JSON.parse(localStorage.getItem('favs')||'[]'); } catch(e){ return []; } })(),
};
function persist(){
  try{ localStorage.setItem('cart', JSON.stringify(localData.cart)); }catch(e){}
  try{ localStorage.setItem('favs', JSON.stringify(localData.favorites)); }catch(e){}
}

const origRequest = api.request.bind(api);

api.request = function(config){
  try{
    const url = (config && config.url) ? String(config.url) : '';
    const method = ((config && config.method) ? String(config.method) : 'get').toLowerCase();

    if(url.includes('/shop/cart')){
      if(method === 'get'){
        return Promise.resolve({ data: localData.cart, status: 200, statusText: 'OK', headers: {}, config });
      }
      if(url.includes('/add') && method === 'post'){
        const prod = config.data || (config && config.body ? JSON.parse(config.body) : {});
        if(prod && prod.id){
          const existing = localData.cart.find(i => String(i.id) === String(prod.id));
          if(existing){ existing.qty = (existing.qty || 1) + (prod.qty || 1); }
          else { localData.cart.push(Object.assign({qty: prod.qty || 1}, prod)); }
          persist();
        }
        return Promise.resolve({ data: localData.cart, status: 200, statusText: 'OK', headers: {}, config });
      }
      if(url.includes('/remove') && method === 'post'){
        const prod = config.data || {};
        const id = prod && prod.id;
        const idx = localData.cart.findIndex(i => String(i.id) === String(id));
        if(idx >= 0) localData.cart.splice(idx, 1);
        persist();
        return Promise.resolve({ data: localData.cart, status: 200, statusText: 'OK', headers: {}, config });
      }
    }

    if(url.includes('/shop/favorites')){
      if(method === 'get'){
        return Promise.resolve({ data: localData.favorites, status: 200, statusText: 'OK', headers: {}, config });
      }
      if(method === 'post'){
        const prod = config.data || {};
        const id = prod && prod.id;
        const idx = localData.favorites.findIndex(i => String(i.id) === String(id));
        if(idx >= 0) localData.favorites.splice(idx, 1);
        else localData.favorites.push(prod);
        persist();
        return Promise.resolve({ data: localData.favorites, status: 200, statusText: 'OK', headers: {}, config });
      }
    }

    if(url.includes('/items-public')){
      // fallback empty list to avoid 404s; real data should come from backend
      return Promise.resolve({ data: [], status: 200, statusText: 'OK', headers: {}, config });
    }
  }catch(e){
    // continue to real request on error
  }
  return origRequest(config);
};