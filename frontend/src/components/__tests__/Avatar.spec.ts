import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Avatar from '../Avatar.vue';

describe('Avatar', () => {
  it('renders properly with required props', () => {
    const wrapper = mount(Avatar, {
      props: {
        avatar: 'https://example.com/avatar.jpg',
      },
    });
    
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/avatar.jpg');
    expect(wrapper.find('.status-indicator').exists()).toBe(false);
  });

  it('shows status indicator when showStatus is true', () => {
    const wrapper = mount(Avatar, {
      props: {
        avatar: 'https://example.com/avatar.jpg',
        showStatus: true,
        isOnline: true,
      },
    });
    
    expect(wrapper.find('.status-indicator').exists()).toBe(true);
    expect(wrapper.find('.status-indicator').classes()).toContain('online');
  });

  it('shows offline status when isOnline is false', () => {
    const wrapper = mount(Avatar, {
      props: {
        avatar: 'https://example.com/avatar.jpg',
        showStatus: true,
        isOnline: false,
      },
    });
    
    expect(wrapper.find('.status-indicator').exists()).toBe(true);
    expect(wrapper.find('.status-indicator').classes()).not.toContain('online');
  });

  it('uses alt text when provided', () => {
    const wrapper = mount(Avatar, {
      props: {
        avatar: 'https://example.com/avatar.jpg',
        alt: 'Test alt text',
      },
    });
    
    expect(wrapper.find('img').attributes('alt')).toBe('Test alt text');
  });
}); 