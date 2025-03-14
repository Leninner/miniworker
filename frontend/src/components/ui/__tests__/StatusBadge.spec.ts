import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StatusBadge from '../StatusBadge.vue';

describe('StatusBadge', () => {
  it('renders the formatted status text', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'in_progress'
      }
    });
    
    expect(wrapper.text()).toBe('In Progress');
  });

  it('applies the correct class for pending status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'pending'
      }
    });
    
    expect(wrapper.classes()).toContain('bg-yellow-500');
    expect(wrapper.classes()).toContain('text-white');
  });

  it('applies the correct class for in_progress status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'in_progress'
      }
    });
    
    expect(wrapper.classes()).toContain('bg-blue-500');
    expect(wrapper.classes()).toContain('text-white');
  });

  it('applies the correct class for completed status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'completed'
      }
    });
    
    expect(wrapper.classes()).toContain('bg-green-500');
    expect(wrapper.classes()).toContain('text-white');
  });

  it('applies the correct class for failed status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'failed'
      }
    });
    
    expect(wrapper.classes()).toContain('bg-red-500');
    expect(wrapper.classes()).toContain('text-white');
  });

  it('applies the default class for unknown status', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'unknown_status'
      }
    });
    
    expect(wrapper.classes()).toContain('bg-neutral-500');
    expect(wrapper.classes()).toContain('text-white');
  });

  it('handles empty status gracefully', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: ''
      }
    });
    
    expect(wrapper.text()).toBe('Unknown');
  });
}); 