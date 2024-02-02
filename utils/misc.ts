const faker = require('faker');
const Product = require('./models/Product');

// Function to generate fake product data
const generateFakeProduct = () => {
  return {
    name: faker.commerce.productName(),
    quantity: faker.random.number({ min: 1, max: 100 }),
    rate: faker.random.number({ min: 5, max: 100 }),
  };
};

// Create an array to store fake product entries
const fakeProducts = [];

// Generate 10 fake product entries
for (let i = 0; i < 10; i++) {
  fakeProducts.push(generateFakeProduct());
}

// Insert fake products into the database
Product.insertMany(fakeProducts)
  .then((products) => {
    console.log('Fake products inserted successfully:', products);
  })
  .catch((error) => {
    console.error('Error inserting fake products:', error);
  });

console.log(fakeProducts);