import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ShoppingList from '../src/components/ShoppingList.vue';
import ItemRow from '../src/components/ItemRow.vue';
import AddItemForm from '../src/components/AddItemForm.vue';

describe('ShoppingList Component', () => {
  it('renders title and empty state correctly', () => {
    const wrapper = mount(ShoppingList, {
      props: {
        title: 'מוצרים לקנייה',
        items: []
      }
    });

    expect(wrapper.text()).toContain('מוצרים לקנייה');
    expect(wrapper.text()).toContain('אין מוצרים להצגה');
  });

  it('renders list of items', () => {
    const items = [
      { id: '1', name: 'חלב', quantity: '2', checked: false },
      { id: '2', name: 'לחם', quantity: '1', checked: false }
    ];

    const wrapper = mount(ShoppingList, {
      props: {
        title: 'מוצרים לקנייה',
        items
      }
    });

    expect(wrapper.text()).toContain('חלב');
    expect(wrapper.text()).toContain('לחם');
    expect(wrapper.text()).toContain('2 מוצרים');
  });
});

describe('ItemRow Component', () => {
  it('emits toggle event when checkbox clicked', async () => {
    const item = { id: '1', name: 'חלב', quantity: '1', checked: false };
    const wrapper = mount(ItemRow, { props: { item } });

    const checkbox = wrapper.find('button');
    await checkbox.trigger('click');

    expect(wrapper.emitted('toggle')).toBeTruthy();
    expect(wrapper.emitted('toggle')[0]).toEqual([item]);
  });
});

describe('AddItemForm Component', () => {
  it('emits add-item event with name and quantity', async () => {
    const wrapper = mount(AddItemForm);

    const inputs = wrapper.findAll('input');
    await inputs[0].setValue('גבינה');
    await inputs[1].setValue('3');

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('add-item')).toBeTruthy();
    expect(wrapper.emitted('add-item')[0][0]).toEqual({
      name: 'גבינה',
      quantity: '3'
    });
  });
});
