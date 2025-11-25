import favouritesReducer, { addFavourite, removeFavourite } from '../../src/store/slices/favouritesSlice';

describe('favouritesSlice', () => {
  it('should add favourite', () => {
    const item = { id: 1, title: 'Product 1' };
    const state = favouritesReducer({ items: [] }, addFavourite(item));
    
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(1);
  });

  it('should not add duplicate favourite', () => {
    const item = { id: 1, title: 'Product 1' };
    let state = favouritesReducer({ items: [] }, addFavourite(item));
    state = favouritesReducer(state, addFavourite(item));
    
    expect(state.items).toHaveLength(1);
  });

  it('should remove favourite', () => {
    const item = { id: 1, title: 'Product 1' };
    let state = favouritesReducer({ items: [] }, addFavourite(item));
    state = favouritesReducer(state, removeFavourite(1));
    
    expect(state.items).toHaveLength(0);
  });
});
