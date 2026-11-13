import { B } from './mods.mjs';
const add = {
  amphora: [`body('M7 3.5h5v2c3 1 4 4 4 7 0 3-2.5 5.5-6.5 5.5S3 15.5 3 12.5c0-3 1-6 4-7Z'), line('M7 6 4.5 8M12 6l2.5 2')`, 'home', 'Amphora'],
  ashtray: [`body('M3 12h13l-1 3.5a1 1 0 0 1-1 .7H5a1 1 0 0 1-1-.7Z'), line('M6 12l4-4M11.5 6c.6-.8.6-1.5 0-2.3')`, 'home', 'Ashtray'],
  'beer-keg': [`body(R(4, 4, 11, 14, 3)), line('M4.2 8h10.6M4.2 14h10.6M9.5 4V2.8')`, 'food', 'Beer Keg'],
  'bike-lock': [`line('M6 10V7a3.5 3.5 0 0 1 7 0v3'), body(R(4, 10, 11, 8, 1.5)), line('M9.5 13v2')`, 'security', 'Bike Lock'],
  bollard: [`body('M7 6a2.5 2.5 0 0 1 5 0v12H7Z'), line('M7.2 9h4.6M5 18h9')`, 'transport', 'Bollard'],
  'bundt-cake': [`body('M3 14c0-4 3-7 6.5-7s6.5 3 6.5 7c0 1.5-1 2.5-2.5 2.5h-8C4 16.5 3 15.5 3 14Z'), line(E(9.5, 9, 1.5, 0.8)), line('M6 10l1 6.3M13 10l-1 6.3')`, 'food', 'Bundt Cake'],
  carousel: [`body(poly([[3, 8], [9.5, 3.5], [16, 8]], 0.6, true)), line('M5 8v9M14 8v9M9.5 8v9M3 17.5h13M5 12h1.5M13 12h1.5')`, 'celebration', 'Carousel'],
  'cereal-box': [`body(R(5, 3.5, 9, 15, 1)), line('M5.2 7h8.6'), line(C(9.5, 12, 2))`, 'food', 'Cereal Box'],
  'cooler-box': [`body(R(3, 8, 13, 9, 1.5)), line('M3.2 11h12.6'), line('M7 8V5.5h5V8')`, 'travel', 'Cooler Box'],
  'doll-house': [`body(poly([[3, 9], [9.5, 3.5], [16, 9], [16, 18], [3, 18]], 0.6, true)), line('M3.2 13h12.6M9.5 9v9'), line(R(5, 10, 2.5, 2, 0.4))`, 'gaming', 'Doll House'],
  drawer: [`body(R(3.5, 5, 12, 12, 1.2)), line('M3.7 11h11.6M8 8h3M8 14h3')`, 'home', 'Drawer'],
  dumpster: [`body('M3 9h13l-1.5 8h-10Z'), line('M3 9 5 6h9l2 3'), line(C(5.5, 18, 0.8)), line(C(13.5, 18, 0.8))`, 'home', 'Dumpster'],
  'egg-carton': [`body('M3 11h13v3a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 14Z'), line('M5 11a1.5 2 0 0 1 3 0M8.2 11a1.5 2 0 0 1 3 0M11.4 11a1.5 2 0 0 1 3 0')`, 'food', 'Egg Carton'],
  'fire-truck': [`body(R(3, 9, 9, 6, 1)), body('M12 10.5h2.5l1.5 2v2.5h-4Z'), line('M4 7.5 10 5M4 9 3.5 7.5'), line(C(5.5, 16, 1.3)), line(C(13, 16, 1.3))`, 'transport', 'Fire Truck'],
  'fly-swatter': [`body(R(3, 3.5, 7, 7, 1)), line('M5.5 3.7v6.6M7.5 3.7v6.6M3.2 7h6.6'), line('M9 10l7 8')`, 'home', 'Fly Swatter'],
  'hedge-trimmer': [`body(R(3, 9, 5, 5, 1.2)), line('M8 11.5h8M9 10v3M11 10v3M13 10v3M15 10v3'), line('M4 14v3h3')`, 'tools', 'Hedge Trimmer'],
  'knife-block': [`body('M4 9 12 6l3 12H5Z'), line('M7 8 6 3.5M9.5 7 9 3M12 6.5l.5-3')`, 'food', 'Knife Block'],
  'leaf-blower': [`body(R(3, 8, 7, 7, 2)), line('M10 11.5h6.5'), line('M5.5 8V5.5h3V8'), line('M14 9l2 1.5-2 1.5')`, 'tools', 'Leaf Blower'],
  'night-light': [`body(R(5, 9, 9, 9, 2)), line('M8 9V5M11 9V5'), line('M7.5 14c1 1 3 1 4 0')`, 'home', 'Night Light'],
  'pool-table': [`body(R(3, 6, 13, 8, 1.5)), line('M5 14v4M14 14v4'), line(D(5.5, 8.5) + D(13.5, 8.5) + D(5.5, 11.5) + D(13.5, 11.5))`, 'gaming', 'Pool Table'],
  'popcorn-machine': [`body(R(4, 5, 11, 10, 1.5)), line('M4.2 8h10.6M6 15v3M13 15v3'), line(D(7, 11) + D(9.5, 12) + D(12, 11))`, 'food', 'Popcorn Machine'],
  'pressure-cooker': [`body(R(3, 9, 13, 8, 2)), line('M5 9a4.5 3 0 0 1 9 0M9.5 6V4M14 11h2.5')`, 'food', 'Pressure Cooker'],
  'rain-boots': [`body('M5 3.5h5V12l4 2.5V18H5Z'), line('M5.2 7h4.6'), line('M11 4h3v5')`, 'fashion', 'Rain Boots'],
  'rope-ladder': [`line('M5 3.5v15M14 3.5v15M5 6.5h9M5 10h9M5 13.5h9M5 17h9')`, 'sports', 'Rope Ladder'],
  'shoe-rack': [`line('M3 7h13M3 12h13M3 17h13M4 7v11M15 7v11'), body('M6 9.5h4.5c1 0 1.5.6 1.5 1.5H6Z')`, 'home', 'Shoe Rack'],
  'side-table': [`body(E(9.5, 7, 6, 2)), line('M9.5 9v8M6 18h7')`, 'home', 'Side Table'],
  'spice-rack': [`line('M3 11h13M3 17h13'), body(R(4, 6, 3, 5, 0.6)), body(R(8, 6, 3, 5, 0.6)), body(R(12, 6, 3, 5, 0.6)), body(R(5, 13, 3, 4, 0.6)), body(R(11, 13, 3, 4, 0.6))`, 'food', 'Spice Rack'],
  'towel-rack': [`line('M3 6h13M4 5v2M15 5v2'), body('M6 6h7v11H6Z'), line('M6.2 13h6.6')`, 'home', 'Towel Rack'],
  tumbler: [`body('M5 5h9l-1.2 12.5a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9Z'), line('M5.3 8h8.4M11 5 12.5 2')`, 'food', 'Tumbler'],
  'tv-stand': [`body(R(3, 4, 13, 8, 1.2)), body(R(4, 14, 11, 4, 0.8)), line('M9.5 12v2')`, 'home', 'TV Stand'],
  'wine-cooler': [`body(R(4.5, 3.5, 10, 15, 1.5)), line('M4.7 7h9.6'), line('M7 10h5M7 12.5h5M7 15h5')`, 'home', 'Wine Cooler'],
  'wood-stove': [`body(R(4, 8, 11, 8, 1.2)), line('M7 4v4M6 16v2.5M13 16v2.5'), line(R(6.5, 10.5, 6, 3.5, 0.8))`, 'home', 'Wood Stove'],
};
const cat = {}; const label = {};
for (const [k, [geo, c, l]] of Object.entries(add)) { if (B[k]) continue; B[k] = geo; cat[k] = c; label[k] = l; }
globalThis.BULK_CAT = Object.assign(globalThis.BULK_CAT ?? {}, cat);
globalThis.BULK_LABEL = Object.assign(globalThis.BULK_LABEL ?? {}, label);
export default {};
