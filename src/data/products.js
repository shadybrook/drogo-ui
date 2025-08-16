// Product catalog data
export const productCatalog = [
  {
    id: 'almonds-500g',
    name: 'California Almonds',
    description: '500g Premium Quality',
    category: 'groceries',
    price: 449,
    originalPrice: 549,
    image: generateProductImage('🥜', '#f0f9ff'),
    tag: 'Bestseller',
    inStock: true,
    rating: 4.5,
    deliveryTime: '8-12 min'
  },
  {
    id: 'whole-wheat-bread',
    name: 'Whole Wheat Bread',
    description: 'Fresh Daily Baked',
    category: 'groceries',
    price: 55,
    originalPrice: 65,
    image: generateProductImage('🍞', '#fff7ed'),
    tag: 'Fresh',
    inStock: true,
    rating: 4.3,
    deliveryTime: '10-15 min'
  },
  {
    id: 'masala-chips',
    name: 'Masala Potato Chips',
    description: '150g Crispy & Spicy',
    category: 'groceries',
    price: 45,
    originalPrice: 60,
    image: generateProductImage('🍟', '#fef3c7'),
    tag: 'Buy 1 Get 1',
    inStock: true,
    rating: 4.2,
    deliveryTime: '5-10 min'
  },
  {
    id: 'mango-juice',
    name: 'Fresh Mango Juice',
    description: '1L Chilled Pack',
    category: 'beverages',
    price: 99,
    originalPrice: 130,
    image: generateProductImage('🧃', '#fef3c7'),
    tag: 'Chilled',
    inStock: true,
    rating: 4.6,
    deliveryTime: '8-12 min'
  },
  {
    id: 'organic-milk',
    name: 'Organic Cow Milk',
    description: '1L Fresh & Pure',
    category: 'groceries',
    price: 72,
    originalPrice: 82,
    image: generateProductImage('🥛', '#f0f9ff'),
    tag: 'Organic',
    inStock: true,
    rating: 4.4,
    deliveryTime: '10-15 min'
  },
  {
    id: 'bananas-6pc',
    name: 'Fresh Bananas',
    description: '6 pieces - Ripe & Sweet',
    category: 'groceries',
    price: 59,
    originalPrice: 75,
    image: generateProductImage('🍌', '#fffbeb'),
    tag: 'Fresh',
    inStock: true,
    rating: 4.1,
    deliveryTime: '8-12 min'
  },
  {
    id: 'paracetamol-500mg',
    name: 'Paracetamol 500mg',
    description: '10 tablets - Pain Relief',
    category: 'pharmacy',
    price: 35,
    originalPrice: 45,
    image: generateProductImage('💊', '#fef2f2'),
    tag: 'Prescription Free',
    inStock: true,
    rating: 4.8,
    deliveryTime: '5-8 min'
  },
  {
    id: 'vitamin-c-tablets',
    name: 'Vitamin C Tablets',
    description: '30 tablets - Immunity Boost',
    category: 'pharmacy',
    price: 199,
    originalPrice: 249,
    image: generateProductImage('💊', '#f0fdf4'),
    tag: 'Immunity',
    inStock: true,
    rating: 4.5,
    deliveryTime: '5-8 min'
  },
  {
    id: 'smartphone-charger',
    name: 'Fast Phone Charger',
    description: 'Type-C 25W Fast Charging',
    category: 'electronics',
    price: 799,
    originalPrice: 999,
    image: generateProductImage('🔌', '#f0f9ff'),
    tag: 'Fast Delivery',
    inStock: true,
    rating: 4.3,
    deliveryTime: '12-15 min'
  },
  {
    id: 'dog-treats',
    name: 'Premium Dog Treats',
    description: '200g Chicken Flavor',
    category: 'pet-care',
    price: 149,
    originalPrice: 199,
    image: generateProductImage('🦴', '#fef2f2'),
    tag: 'Healthy',
    inStock: true,
    rating: 4.7,
    deliveryTime: '10-15 min'
  },
  {
    id: 'green-tea',
    name: 'Premium Green Tea',
    description: '25 tea bags - Antioxidant Rich',
    category: 'beverages',
    price: 299,
    originalPrice: 349,
    image: generateProductImage('🍵', '#f0fdf4'),
    tag: 'Healthy',
    inStock: true,
    rating: 4.4,
    deliveryTime: '8-12 min'
  },
  {
    id: 'instant-coffee',
    name: 'Instant Coffee Powder',
    description: '100g Rich & Strong',
    category: 'beverages',
    price: 245,
    originalPrice: 295,
    image: generateProductImage('☕', '#fef3c7'),
    tag: 'Premium',
    inStock: true,
    rating: 4.2,
    deliveryTime: '8-12 min'
  }
];

// Helper function to generate product images
function generateProductImage(emoji, bgColor) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <defs>
      <linearGradient id='bg-${emoji}' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' style='stop-color:${bgColor};stop-opacity:1' />
        <stop offset='100%' style='stop-color:#ffffff;stop-opacity:1' />
      </linearGradient>
    </defs>
    <rect width='200' height='200' rx='24' fill='url(#bg-${emoji})' stroke='#e5e7eb' stroke-width='2'/>
    <text x='100' y='130' text-anchor='middle' font-size='80' font-family='Arial'>${emoji}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper function to calculate savings
export const calculateSavings = (originalPrice, currentPrice) => {
  return originalPrice - currentPrice;
};

// Helper function to calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, currentPrice) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
