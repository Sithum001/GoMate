import themeReducer, { toggleTheme, setTheme } from '../../src/store/slices/themeSlice';

describe('themeSlice', () => {
  it('should toggle theme from light to dark', () => {
    const state = themeReducer({ mode: 'light' }, toggleTheme());
    expect(state.mode).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    const state = themeReducer({ mode: 'dark' }, toggleTheme());
    expect(state.mode).toBe('light');
  });

  it('should set theme explicitly', () => {
    const state = themeReducer({ mode: 'light' }, setTheme('dark'));
    expect(state.mode).toBe('dark');
  });

  it('should have initial state', () => {
    const state = themeReducer(undefined, { type: 'unknown' });
    expect(state.mode).toBe('light');
  });
});
