import { icon, body, line, accent } from '../src/dsl.mjs';
import { R, C, D, E, L, poly, rotateD, translateD } from '../src/geo.mjs';

const rot = (els, deg, dx = 0, dy = 0) => els.map((e) => ({ ...e, d: translateD(rotateD(e.d, deg), dx, dy) }));


export default {
  category: 'maps',
  icons: [
    icon('bus-shelter', 'Bus Shelter', ['bus stop', 'transit', 'waiting', 'station', 'street'], [body(R(3.5, 4, 17, 2.5, 1.25)), line('M5 6.5v14M19 6.5v14'), line(R(7.5, 9, 9, 4, 0.8)), line('M7.5 16.5h9M8.5 16.5v4M15.5 16.5v4')], { noAccent: true }),
    icon('tunnel', 'Tunnel', ['underpass', 'mountain pass', 'road', 'subway', 'passage'], [body('M3.5 20.5V12a8.5 8.5 0 0 1 17 0v8.5Z'), line('M8 20.5v-5a4 4 0 0 1 8 0v5')], { noAccent: true }),
    icon('parking-meter', 'Parking Meter', ['parking', 'meter', 'pay', 'street', 'coins'], [body(R(7, 3.5, 10, 9, 4)), line(R(9.5, 6, 5, 3, 0.6)), line('M12 12.5v8M9.5 20.5h5')], { noAccent: true }),
    icon('bike-rack', 'Bike Rack', ['bicycle parking', 'cycle stand', 'street', 'lock up', 'cycling'], [line('M5 20.5V10a3 3 0 0 1 6 0v10.5M13 20.5V10a3 3 0 0 1 6 0v10.5M3.5 20.5h17')], { noAccent: true }),
  ],
};
