import { icon, body, line } from '../src/dsl.mjs';
import { R, C } from '../src/geo.mjs';

export default {
  category: 'logistics',
  icons: [
    icon('parcel-tracking', 'Parcel Tracking', ['track package', 'shipment location', 'delivery status', 'where is my order', 'courier'], [body(R(3, 8, 12, 12, 2)), line('M9 8.2v3.5'), body('M17.5 14s-3.5-3.2-3.5-6a3.5 3.5 0 0 1 7 0c0 2.8-3.5 6-3.5 6Z', { cover: true }), line(C(17.5, 8, 1.1))], { noAccent: true }),
    icon('parcel-return', 'Parcel Return', ['return package', 'send back', 'refund item', 'returns', 'reverse logistics'], [body(R(3.5, 10, 13, 10.5, 2)), line('M10 10.2v3.5'), line('M20 11V8a3 3 0 0 0-3-3h-4.5M14.5 3 12.5 5l2 2')], { noAccent: true }),
    icon('cold-chain', 'Cold Chain', ['refrigerated', 'frozen goods', 'cool box', 'temperature controlled', 'perishable'], [body(R(3, 10, 11.5, 10.5, 2)), line('M8.75 10.2v3.5'), line('M18 4v6M15.4 5.5l5.2 3M15.4 8.5l5.2-3')], { noAccent: true }),
    icon('drone-delivery', 'Drone Delivery', ['air delivery', 'uav parcel', 'flying courier', 'last mile', 'drone drop'], [body(R(8, 5, 8, 3.5, 1.5)), line('M3.5 6.5H8M16 6.5h4.5M3 4h4M17 4h4M5 4v2.5M19 4v2.5'), line('M12 8.5v3'), body(R(8.5, 11.5, 7, 7, 1.5)), line('M12 11.7v2.5')], { noAccent: true }),
  ],
};
