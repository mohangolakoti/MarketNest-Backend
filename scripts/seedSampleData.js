require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const SAMPLE_USERS = [
  {
    name: 'Urban Loom',
    email: 'brand.alpha@marketnest.dev',
    role: 'brand',
    password: 'Test@12345',
  },
  {
    name: 'North Peak',
    email: 'brand.beta@marketnest.dev',
    role: 'brand',
    password: 'Test@12345',
  },
  {
    name: 'Aisha Shopper',
    email: 'customer.one@marketnest.dev',
    role: 'customer',
    password: 'Test@12345',
  },
];

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1467043198406-dc953a3defa0?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475180098004-ca77a66827be?q=80&w=1400&auto=format&fit=crop',
];

const now = Date.now();

const createProducts = (brandOneId, brandTwoId) => [
  {
    title: 'Classic White Tee',
    description: 'Premium cotton crew-neck tee designed for all-season layering.',
    price: 24.99,
    category: 'Tops',
    images: [IMAGE_POOL[0], IMAGE_POOL[1]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 18),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 15),
  },
  {
    title: 'Ocean Blue Linen Shirt',
    description: 'Breathable linen shirt with a relaxed drape and soft-touch finish.',
    price: 49,
    category: 'Tops',
    images: [IMAGE_POOL[2], IMAGE_POOL[3]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 16),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 13),
  },
  {
    title: 'Oversized Denim Jacket',
    description: 'Relaxed-fit denim jacket with reinforced seams and deep utility pockets.',
    price: 89.5,
    category: 'Outerwear',
    images: [IMAGE_POOL[3], IMAGE_POOL[13]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 11),
  },
  {
    title: 'Minimal Runner Sneakers',
    description: 'Lightweight knit sneakers with responsive cushioning for city movement.',
    price: 120,
    category: 'Shoes',
    images: [IMAGE_POOL[4], IMAGE_POOL[5]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 12),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 10),
  },
  {
    title: 'Terra Cargo Pants',
    description: 'Tapered cargo pants with stretch twill and low-profile side pockets.',
    price: 67,
    category: 'Bottoms',
    images: [IMAGE_POOL[14], IMAGE_POOL[6]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 11),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 9),
  },
  {
    title: 'Textured Knit Polo',
    description: 'Soft knit polo with contrast collar and elevated casual silhouette.',
    price: 54,
    category: 'Tops',
    images: [IMAGE_POOL[6], IMAGE_POOL[15]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 8),
  },
  {
    title: 'Studio Leather Belt',
    description: 'Italian leather belt with brushed buckle for clean everyday styling.',
    price: 32,
    category: 'Accessories',
    images: [IMAGE_POOL[10]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 9),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 7),
  },
  {
    title: 'Sandstone Crossbody Bag',
    description: 'Compact crossbody bag with magnetic flap and adjustable woven strap.',
    price: 58,
    category: 'Accessories',
    images: [IMAGE_POOL[7], IMAGE_POOL[9]],
    status: 'published',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 8),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 6),
  },
  {
    title: 'Cloud Grey Hoodie',
    description: 'Heavyweight brushed fleece hoodie with structured hood and ribbed cuffs.',
    price: 78,
    category: 'Outerwear',
    images: [IMAGE_POOL[8], IMAGE_POOL[11]],
    status: 'draft',
    brand: brandOneId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 6),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 5),
  },
  {
    title: 'Archive Utility Pants',
    description: 'Retired limited drop kept for archive and deletion-state testing.',
    price: 68,
    category: 'Bottoms',
    images: [IMAGE_POOL[12]],
    status: 'published',
    brand: brandOneId,
    isDeleted: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 25),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 3),
  },
  {
    title: 'Canvas Street Backpack',
    description: 'Durable city backpack with padded laptop sleeve and water-resistant zip.',
    price: 72,
    category: 'Accessories',
    images: [IMAGE_POOL[13], IMAGE_POOL[1]],
    status: 'published',
    brand: brandTwoId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 15),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 12),
  },
  {
    title: 'Tailored Chino Shorts',
    description: 'Crisp tailored shorts with subtle stretch and clean minimal stitching.',
    price: 46,
    category: 'Bottoms',
    images: [IMAGE_POOL[14], IMAGE_POOL[5]],
    status: 'published',
    brand: brandTwoId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 13),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 10),
  },
  {
    title: 'Amber Suede Loafers',
    description: 'Soft suede loafers with cushioned insole and low-profile rubber sole.',
    price: 95,
    category: 'Shoes',
    images: [IMAGE_POOL[4], IMAGE_POOL[10]],
    status: 'published',
    brand: brandTwoId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 11),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 9),
  },
  {
    title: 'Sand Relaxed Trousers',
    description: 'Flowy straight-leg trousers with concealed drawcord for comfort.',
    price: 64,
    category: 'Bottoms',
    images: [IMAGE_POOL[15], IMAGE_POOL[2]],
    status: 'published',
    brand: brandTwoId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 8),
  },
  {
    title: 'Streetline Graphic Tee',
    description: 'Midweight graphic tee with soft wash and subtle oversized fit.',
    price: 29,
    category: 'Tops',
    images: [IMAGE_POOL[0], IMAGE_POOL[11]],
    status: 'published',
    brand: brandTwoId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 8),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 7),
  },
  {
    title: 'Monochrome Windbreaker',
    description: 'Packable windbreaker with breathable mesh lining and matte finish.',
    price: 82,
    category: 'Outerwear',
    images: [IMAGE_POOL[8], IMAGE_POOL[9]],
    status: 'draft',
    brand: brandTwoId,
    isDeleted: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4),
    updatedAt: new Date(now - 1000 * 60 * 60 * 24 * 2),
  },
];

const run = async () => {
  await connectDB();

  const sampleEmails = SAMPLE_USERS.map((item) => item.email.toLowerCase());
  const existingUsers = await User.find({ email: { $in: sampleEmails } }).select('_id email');
  const existingIds = existingUsers.map((user) => user._id);

  if (existingIds.length > 0) {
    await Product.deleteMany({ brand: { $in: existingIds } });
    await User.deleteMany({ _id: { $in: existingIds } });
  }

  const usersToInsert = await Promise.all(
    SAMPLE_USERS.map(async (user) => ({
      name: user.name,
      email: user.email.toLowerCase(),
      role: user.role,
      password: await bcrypt.hash(user.password, 12),
    }))
  );

  const insertedUsers = await User.insertMany(usersToInsert);

  const brandOne = insertedUsers.find((user) => user.email === 'brand.alpha@marketnest.dev');
  const brandTwo = insertedUsers.find((user) => user.email === 'brand.beta@marketnest.dev');

  const products = createProducts(brandOne._id, brandTwo._id);
  const insertedProducts = await Product.insertMany(products);

  console.log('Seed completed successfully.');
  console.log(`Users inserted: ${insertedUsers.length}`);
  console.log(`Products inserted: ${insertedProducts.length}`);
  console.log('Login credentials for all sample users: password = Test@12345');

  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
