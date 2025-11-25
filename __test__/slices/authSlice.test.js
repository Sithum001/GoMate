import authReducer, { logout } from '../../src/store/slices/authSlice';

describe('authSlice', () => {
  it('should handle logout', () => {
    const initialState = {
      user: { username: 'test', token: 'abc' },
      token: 'abc',
      status: 'succeeded',
      error: null
    };

    const state = authReducer(initialState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('should have initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      user: null,
      token: null,
      status: 'idle',
      error: null
    });
  });
});
