export const menu = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil.',
    price: 12.99,
    image: '/images/margherita.jpg'
  },
  {
    id: 2,
    name: 'Cheeseburger',
    description: 'Juicy beef patty with melted cheddar, lettuce, and tomato.',
    price: 9.49,
    image: '/images/burger.jpg'
  },
  {
    id: 3,
    name: 'Chicken Wings',
    description: 'Crispy wings tossed in spicy buffalo sauce.',
    price: 7.99,
    image: '/images/wings.jpg'
  }
];

export function findMenuItem(id){
  return menu.find(m => m.id === id);
}