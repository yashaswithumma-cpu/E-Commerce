const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Coupon = require('./models/Coupon');

dotenv.config();

const products = [
  // --- Clothing - Men ---
  { name: "Men's Formal Shirt", description: 'Premium cotton formal shirt for men. Perfect for office and business meetings. Wrinkle-free fabric with smart fit.', price: 39.99, discount: 10, category: 'Clothing', brand: 'FormalWear', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', stock: 60 },
  { name: "Men's Casual Shirt", description: 'Stylish casual shirt for men made from soft cotton blend. Great for everyday wear with jeans or chinos.', price: 29.99, discount: 0, category: 'Clothing', brand: 'CasualCo', image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400', stock: 80 },
  { name: "Men's Slim Fit Jeans", description: 'Modern slim fit jeans for men. Stretch denim fabric for all-day comfort. Available in dark blue and black.', price: 49.99, discount: 15, category: 'Clothing', brand: 'DenimCo', image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400', stock: 45 },
  { name: "Men's Leather Jacket", description: 'Genuine leather jacket for men with quilted lining. Classic biker style with YKK zippers.', price: 159.99, discount: 20, category: 'Clothing', brand: 'LeatherCraft', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', stock: 20 },
  { name: "Men's Cotton T-Shirt Pack", description: 'Pack of 3 premium cotton t-shirts. Soft, breathable, and pre-shrunk. Essential wardrobe staple.', price: 34.99, discount: 0, category: 'Clothing', brand: 'ComfortWear', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 100 },
  { name: "Men's Hoodie", description: 'Warm fleece hoodie for men with kangaroo pocket and adjustable drawstring hood.', price: 44.99, discount: 5, category: 'Clothing', brand: 'UrbanGear', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', stock: 40 },
  { name: "Men's Chino Pants", description: 'Classic chino pants for men. Slim fit with cotton-stretch blend for comfort. Machine washable.', price: 44.99, discount: 10, category: 'Clothing', brand: 'CasualCo', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', stock: 55 },
  { name: "Men's Polo T-Shirt", description: 'Pique cotton polo shirt with ribbed collar. Smart casual style for everyday wear.', price: 24.99, discount: 0, category: 'Clothing', brand: 'ComfortWear', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400', stock: 70 },
  { name: "Men's Blazer", description: 'Slim-fit blazer in stretch fabric. Perfect for office, parties, and casual events. Available in navy and black.', price: 89.99, discount: 15, category: 'Clothing', brand: 'FormalWear', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', stock: 25 },
  { name: "Men's Shorts", description: 'Lightweight cargo shorts for men. Multiple pockets with adjustable waistband. Great for summer.', price: 27.99, discount: 0, category: 'Clothing', brand: 'CasualCo', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400', stock: 80 },
  { name: "Men's Sweatshirt", description: 'Classic crewneck sweatshirt in soft fleece. Relaxed fit, perfect for lounging or layering.', price: 34.99, discount: 10, category: 'Clothing', brand: 'UrbanGear', image: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=400', stock: 60 },
  { name: "Men's Track Pants", description: 'Comfortable track pants with elastic waistband and zip pockets. Ideal for workouts and casual wear.', price: 29.99, discount: 0, category: 'Clothing', brand: 'UrbanGear', image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400', stock: 75 },

  // --- Clothing - Women ---
  { name: "Women's Floral Dress", description: 'Beautiful floral print dress for women. Lightweight fabric with flattering A-line silhouette.', price: 49.99, discount: 15, category: 'Clothing', brand: 'FemmeStyle', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', stock: 35 },
  { name: "Women's Handbag", description: 'Elegant handbag with gold-tone hardware. Spacious interior with multiple pockets and adjustable strap.', price: 69.99, discount: 0, category: 'Clothing', brand: 'LeatherCraft', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', stock: 30 },
  { name: "Women's Yoga Leggings", description: 'High-waisted yoga leggings with moisture-wicking fabric. Squat-proof and perfect for workouts or lounging.', price: 39.99, discount: 10, category: 'Clothing', brand: 'FlexiGrip', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400', stock: 65 },
  { name: "Women's Kurti", description: 'Stylish cotton kurti with embroidery detailing. Comfortable fit for festive and daily wear.', price: 32.99, discount: 0, category: 'Clothing', brand: 'FemmeStyle', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', stock: 50 },
  { name: "Women's Saree", description: 'Elegant silk saree with zari border. Perfect for weddings, festivals, and special occasions.', price: 89.99, discount: 20, category: 'Clothing', brand: 'FemmeStyle', image: 'https://images.unsplash.com/photo-1583391733981-8498408d8ae5?w=400', stock: 20 },
  { name: "Women's Casual Top", description: 'Comfortable casual top for women. Relaxed fit in soft jersey fabric. Available in multiple colors.', price: 22.99, discount: 0, category: 'Clothing', brand: 'FemmeStyle', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400', stock: 90 },
  { name: "Women's Denim Jacket", description: 'Classic denim jacket for women. Versatile layer for any outfit, casual or semi-formal.', price: 59.99, discount: 15, category: 'Clothing', brand: 'DenimCo', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400', stock: 30 },
  { name: "Women's Palazzo Pants", description: 'Flowy palazzo pants in rayon fabric. Wide-leg silhouette perfect for comfort and style.', price: 27.99, discount: 5, category: 'Clothing', brand: 'FemmeStyle', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b8e7d?w=400', stock: 55 },

  // --- Footwear ---
  { name: "Men's Running Shoes", description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Ideal for daily runs and workouts.', price: 89.99, discount: 0, category: 'Footwear', brand: 'RunFit', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', stock: 55 },
  { name: "Men's Casual Sneakers", description: 'Trendy casual sneakers for men. Comfortable memory foam insole and durable rubber sole.', price: 59.99, discount: 10, category: 'Footwear', brand: 'StepEasy', image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400', stock: 70 },
  { name: "Women's Heels", description: 'Elegant block heels for women. Comfortable and stylish for formal events and parties.', price: 54.99, discount: 10, category: 'Footwear', brand: 'StepEasy', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', stock: 40 },
  { name: "Women's Sandals", description: 'Comfortable flat sandals for women. Adjustable straps with cushioned sole. Perfect for summer.', price: 29.99, discount: 0, category: 'Footwear', brand: 'StepEasy', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400', stock: 80 },
  { name: "Sports Shoes Unisex", description: 'High-performance sports shoes with ankle support. Suitable for gym, running, and outdoor activities.', price: 74.99, discount: 20, category: 'Footwear', brand: 'RunFit', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', stock: 45 },
  { name: "Leather Formal Shoes", description: 'Classic leather oxford shoes for men. Polished finish with cushioned insole, ideal for formal occasions.', price: 79.99, discount: 15, category: 'Footwear', brand: 'LeatherCraft', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400', stock: 30 },
  { name: "Slip-On Loafers", description: 'Comfortable slip-on loafers in suede material. Easy to wear, smart casual style.', price: 44.99, discount: 0, category: 'Footwear', brand: 'StepEasy', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400', stock: 50 },
  { name: "Kids Sneakers", description: 'Fun and durable sneakers for kids. Velcro closure for easy on/off. Breathable mesh upper.', price: 34.99, discount: 5, category: 'Footwear', brand: 'RunFit', image: 'https://images.unsplash.com/photo-1519002080671-8df200cae481?w=400', stock: 60 },

  // --- Electronics ---
  { name: 'iPhone 15 Pro Max', description: 'Apple iPhone 15 Pro Max with A17 Pro chip, 48MP camera system, and titanium design. 256GB storage.', price: 1199.99, discount: 5, category: 'Electronics', brand: 'Apple', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', stock: 15 },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Samsung Galaxy S24 Ultra with built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor.', price: 1099.99, discount: 8, category: 'Electronics', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', stock: 20 },
  { name: 'MacBook Air M3', description: 'Apple MacBook Air with M3 chip, 15.3-inch Liquid Retina display, 16GB RAM, 512GB SSD.', price: 1299.99, discount: 0, category: 'Electronics', brand: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', stock: 12 },
  { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Deep bass and comfortable over-ear design.', price: 79.99, discount: 15, category: 'Electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 50 },
  { name: 'Smart Watch Pro', description: 'Advanced smartwatch with heart rate monitoring, GPS, sleep analysis, and 7-day battery. Water resistant to 50m.', price: 199.99, discount: 10, category: 'Electronics', brand: 'TechWear', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', stock: 30 },
  { name: 'Wireless Charging Pad', description: 'Fast wireless charging pad for all Qi devices. Slim design with LED indicator and overcharge protection.', price: 29.99, discount: 0, category: 'Electronics', brand: 'TechWear', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', stock: 90 },
  { name: 'USB-C Hub Adapter', description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging. Compatible with laptops and tablets.', price: 34.99, discount: 0, category: 'Electronics', brand: 'ConnectPro', image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=400', stock: 75 },
  { name: 'Portable Bluetooth Speaker', description: 'Waterproof portable Bluetooth speaker with 360-degree sound. 12-hour battery life and built-in microphone.', price: 49.99, discount: 20, category: 'Electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', stock: 40 },
  { name: 'iPad Air 11-inch', description: 'Apple iPad Air with M2 chip, 11-inch Liquid Retina display, 128GB storage. Supports Apple Pencil Pro.', price: 749.99, discount: 0, category: 'Electronics', brand: 'Apple', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', stock: 18 },
  { name: 'Gaming Mouse RGB', description: 'High-precision gaming mouse with 16000 DPI optical sensor. Customizable RGB lighting and 8 programmable buttons.', price: 49.99, discount: 10, category: 'Electronics', brand: 'GameX', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', stock: 45 },
  { name: 'Mechanical Keyboard', description: 'RGB mechanical gaming keyboard with Cherry MX switches. Full-size with wrist rest and programmable keys.', price: 89.99, discount: 15, category: 'Electronics', brand: 'GameX', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', stock: 30 },
  { name: 'OnePlus 12 Pro', description: 'OnePlus 12 Pro with Snapdragon 8 Gen 3, 50MP triple camera, 100W fast charging and 6.82-inch AMOLED display.', price: 899.99, discount: 5, category: 'Electronics', brand: 'OnePlus', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', stock: 22 },
  { name: 'Dell Inspiron Laptop', description: '15.6-inch FHD laptop with Intel Core i5, 8GB RAM, 512GB SSD, Windows 11 Home.', price: 699.99, discount: 10, category: 'Electronics', brand: 'Dell', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', stock: 18 },
  { name: 'Smart LED TV 55-inch', description: '55-inch 4K Ultra HD Smart LED TV with Dolby Vision, HDR10+, built-in Alexa, and bezel-less design.', price: 549.99, discount: 15, category: 'Electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400', stock: 10 },
  { name: 'True Wireless Earbuds', description: 'True wireless earbuds with active noise cancellation, 36-hour total battery, and IPX5 water resistance.', price: 79.99, discount: 20, category: 'Electronics', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400', stock: 60 },
  { name: 'Drone with Camera', description: 'Foldable GPS drone with 4K UHD camera, 30-minute flight time, and obstacle avoidance sensors.', price: 399.99, discount: 10, category: 'Electronics', brand: 'TechWear', image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400', stock: 12 },
  { name: 'Webcam HD 1080p', description: 'HD 1080p webcam with built-in stereo microphone and ring light. Plug-and-play for PC/Mac.', price: 39.99, discount: 0, category: 'Electronics', brand: 'ConnectPro', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', stock: 80 },
  { name: 'Power Bank 20000mAh', description: '20000mAh portable power bank with fast charging, dual USB-A and USB-C output. Compatible with all devices.', price: 44.99, discount: 15, category: 'Electronics', brand: 'ConnectPro', image: 'https://images.unsplash.com/photo-1609592806207-dc4044a44d09?w=400', stock: 65 },

  // --- Home & Kitchen ---
  { name: 'Non-Stick Cookware Set', description: '10-piece non-stick cookware set. Even heat distribution, easy cleanup, dishwasher safe.', price: 149.99, discount: 25, category: 'Home & Kitchen', brand: 'KitchenElite', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', stock: 20 },
  { name: 'Stainless Steel Water Bottle', description: 'Double-wall insulated bottle keeps drinks cold 24hrs or hot 12hrs. BPA-free, leak-proof, 750ml.', price: 34.99, discount: 0, category: 'Home & Kitchen', brand: 'HydroLife', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', stock: 75 },
  { name: 'Coffee Maker Machine', description: 'Programmable coffee maker with 12-cup capacity. Auto-shutoff, brew strength selector, and permanent filter.', price: 59.99, discount: 10, category: 'Home & Kitchen', brand: 'BrewMaster', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400', stock: 25 },
  { name: 'Air Purifier', description: 'HEPA air purifier for rooms up to 300 sq ft. Captures 99.97% of allergens, dust, and pet dander. Quiet operation.', price: 129.99, discount: 15, category: 'Home & Kitchen', brand: 'PureAir', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400', stock: 18 },
  { name: 'Electric Kettle 1.7L', description: 'Fast-boiling electric kettle with auto shut-off, boil-dry protection, and 360-degree rotational base.', price: 39.99, discount: 0, category: 'Home & Kitchen', brand: 'KitchenElite', image: 'https://images.unsplash.com/photo-1525857197721-1a13ff6eeca2?w=400', stock: 50 },
  { name: 'Microwave Oven 25L', description: '25-litre microwave oven with grill function, 10 power levels, and child lock. Stainless steel interior.', price: 139.99, discount: 10, category: 'Home & Kitchen', brand: 'KitchenElite', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400', stock: 15 },
  { name: 'Blender & Mixer', description: 'High-power blender with 6 stainless steel blades. Perfect for smoothies, soups, and sauces. 1200W motor.', price: 69.99, discount: 20, category: 'Home & Kitchen', brand: 'KitchenElite', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400', stock: 35 },
  { name: 'Food Storage Containers Set', description: 'Set of 10 airtight food storage containers in various sizes. BPA-free, microwave and dishwasher safe.', price: 29.99, discount: 0, category: 'Home & Kitchen', brand: 'HydroLife', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400', stock: 100 },
  { name: 'Bed Sheet Set - King', description: 'King-size 100% cotton bed sheet set with 2 pillow covers. 400 thread count, soft and durable.', price: 49.99, discount: 15, category: 'Home & Kitchen', brand: 'HomeComfort', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400', stock: 40 },
  { name: 'Curtains Blackout Set', description: 'Pair of blackout curtains. Thermal insulated, noise reducing, machine washable. 52x84 inches each.', price: 44.99, discount: 0, category: 'Home & Kitchen', brand: 'HomeComfort', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', stock: 60 },
  { name: 'Wall Clock', description: 'Modern minimalist wall clock. Silent quartz movement, 12-inch diameter. Suits any interior decor.', price: 24.99, discount: 0, category: 'Home & Kitchen', brand: 'HomeComfort', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400', stock: 70 },
  { name: 'Scented Candle Set', description: 'Set of 6 hand-poured soy wax candles in assorted scents. Up to 50 hours burn time each.', price: 34.99, discount: 10, category: 'Home & Kitchen', brand: 'HomeComfort', image: 'https://images.unsplash.com/photo-1602178601413-dc664de65d07?w=400', stock: 80 },

  // --- Sports & Fitness ---
  { name: 'Yoga Mat Premium', description: 'Extra thick 6mm yoga mat with non-slip surface. Includes carrying strap for easy transport.', price: 49.99, discount: 0, category: 'Sports', brand: 'FlexiGrip', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', stock: 60 },
  { name: 'Dumbbell Set 20kg', description: 'Adjustable dumbbell set from 2kg to 20kg. Space-saving design with secure locking mechanism.', price: 89.99, discount: 10, category: 'Sports', brand: 'IronFit', image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400', stock: 25 },
  { name: 'Exercise Resistance Bands', description: 'Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and carry bag.', price: 24.99, discount: 0, category: 'Sports', brand: 'FlexiGrip', image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', stock: 85 },
  { name: 'Gym Gloves', description: 'Padded gym workout gloves with wrist support. Anti-slip grip, breathable fabric. For men and women.', price: 19.99, discount: 0, category: 'Sports', brand: 'IronFit', image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400', stock: 100 },
  { name: 'Skipping Rope', description: 'Adjustable speed skipping rope with ball bearings. Lightweight aluminum handles, suitable for all fitness levels.', price: 14.99, discount: 0, category: 'Sports', brand: 'FlexiGrip', image: 'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400', stock: 120 },
  { name: 'Sports Water Bottle', description: 'BPA-free sports water bottle, 1-litre capacity with straw lid. Perfect for gym and outdoor activities.', price: 17.99, discount: 5, category: 'Sports', brand: 'HydroLife', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400', stock: 150 },
  { name: 'Football', description: 'Size 5 FIFA quality pro football. PU leather surface with latex bladder for consistent bounce and feel.', price: 34.99, discount: 0, category: 'Sports', brand: 'IronFit', image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400', stock: 60 },
  { name: 'Cricket Bat', description: 'English willow cricket bat, Grade 1. Ideal for professional and club cricket. With protective cover.', price: 79.99, discount: 10, category: 'Sports', brand: 'IronFit', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400', stock: 30 },
  { name: 'Badminton Racket Set', description: 'Set of 2 professional badminton rackets with 3 shuttlecocks and carry bag. Great for beginners and intermediates.', price: 44.99, discount: 15, category: 'Sports', brand: 'FlexiGrip', image: 'https://images.unsplash.com/photo-1593280405106-e438ebe93f5a?w=400', stock: 45 },
  { name: 'Treadmill', description: 'Motorized treadmill with 12 preset programs, 1-12 km/h speed, foldable design for home use.', price: 499.99, discount: 20, category: 'Sports', brand: 'IronFit', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400', stock: 8 },
  { name: 'Protein Shaker Bottle', description: 'BPA-free protein shaker with mixing ball, 700ml capacity. Leak-proof screw lid. Easy to clean.', price: 12.99, discount: 0, category: 'Sports', brand: 'IronFit', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400', stock: 200 },

  // --- Books ---
  { name: 'JavaScript: The Complete Guide', description: 'Comprehensive guide to modern JavaScript. Covers ES6+, async/await, Node.js, React, and more.', price: 39.99, discount: 30, category: 'Books', brand: 'TechPress', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', stock: 45 },
  { name: 'Rich Dad Poor Dad', description: 'What the rich teach their kids about money that the poor and middle class do not. Personal finance classic.', price: 14.99, discount: 0, category: 'Books', brand: 'BestReads', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', stock: 100 },
  { name: 'Atomic Habits', description: 'An easy and proven way to build good habits and break bad ones. Bestselling guide to lasting change.', price: 16.99, discount: 10, category: 'Books', brand: 'BestReads', image: 'https://images.unsplash.com/photo-1589829085813-0164dd8c05f1?w=400', stock: 90 },
  { name: 'Python Crash Course', description: 'Fast-paced introduction to Python programming. Learn to build projects and automate tasks.', price: 29.99, discount: 20, category: 'Books', brand: 'TechPress', image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', stock: 55 },
  { name: 'The Alchemist', description: 'Paulo Coelho\'s masterpiece about following your dreams. One of the most beloved novels of all time.', price: 12.99, discount: 0, category: 'Books', brand: 'BestReads', image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400', stock: 120 },
  { name: 'Think and Grow Rich', description: 'Napoleon Hill\'s timeless guide to success and wealth-building. A must-read for every entrepreneur.', price: 11.99, discount: 0, category: 'Books', brand: 'BestReads', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', stock: 100 },
  { name: 'Clean Code', description: 'A handbook of agile software craftsmanship by Robert C. Martin. Essential reading for developers.', price: 34.99, discount: 0, category: 'Books', brand: 'TechPress', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', stock: 50 },
  { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. Insightful and practical.', price: 15.99, discount: 0, category: 'Books', brand: 'BestReads', image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400', stock: 80 },
  { name: 'The Power of Now', description: 'Eckhart Tolle\'s guide to spiritual enlightenment. A transformative exploration of living in the present.', price: 13.99, discount: 10, category: 'Books', brand: 'BestReads', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', stock: 70 },

  // --- Beauty & Personal Care ---
  { name: 'Face Moisturizer SPF 30', description: 'Daily facial moisturizer with SPF 30. Hyaluronic acid and vitamin E for hydrated, glowing skin.', price: 28.99, discount: 0, category: 'Beauty', brand: 'GlowUp', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', stock: 80 },
  { name: 'Perfume for Men', description: 'Long-lasting men\'s perfume with woody and citrus notes. Perfect for daily wear and special occasions.', price: 54.99, discount: 10, category: 'Beauty', brand: 'ScentPro', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', stock: 35 },
  { name: 'Hair Dryer Professional', description: '2000W professional hair dryer with ionic technology. 3 heat settings, 2 speed settings, and concentrator nozzle.', price: 39.99, discount: 15, category: 'Beauty', brand: 'StylePro', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', stock: 40 },
  { name: 'Makeup Brush Set', description: '12-piece professional makeup brush set. Soft synthetic bristles with wooden handles. Includes carrying case.', price: 32.99, discount: 0, category: 'Beauty', brand: 'GlowUp', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', stock: 50 },
  { name: 'Women\'s Perfume', description: 'Floral and fruity fragrance for women. Notes of rose, jasmine, and peach. 100ml Eau de Parfum.', price: 49.99, discount: 15, category: 'Beauty', brand: 'ScentPro', image: 'https://images.unsplash.com/photo-1588514912908-1c67afedb8c6?w=400', stock: 40 },
  { name: 'Electric Toothbrush', description: 'Rechargeable electric toothbrush with 5 cleaning modes and 2-minute timer. Removes 10x more plaque.', price: 49.99, discount: 0, category: 'Beauty', brand: 'StylePro', image: 'https://images.unsplash.com/photo-1559591937-6d89c3e5f4da?w=400', stock: 55 },
  { name: 'Sunscreen SPF 50+', description: 'Broad spectrum SPF 50+ sunscreen. Lightweight, non-greasy formula. Water-resistant for 80 minutes.', price: 19.99, discount: 0, category: 'Beauty', brand: 'GlowUp', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', stock: 100 },
  { name: 'Vitamin C Serum', description: '20% Vitamin C face serum with hyaluronic acid. Brightens skin, reduces dark spots and wrinkles.', price: 24.99, discount: 10, category: 'Beauty', brand: 'GlowUp', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', stock: 70 },
  { name: 'Beard Trimmer', description: 'Cordless beard trimmer with 20 length settings. Stainless steel blades, USB charging, waterproof.', price: 34.99, discount: 0, category: 'Beauty', brand: 'StylePro', image: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=400', stock: 45 },
  { name: 'Shampoo & Conditioner Set', description: 'Sulfate-free shampoo and conditioner set for damaged and frizzy hair. With argan oil and keratin.', price: 22.99, discount: 0, category: 'Beauty', brand: 'StylePro', image: 'https://images.unsplash.com/photo-1585232350479-a6bd0e244e77?w=400', stock: 90 },

  // --- Toys & Games ---
  { name: 'LEGO Classic Brick Box', description: '1000-piece classic LEGO brick set. Endless building possibilities for kids aged 4+. Includes storage box.', price: 49.99, discount: 0, category: 'Toys', brand: 'PlayWorld', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', stock: 40 },
  { name: 'Remote Control Car', description: 'High-speed remote control car with 4WD and 2.4GHz controller. Up to 30 km/h, for all terrains.', price: 44.99, discount: 10, category: 'Toys', brand: 'PlayWorld', image: 'https://images.unsplash.com/photo-1608889176406-c33c1c7e16a5?w=400', stock: 35 },
  { name: 'Board Game - Chess Set', description: 'Premium wooden chess set with hand-carved pieces. Folding board with storage for pieces. Standard tournament size.', price: 39.99, discount: 0, category: 'Toys', brand: 'PlayWorld', image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400', stock: 25 },
  { name: 'Jigsaw Puzzle 1000 Pieces', description: '1000-piece jigsaw puzzle featuring scenic mountain landscape. High-quality thick pieces, made from recycled materials.', price: 19.99, discount: 0, category: 'Toys', brand: 'PlayWorld', image: 'https://images.unsplash.com/photo-1612404819009-e4cf47b43e27?w=400', stock: 60 },
  { name: 'Doll House', description: 'Wooden doll house with furniture and accessories. 4 rooms, 2 floors. For children aged 3 and above.', price: 69.99, discount: 15, category: 'Toys', brand: 'PlayWorld', image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400', stock: 20 },

  // --- Bags & Luggage ---
  { name: 'Laptop Backpack 15.6 inch', description: 'Water-resistant laptop backpack with USB charging port. Multiple compartments with anti-theft pocket.', price: 44.99, discount: 10, category: 'Bags', brand: 'TravelPro', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', stock: 55 },
  { name: 'Travel Trolley Bag', description: '24-inch hardshell spinner luggage with TSA lock. Lightweight with 4 360-degree spinner wheels.', price: 89.99, discount: 20, category: 'Bags', brand: 'TravelPro', image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400', stock: 30 },
  { name: 'Gym Bag', description: 'Large capacity gym duffel bag with shoe compartment and wet pocket. Adjustable shoulder strap.', price: 34.99, discount: 0, category: 'Bags', brand: 'IronFit', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', stock: 50 },
  { name: 'Tote Bag Canvas', description: 'Eco-friendly canvas tote bag with inner pocket. Large capacity for shopping, beach, or everyday use.', price: 19.99, discount: 0, category: 'Bags', brand: 'TravelPro', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400', stock: 100 },

  // --- Stationery & Office ---
  { name: 'Ballpoint Pens Set', description: 'Set of 20 smooth-writing ballpoint pens in assorted colors. Comfortable grip, long-lasting ink.', price: 12.99, discount: 0, category: 'Stationery', brand: 'OfficeEssentials', image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400', stock: 200 },
  { name: 'A4 Notebook - 200 Pages', description: 'Premium hard-cover A4 notebook with 200 ruled pages. Acid-free paper, lay-flat binding.', price: 9.99, discount: 0, category: 'Stationery', brand: 'OfficeEssentials', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400', stock: 150 },
  { name: 'Desk Organizer', description: 'Bamboo desk organizer with 5 compartments. Keeps pens, scissors, papers, and accessories tidy.', price: 22.99, discount: 10, category: 'Stationery', brand: 'OfficeEssentials', image: 'https://images.unsplash.com/photo-1584697964154-6f68cff12b0f?w=400', stock: 75 },
  { name: 'Highlighter Set 8 Colors', description: 'Set of 8 vibrant highlighters with chisel tip. Quick-dry, non-smear ink. For studying and planning.', price: 8.99, discount: 0, category: 'Stationery', brand: 'OfficeEssentials', image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400', stock: 200 },

  // --- Food & Grocery ---
  { name: 'Organic Green Tea', description: 'Premium organic green tea from Darjeeling. Rich in antioxidants. 100 tea bags per pack.', price: 14.99, discount: 0, category: 'Grocery', brand: 'NatureFresh', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', stock: 200 },
  { name: 'Honey Pure Raw 500g', description: '100% pure raw honey, unprocessed and unfiltered. Rich flavor with natural antioxidants.', price: 18.99, discount: 10, category: 'Grocery', brand: 'NatureFresh', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', stock: 100 },
  { name: 'Mixed Dry Fruits Pack', description: 'Premium mixed dry fruits pack: almonds, cashews, raisins, pistachios, walnuts. 500g pack.', price: 24.99, discount: 5, category: 'Grocery', brand: 'NatureFresh', image: 'https://images.unsplash.com/photo-1511297568834-d0b98cad1c6c?w=400', stock: 80 },
  { name: 'Olive Oil Extra Virgin 1L', description: 'Cold-pressed extra virgin olive oil from Mediterranean olives. Rich flavor, ideal for cooking and salads.', price: 21.99, discount: 0, category: 'Grocery', brand: 'NatureFresh', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', stock: 90 },
];


const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@shopez.com' });
    if (!admin) {
      await User.create({ name: 'Admin', email: 'admin@shopez.com', password: 'admin123', role: 'admin' });
      console.log('Admin created: admin@shopez.com / admin123');
    } else {
      console.log('Admin already exists');
    }

    const buyer = await User.findOne({ email: 'buyer@test.com' });
    if (!buyer) {
      await User.create({ name: 'Test Buyer', email: 'buyer@test.com', password: 'test123', role: 'buyer' });
      console.log('Buyer created: buyer@test.com / test123');
    }

    let seller = await User.findOne({ email: 'seller@test.com' });
    if (!seller) {
      seller = await User.create({ name: 'Test Seller', email: 'seller@test.com', password: 'test123', role: 'seller' });
      console.log('Seller created: seller@test.com / test123');
    }

    const categoryNames = [...new Set(products.map((p) => p.category))];
    for (const name of categoryNames) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({ name });
        console.log(`Category created: ${name}`);
      }
    }

    await Product.deleteMany({});
    for (const p of products) {
      await Product.create({ ...p, seller: seller._id });
    }
    console.log(`${products.length} sample products created`);

    const couponExists = await Coupon.findOne({ code: 'WELCOME10' });
    if (!couponExists) {
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      await Coupon.create({
        code: 'WELCOME10', discountType: 'percentage', discountValue: 10,
        minOrderValue: 20, maxDiscount: 50, usageLimit: 100, expiresAt: expiry,
      });
      console.log('Coupon created: WELCOME10 (10% off)');
    }

    console.log('\n=== Login Credentials ===');
    console.log('Admin:  admin@shopez.com / admin123');
    console.log('Buyer:  buyer@test.com  / test123');
    console.log('Seller: seller@test.com / test123');
    console.log('Coupon: WELCOME10 (10% off, max ₹50)');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
