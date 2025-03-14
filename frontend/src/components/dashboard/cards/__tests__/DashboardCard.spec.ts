import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardCard from '../DashboardCard.vue';

describe('DashboardCard', () => {
  it('renders the title correctly', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title'
      }
    });
    
    expect(wrapper.find('h2').text()).toBe('Test Title');
  });

  it('renders the subtitle when provided', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title',
        subtitle: 'Test Subtitle'
      }
    });
    
    expect(wrapper.find('p').text()).toBe('Test Subtitle');
  });

  it('does not render subtitle when not provided', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title'
      }
    });
    
    expect(wrapper.find('.text-neutral-500').exists()).toBe(false);
  });

  it('shows loading state when loading is true', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title',
        loading: true
      }
    });
    
    expect(wrapper.find('.spinner').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading...');
  });

  it('shows empty state when isEmpty is true', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title',
        isEmpty: true,
        emptyMessage: 'No data found'
      }
    });
    
    expect(wrapper.text()).toContain('No data found');
  });

  it('shows empty state with description when provided', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title',
        isEmpty: true,
        emptyMessage: 'No data found',
        emptyDescription: 'Please add some data'
      }
    });
    
    expect(wrapper.text()).toContain('No data found');
    expect(wrapper.text()).toContain('Please add some data');
  });

  it('renders default slot content when not loading or empty', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title'
      },
      slots: {
        default: '<div class="test-content">Test Content</div>'
      }
    });
    
    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-content').text()).toBe('Test Content');
  });

  it('renders actions slot content', () => {
    const wrapper = mount(DashboardCard, {
      props: {
        title: 'Test Title'
      },
      slots: {
        actions: '<button>Test Action</button>'
      }
    });
    
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Test Action');
  });
}); 