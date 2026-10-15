export const menu = [
  {
    id: 1,
    name: 'Cheese Pizza',
    description: 'Classic tomato sauce and melted mozzarella cheese.',
    price: 12.99,
    image: '/images/pizza.svg'
  },
  {
    id: 2,
    name: 'Classic Burger',
    description: 'Beef patty, cheddar, lettuce, and tomato on a toasted bun.',
    price: 9.49,
    image: '/images/burger.svg'
  },
  {
    id: 3,
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings tossed in spicy buffalo sauce.',
    price: 7.99,
    image: '/images/wings.svg'
  },
  {
    id: 4,
    name: 'Caesar Salad',
    description: 'Crisp romaine, parmesan, croutons, and creamy dressing.',
    price: 6.49,
    image: '/images/salad.svg'
  },
  {
    id: 5,
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries served with a garlic dip.',
    price: 4.99,
    image: '/images/fries.svg'
  },
  {
    id: 6,
    name: 'Chocolate Milkshake',
    description: 'Rich chocolate milkshake topped with whipped cream.',
    price: 5.49,
    image: '/images/milkshake.svg'
  }
];

export function findMenuItem(id) {
  return menu.find((item) => item.id === id);
}
