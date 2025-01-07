// seedData.js
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Product = require('./src/models/productModel'); // Replace with the correct path to your Product model
const User = require('./src/models/accountModel'); // Replace with the correct path to your User model
require('dotenv').config(); // Nạp biến môi trường từ file .env

// MongoDB connection string
const mongoURI = process.env.MONGO_URI // Change this to your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Array of Products to seed
const products = [
  {
    name: 'Air Force 1',
    brand: 'Nike',
    price: 100,
    size: ['31', '32', '33', '34', '40'],
    color: 'White',
    stock: 50,
    description: 'A great product',
    images: '/images/Air Force 1.png',
  },
  {
      name: 'Air Jordan 1 Low',
      brand: 'Nike',
      price: 150,
      size: ['32', '33', '34'],
      color: 'Blue',
      stock: 30,
      description: 'Another great product',
      images: '/images/Air Jordan 1 Low.png',
  },
  {
      name: 'CORTEZ',
      brand: 'Nike',
      price: 200,
      size: ['33', '34', '35'],
      color: 'Green',
      stock: 20,
      description: 'Yet another great product',
      images: '/images/CORTEZ.png',
  },
  {
      name: 'Killshot 2 Leather',
      brand: 'Nike',
      price: 250,
      size: ['36', '37'],
      color: 'Black',
      stock: 15,
      description: 'Stylish black product',
      images: '/images/Killshot 2 Leather.png',
  },
  {
      name: 'Samba OG',
      brand: 'Adidas',
      price: 300,
      size: ['38', '39', '40'],
      color: 'White',
      stock: 10,
      description: 'Sleek white product',
      images: '/images/Samba OG.png',
  },
  {
      name: 'Stan Smith',
      brand: 'Adidas',
      price: 350,
      size: ['35', '36', '37'],
      color: 'Yellow',
      stock: 25,
      description: 'Bright yellow product',
      images: '/images/Stan Smith.png',
  },
  {
      name: 'TEAKWONDO W',
      brand: 'Adidas',
      price: 400,
      size: ['40', '41'],
      color: 'Pink',
      stock: 5,
      description: 'Soft pink product',
      images: '/images/TEAKWONDO W.png',
  },
  {
      name: 'Carpenter Trousers',
      brand: 'Nike',
      price: 300,
      size: ['32', '34', '36', '38', '40'],
      color: 'White',
      stock: 20,
      description: 'Part of our Nike Life collection, these carpenter trousers are made for all the things you do in life outside of sport. Sturdy and tough, the cotton twill fabric still breaks in with wear. A relaxed-fitting, straight-leg design helps you tackle all your daily tasks in comfort. The 7-pocket, workwear-inspired look brings a heavy dose of function to your wardrobe.',
      images: '/images/Carpenter Trousers.jpg',
  },
  {
      name: 'Crew-Neck Jumper',
      brand: 'Nike',
      price: 270,
      size: ['32', '33', '36', '39', '42'],
      color: 'Burgundy Crush/White',
      stock: 32,
      description: 'This classic knit jumper offers a clean look and comfortable feel for cool-weather days. The relaxed fit gives you a bit of room to layer, and the crew-neck design means it can be paired with just about anything.',
      images: '/images/Crew-Neck Jumper.jpg',
  },
  {
      name: 'Running Jacket',
      brand: 'Nike',
      price: 250,
      size: ['32', '33', '41'],
      color: 'Black/Black',
      stock: 40,
      description: 'An essential piece to your running game gets an update on the Nike Repel Miler Jacket. It_s built to take on wet weather with a water-repellent design and a hood. The packable design features a look steeped in Nike_s heritage. This product is made from 100% recycled polyester fibres.',
      images: '/images/Running Jacket.jpg',
  },
  {
      name: 'Knit Fairway Cardigan',
      brand: 'Nike',
      price: 310,
      size: ['33', '34', '35', '39'],
      color: 'Sail/Black',
      stock: 50,
      description: 'Comfort meets classic versatility with the Nike Club Cardigan. The lightweight knit fabric feels extra soft and comfy, while the button placket and ribbed trim give your outfit a polished look. Pull it on over a graphic tee for cafe cruising or pair it with an Oxford shirt for an evening out.',
      images: '/images/Knit Fairway Cardigan.jpg',
  },
  {
      name: 'Nike Football Replica Shirt',
      brand: 'Nike',
      price: 330,
      size: ['34', '41'],
      color: 'Varsity Maize/Pine Green/Lucky Green',
      stock: 25,
      description: 'This Reissue shirt looks like it came straight from the vault. With signature colours, embroidered logos and other vintage details, this stitch-for-stitch remake pays homage to the iconic shirts Nike made for the 1998 Brazil National team. It also celebrates one of the all-time greats, whose power, pace and skills took the football world by storm the same year.',
      images: '/images/Nike Football Replica Shirt.jpg',
  },
  {
      name: 'Nike Dri-FIT ADV Football Shirt',
      brand: 'Nike',
      price: 315,
      size: ['34', '35', '36','39'],
      color: 'Soar/Club Gold/White',
      stock: 30,
      description: 'Who doesn_t love an early 2000s throwback? Coming to you all the way from 2002, the 2023/24 Chelsea Away kit mixes classic colours and an all-over digital graphic with blue accents on the collar and sleeves. Inside the shirt, you will find a hidden London Chelsea F.C. design. Our Match collection pairs authentic design details with lightweight, quick-drying technology to help keep the world_s biggest football stars cool and comfortable on the pitch.',
      images: '/images/Nike Dri-FIT ADV Football Shirt.jpg',
  },
  {
      name: 'Fleece Pullover Hoodie',
      brand: 'Nike',
      price: 330,
      size: ['34', '40'],
      color: 'Black/Anthracite/Summit White',
      stock: 40,
      description: 'After walking through the glacial wonders of Iceland, our design team was inspired to make a fleece-lined hoodie to help keep you warm and repel water for cool hikes and wintry walks. Plus, we made it with at least 75% sustainable materials, using a blend of organic cotton and recycled polyester fibres.',
      images: '/images/Fleece Pullover Hoodie.jpg',
  },
  {
      name: 'Oversized T-shirt',
      brand: 'Nike',
      price: 250,
      size: ['34', '35'],
      color: 'Sail',
      stock: 30,
      description: 'Designed with an intentionally oversized fit, this tee is ready for whatever the day brings. With a Jumpman woven patch on the chest, no one will question what you_re about.',
      images: '/images/Oversized T-shirt.jpg',
  },
  {
      name: 'Dri-FIT Hooded Versatile Jacket',
      brand: 'Nike',
      price: 280,
      size: ['34', '35','39', '41'],
      color: 'Ashen Slate',
      stock: 30,
      description: 'Built for running, training and yoga, this stretchy, sweat-wicking jacket is designed to help you stay fresh through your entire workout. Cut with a relaxed feel, this hooded full-zip keeps your essentials close with pocket storage on the way to and from the gym.',
      images: '/images/Dri-FIT Hooded Versatile Jacket.jpg',
  },
  {
      name: 'French Terry Shorts',
      brand: 'Nike',
      price: 210,
      size: ['35','36', '37'],
      color: 'Black/White',
      stock: 50,
      description: 'These soft fleece shorts are made for comfort and laid-back, nostalgic style. Designed to fit above the knee, they_re roomy through the seat and thighs while the stretchy encased elastic waist keeps them comfy where it counts. The embroidered Swoosh on the left thigh gives you a clean, effortless finish.',
      images: '/images/French Terry Shorts.jpg',
  },
  {
      name: 'T-Shirt',
      brand: 'Nike',
      price: 230,
      size: ['35','38', '39'],
      color: 'Black',
      stock: 30,
      description: 'Made from 100% cotton and with an oversized fit, this tee has a familiar feel right out of the bag.',
      images: '/images/T-Shirt.jpg',
  },
  {
      name: 'Nike Dri-FIT Football Pullover Hoodie',
      brand: 'Nike',
      price: 275,
      size: ['35','36', '37', '39'],
      color: 'Light Orewood Brown/White',
      stock: 20,
      description: 'Part of our Standard Issue Collection, this hoodie combines classic looks with a performance feel for today_s athlete. Sweat-wicking technology helps you stay dry and comfortable, so you can take this to the pitch and back home to cheer on Liverpool F.C.. The zip pocket can store essentials, like your phone when taking a break from the league table.',
      images: '/images/Nike Dri-FIT Football Pullover Hoodie.jpg',
  },
  {
      name: 'Everyday Crew Socks',
      brand: 'Nike',
      price: 30,
      size: ['35','36', '37', '39', '40'],
      color: 'Multi-Colour',
      stock: 100,
      description: 'Your go-to, everyday, soft and reliable socks. Sweat-wicking technology keeps your feet cool and dry while a snug arch band feels supportive.',
      images: '/images/Everyday Crew Socks.jpg',
  },
  {
      name: 'Crew Socks',
      brand: 'Nike',
      price: 40,
      size: ['35','36', '37','40','41','42'],
      color: 'Multi-Colour',
      stock: 100,
      description: 'Who says Nike Air is only for sneakers? Show off your love for heritage Nike style with these comfy socks. Sweat-wicking technology helps keep your feet dry and cool while a band around the arch of your foot helps provide a snug and supportive fit.',
      images: '/images/Crew Socks.jpg',
  },
  {
      name: 'Dri-FIT Woven Diamond Shorts',
      brand: 'Nike',
      price: 212,
      size: ['35','36', '39'],
      color: 'Black/White/White',
      stock: 40,
      description: 'Defence, attack or rest days, our Diamond shorts can handle it all. With a hem that falls at the mid-thigh, they allow you to move freely on the court, in the gym or when kicking it with friends. Lightweight stretch-woven fabric uses our sweat-wicking technology to help you stay cool, comfortable and focused on your next move.',
      images: '/images/Dri-FIT Woven Diamond Shorts.jpg',
  },
  {
      name: 'Training Ankle Socks',
      brand: 'Nike',
      price: 50,
      size: ['35','36','40'],
      color: 'Black/White',
      stock: 100,
      description: 'Power through your workout with the Nike Everyday Cushioned Socks. The thick terry sole gives you extra comfort for foot drills and lifts, while a ribbed arch band wraps your midfoot for a supportive feel.',
      images: '/images/Training Ankle Socks.jpg',
  },
  {
      name: 'Shorts',
      brand: 'Nike',
      price: 170,
      size: ['35','36', '37','40','42'],
      color: 'Black/White',
      stock: 62,
      description: 'Much more than a base layer, the Nike Pro Dri-FIT Shorts hug you with lightweight fabric that keeps you feeling dry, cool and supported from warm-ups through to cool-downs. They_re made from at least 75% recycled polyester fibres in a stretchy design that helps you move at full intensity during your toughest workouts or competitions.',
      images: '/images/Shorts.jpg',
  },
  {
      name: 'Trousers',
      brand: 'Nike',
      price: 300,
      size: ['35','36', '37','38'],
      color: 'Black/Black',
      stock: 50,
      description: 'Modern utility meets comfort in these essential trousers. Diamond-shaped cargo pockets reference iconic Jordan design lines and give you extra room for all your must-have stuff. And to get that perfect fit, you_ve got an elastic waistband, button fly and bungees with adjustable toggles at the cuffs.',
      images: '/images/Trousers.jpg',
  },
  {
      name: 'All-Over Print Skate Chore Coat',
      brand: 'Nike',
      price: 390,
      size: ['35','36', '37','41'],
      color: 'Midnight Navy/White',
      stock: 66,
      description: 'Lightweight and durable, this printed chore coat from Nike SB brings the goods for everyday wear. The sturdy Ripstop fabric is breathable and comfy, whether you_re on your board or off. Front patch pockets give you a safe spot to drop in your keys and phone. Pair it up with a tee and the matching skate overalls for a uniform look.',
      images: '/images/All-Over Print Skate Chore Coat.jpg',
  },
  {
      name: 'Carpenter Trousers 2',
      brand: 'Nike',
      price: 290,
      size: ['35','36', '37','39', '40'],
      color: 'Black/Black',
      stock: 41,
      description: 'Part of our Nike Life collection, these carpenter trousers are made for all the things you do in life outside of sport. Sturdy and tough, the cotton twill fabric still breaks in with wear. A relaxed-fitting, straight-leg design helps you tackle all your daily tasks in comfort. The 7-pocket, workwear-inspired look brings a heavy dose of function to your wardrobe.',
      images: '/images/Carpenter Trousers 2.jpg',
  },
  {
      name: 'Bộ 3 Đôi Tất Logo',
      brand: 'Adidas',
      price: 30,
      size: ['35','36', '37','39', '40'],
      color: 'White / White / Royal Blue',
      stock: 100,
      description: 'This trio of adidas socks ensures you always have a pair to wear. They_re made from a soft, stretchy cotton blend, with a ribbed cuff that stays in place without being too tight. An adidas graphic on the cuff adds a sporty touch to these socks.',
      images: '/images/Bộ 3 Đôi Tất Logo.jpg',
  },
  {
      name: 'Bộ 6 Đôi Tất Cổ Cao Lót Đệm',
      brand: 'Adidas',
      price: 35,
      size: ['35','36', '37','39', '40'],
      color: 'Olive Strata / Grey Strata / Wonder Alumina / Aurora Ruby',
      stock: 100,
      description: 'Keep your feet comfortable all day long with this set of six pairs of adidas high-top socks. The soft cushioning hugs your feet with every stride, while the arch support helps support your feet. The classic design sits high above the ankle, making it perfect for wearing with sneakers or low-tops. The new 3 Bar logo adds a fresh, modern twist to the classic design.',
      images: '/images/Bộ 6 Đôi Tất Cổ Cao Lót Đệm.jpg',
  },
  {
      name: 'Bộ 3 Đôi Tất Logo',
      brand: 'Adidas',
      price: 30,
      size: ['35','36', '37','39', '40'],
      color: 'White / White / Wonder Alumina',
      stock: 100,
      description: 'This trio of adidas socks ensures you always have a pair to wear. They_re made from a soft, stretchy cotton blend, with a ribbed cuff that stays put without being too tight. An adidas graphic on the cuff adds a sporty touch to these socks.',
      images: '/images/Bộ 3 Đôi Tất Logo.jpg',
  },
  {
      name: 'Bộ 6 Đôi Tất Cổ Cao Lót Đệm',
      brand: 'Adidas',
      price: 32,
      size: ['35','36', '37','39', '40'],
      color: 'Violet Fusion / Ice Lavender / Glow Blue / Clear Pink',
      stock: 100,
      description: 'Keep your feet comfortable all day long with this set of six pairs of adidas high-top socks. The soft cushioning hugs your feet with every stride, while the arch support helps support your feet. The classic design sits high above the ankle, making it perfect for wearing with sneakers or low-tops. The new 3 Bar logo adds a fresh, modern twist to the classic design.',
      images: '/images/Bộ 6 Đôi Tất Cổ Cao Lót Đệm.jpg',
  },
  {
      name: 'Bộ 3 Đôi Tất Trơn Cổ Cao',
      brand: 'Adidas',
      price: 36,
      size: ['35','36', '37','39', '40'],
      color: 'White / Medium Grey Heather / Black',
      stock: 100,
      description: 'After all, it_s the little details that make the difference. These adidas Originals socks add a classic, comfortable touch to any outfit. Whether you’re dressed up or down, these high-top socks are the perfect choice thanks to their soft cotton blend. The signature 3-Stripes at the collar add a sporty touch. Each pair blends fashion and function into a polished, everyday item.',
      images: '/images/Bộ 3 Đôi Tất Trơn Cổ Cao.jpg',
  },
  {
      name: 'TR CREW S 6P',
      brand: 'Adidas',
      price: 30,
      size: ['35','36', '37','39', '40'],
      color: 'Off White / Semi Court Green / Collegiate Green',
      stock: 100,
      description: 'Whether you_re out for a walk or hanging out with friends, these adidas high socks will keep you comfortable. The soft, stretchy fabric hugs your foot, while cushioning in key areas keeps you on track no matter how busy your schedule gets. The eye-catching ankle print pays tribute to our sporting heritage. By choosing to recycle, we can reuse materials that have already been created, helping to reduce waste. Our renewable material choices help us reduce our dependence on finite resources. Our products that use a mix of recycled and renewable materials contain a minimum of 50% of these materials combined.',
      images: '/images/TR CREW S 6P.jpg',
  },
  {
      name: 'Bộ 3 Đôi Tất Cổ Trung',
      brand: 'Adidas',
      price: 29,
      size: ['35','36', '37','39', '40'],
      color: 'White / Preloved Ruby / Preloved Ink / Collegiate Green',
      stock: 100,
      description: 'Basics never go wrong. And these adidas high socks are an easy everyday option for the office, the skatepark or anywhere in between. The comfortable cotton blend provides soft cushioning, while the 3-Stripes and technical Trefoil logo add classic style to your wardrobe. For days when you don_t know what to wear, start with these socks and build from the bottom up.',
      images: '/images/Bộ 3 Đôi Tất Cổ Trung.jpg',
  },
  {
      name: 'Bộ 6 Đôi Tất Cổ Lửng',
      brand: 'Adidas',
      price: 24,
      size: ['35','36', '37','39', '40'],
      color: 'White',
      stock: 100,
      description: 'Show off your Trefoil logo anywhere with adidas Half-Neck Socks. With six pairs of socks, you_ll be comfortable every day. Add your favorite sneakers or sandals and you_re ready to step out with confidence.',
      images: '/images/Bộ 6 Đôi Tất Cổ Lửng.jpg',
  },
  {
      name: 'Tất Trefoil cao đến cổ chân 3 đôi',
      brand: 'Adidas',
      price: 26,
      size: ['35','36', '37','39', '40'],
      color: 'White / Better Scarlet / Blue / Green',
      stock: 100,
      description: 'These ankle-high socks feature a seamed heel and toe for a sleek look. The iconic Trefoil logo is woven into the sock, along with the 3-Stripes on the collar. Each set includes three pairs of athletic socks.',
      images: '/images/Tất Trefoil cao đến cổ chân 3 đôi.jpg',
  },
  {
      name: 'CLS ST PANTS M',
      brand: 'Adidas',
      price: 250,
      size: ['35','36', '40'],
      color: 'Focus Olive / Focus Olive',
      stock: 50,
      description: 'Outstading pants',
      images: '/images/CLS ST PANTS M.jpg',
  },
  {
      name: 'Quần Sweat Pant Neuclassics',
      brand: 'Adidas',
      price: 300,
      size: ['35','36', '39'],
      color: 'Black/White',
      stock: 40,
      description: 'Every great outfit starts with a great pair of pants. When you_re looking for effortless style, opt for these adidas sweat pants. They_re made from a soft cotton blend and feature a loose fit for a laid-back look. Ribbed hems keep the cold out, and the brand_s signature 3-Stripes detail.',
      images: '/images/Quần Sweat Pant Neuclassics.jpg',
  },
  {
      name: 'Parachute Pants',
      brand: 'Adidas',
      price: 310,
      size: ['37','39', '40'],
      color: 'Silver Pebble',
      stock: 21,
      description: 'With a loose, laid-back design, these adidas pants keep you comfortable wherever you go. Keep it straight or cinch in the drawstring for a more dramatic effect, and the adjustable bungee hem lets you shape your look. With a minimalist design and subtle 3-Stripes, these pants are a versatile new addition to your everyday wardrobe.',
      images: '/images/Parachute Pants.jpg',
  },
  {
      name: 'Quần Track Pant Firebird Viền Logo Ba Lá',
      brand: 'Adidas',
      price: 361,
      size: ['35','38', '41'],
      color: 'Black',
      stock: 50,
      description: 'Zip pockets keep your essentials close to you on the go in these adidas track pants. The regular fit gives you room to move without restriction. The interlock fabric ensures durability and comfort. With the adidas Firebird being one of the most iconic adidas designs, these track pants carry a rich heritage of sport and street, combining both in one style.',
      images: '/images/Quần Track Pant Firebird Viền Logo Ba Lá.jpg',
  },
  {
      name: 'Quần Track Pant Firebird Classics Adicolor',
      brand: 'Adidas',
      price: 299,
      size: ['35','36', '37','39'],
      color: 'Magic Beige',
      stock: 40,
      description: 'A classic now dressed in Adicolor. This must-have item features the iconic Firebird style you know and love—but with a modern fit and fresh colorway. An embroidered Trefoil logo on the side and 3-Stripes down the leg are signature adidas, while an elasticized drawstring waistband ensures a comfortable fit. Pack your essentials into the zipped pockets and you_re ready to tackle the day.',
      images: '/images/Quần Track Pant Firebird Classics Adicolor.jpg',
  },
  {
      name: 'Quần VRCT 2',
      brand: 'Adidas',
      price: 285,
      size: ['35','36', '37','39', '40'],
      color: 'Black',
      stock: 25,
      description: 'Contrast trims and premium embroidery give these adidas woven pants a little extra edge to help you stand out from the crowd. Made from lightweight woven nylon, they have a flexible elastic waistband for a snug fit and a drawstring for a secure fit. The elasticated hem wraps around the ankle to keep your trainers from getting caught and tangled. Side zip pockets ensure functionality, while the "the Brand with the Three Stripes" detail pays homage to adidas heritage.',
      images: '/images/Quần VRCT 2.jpg',
  },
  {
      name: 'Quần Túi Hộp Quad',
      brand: 'Adidas',
      price: 285,
      size: ['35','36','37'],
      color: 'Black',
      stock: 55,
      description: 'These adidas cargo pants will help you conquer the new day in style and comfort. The loose-fitting style has a laid-back feel, with multiple pockets to hold small items on the go. Pair these pants with your favorite trainers and a classic t-shirt for a comfortable, simple yet stylish outfit.',
      images: '/images/Quần Túi Hộp Quad.jpg',
  },
  {
      name: 'Quần Tập adistrong Designed for Training',
      brand: 'Adidas',
      price: 253,
      size: ['35','36','40', '42'],
      color: 'Black/Black',
      stock: 25,
      description: 'These durable training pants from adidas are built tough for the toughest barbell workouts. Beat squats and dead lifts without worrying about wear and tear thanks to reinforced stitching and abrasion-resistant fabric. Moisture-wicking AEROREADY technology keeps you dry from the first set to the last rep.',
      images: '/images/Quần Tập adistrong Designed for Training.jpg',
  },
  {
      name: 'Quần 3 Sọc Own the Run',
      brand: 'Adidas',
      price: 266,
      size: ['35','36','39'],
      color: 'Black',
      stock: 15,
      description: 'Crafted from soft fabric, these pants are the ultimate running staple with a classic, streamlined design. Reflective details ensure you stand out in low light, while AEROREADY technology keeps you dry. Two zip pockets add functionality to these comfortable pants for everyday running.',
      images: '/images/Quần 3 Sọc Own the Run.jpg',
  },
  {
      name: 'Quần adidas Z.N.E. Mới',
      brand: 'Adidas',
      price: 270,
      size: ['35','38','40', '42'],
      color: 'Magic Beige',
      stock: 42,
      description: 'Celebrate the power of teamwork in these adidas pants. Whether you’re training or watching the game, the double-knit spacer fabric blocks out the cold so you can focus on connecting with your teammates. The matte-finish printed stripes inspired by the football field make it easy to show off your love of sport and team spirit wherever you go.',
      images: '/images/Quần adidas Z.N.E. Mới.jpg',
  },
  {
      name: 'Quần Track Pant Clubhaus',
      brand: 'Adidas',
      price: 310,
      size: ['35','36','40'],
      color: 'Collegiate Navy',
      stock: 45,
      description: 'Show your best form and then head to the clubhouse to celebrate your victory. These adidas golf pants are made from soft cotton-blend piqué for comfort throughout the round. These track pants feature pleats to complete the design.',
      images: '/images/Quần Track Pant Clubhaus.jpg',
  },
  {
      name: 'Quần Tập adistrong Designed for Training',
      brand: 'Adidas',
      price: 253,
      size: ['35','36','40', '42'],
      color: 'Black/Black',
      stock: 25,
      description: 'These durable training pants from adidas are built tough for the toughest barbell workouts. Beat squats and dead lifts without worrying about wear and tear thanks to reinforced stitching and abrasion-resistant fabric. Moisture-wicking AEROREADY technology keeps you dry from the first set to the last rep.',
      images: '/images/Carpenter Trousers 2.jpg',
  },
  {
      name: 'Giày Golf Lo BOOST Adicross',
      brand: 'Adidas',
      price: 322,
      size: ['40', '42'],
      color: 'Savanna / Coral Fusion / Court Green',
      stock: 55,
      description: 'Grab your clubs, slip on these adidas golf shoes, and chart your own course. Inspired by adventure, the Lo Adicross golf shoes combine bold design and high-tech technology for on and off the course. From the waterproof upper to the full BOOST midsole, these shoes help you stride across the course in style and feel energized. The Gripmore® spikeless outsole provides enhanced traction, from the course to the driving range to the street.',
      images: '/images/Giày Golf Lo BOOST Adicross.jpg',
  },
  {
      name: 'Quần Golf Chino Adicross',
      brand: 'Adidas',
      price: 299,
      size: ['35','36','41', '42'],
      color: 'Black',
      stock: 18,
      description: 'These adidas Adicross chinos will take you from the golf course to the rest of the day. Combining a modern, progressive design with golf-ready style, feel and functionality, they are made from stretchy ripstop fabric with an ultra-lightweight yet sturdy construction so you can play 18 holes in comfort. They_re versatile all-day pants, so after you_ve hit that last putt, you can move right on to your next meeting.',
      images: '/images/Quần Golf Chino Adicross.jpg',
  },
  {
      name: 'Quần Progressive Go-To',
      brand: 'Adidas',
      price: 255,
      size: ['40','41', '42'],
      color: 'Black',
      stock: 19,
      description: 'Refresh your golfing outfit with the look and feel of these adidas golf pants. The loose fit gives a casual feel and spacious pockets ensure ultimate versatility. From friendly rounds to social time, these pants keep you feeling your best without compromising your game.',
      images: '/images/Quần Progressive Go-To.jpg',
  },
  {
      name: 'Giày Golf Đinh Liền Solarmotion BOA 24',
      brand: 'Adidas',
      price: 445,
      size: ['35','36','38','40','42'],
      color: 'Cloud White / Silver Metallic / Blue Burst',
      stock: 44,
      description: 'Feel the difference from the moment you step onto the course. With grip, flexibility and stability, these adidas Solarmotion golf shoes deliver exceptional comfort and performance whether you’re playing with friends or competing. The quick-fit BOA® system lets you adjust the fit with just one hand. The lightweight foam cushioning cushions your every step, while the Adiwear outsole grips the turf for a secure base for your swing. The water-resistant upper keeps your feet dry in wet conditions, and the zip-up panel adds protection while remaining sleek and discreet.',
      images: '/images/Giày Golf Đinh Liền Solarmotion BOA 24.jpg',
  }

  
];
  

// Array of Users to seed
const users = [
  {
    email: 'admin1@gmail.com',
    username: 'admin1',
    password: 'adminpassword1', // Store hashed password in production
    role: 'admin',
    images: '/images/avatar_default.png',
  },
  {
    email: 'customer1@gmail.com',
    username: 'customer1',
    password: 'customerpassword1', // Store hashed password in production
    role: 'customer',
    images: '/images/avatar_default.png',
  },
  {
    email: 'customer2@gmail.com',
    username: 'customer2',
    password: 'customerpassword2', // Store hashed password in production
    role: 'customer',
    images: '/images/avatar_default.png',
  },
  // Add more users as needed
];

// Function to seed products
const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Deletes all products before seeding
    await Product.insertMany(products); // Insert multiple products
    console.log('Products seeded successfully');
  } catch (err) {
    console.error('Error seeding products:', err);
  }
};

// Function to seed users
const seedUsers = async () => {
  try {
    await User.deleteMany(); // Deletes all users before seeding

    // Hash passwords and insert users one by one
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    await User.insertMany(users); // Insert multiple users with hashed passwords
    console.log('Users seeded successfully');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

// Run both seeding functions
const seedAll = async () => {
  await seedProducts();
  await seedUsers();
  mongoose.connection.close(); // Close the connection after seeding
};

seedAll();