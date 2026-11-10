const Z = `{ noAccent: true }`;
const DIA = `body(poly([[12, 3], [21, 12], [12, 21], [3, 12]], 1.5, true))`;
const TRI = `body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true))`;
const NO = (glyph) => `${glyph}, line('M6 6l12 12'), line(C(12, 12, 8.5))`;
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const dia = (name, title, tags, d) => `icon('${name}', '${title}', [${T(tags)}, 'road sign', 'driving'], [${DIA}, accent(scaleD(${d}, 0.85, 12, 12))])`;
const tri = (name, title, tags, d) => `icon('${name}', '${title}', [${T(tags)}, 'warning sign', 'road'], [${TRI}, accent(scaleD(${d}, 0.75, 12, 14.5))])`;
export default {
  transport: [
    dia('bridge-ahead', 'Bridge Ahead', ['bridge', 'river crossing', 'overpass'], `'M8 14c2-3 6-3 8 0M8 14v2M16 14v2'`),
    dia('speed-camera-sign', 'Speed Camera Sign', ['traffic camera', 'enforcement', 'radar'], `'M8.5 10h5v4h-5ZM13.5 11l2-1v4l-2-1'`),
    dia('parking-ahead', 'Parking Ahead', ['car park', 'parking', 'lot'], `'M10.5 16V8h2.5a2.5 2.5 0 0 1 0 5h-2.5'`),
    dia('hospital-ahead', 'Hospital Ahead', ['hospital sign', 'emergency', 'medical'], `'M9.5 8.5v7M14.5 8.5v7M9.5 12h5'`),
    tri('cyclists-warning', 'Cyclists Ahead', ['bicycles', 'cycle lane', 'bike'], `'M9 15.5a1.8 1.8 0 1 1-.01 0ZM15 15.5a1.8 1.8 0 1 1-.01 0ZM9 17.3l1.8-3.6h2.7l1.5 3.6M10.8 13.7h-.9'`),
    tri('low-flying-aircraft', 'Low Flying Aircraft', ['airport', 'planes', 'aircraft noise'], `'M8 15h8M12 11.5v7M10 18.5h4M9.5 15l2.5-3.5 2.5 3.5'`),
    `icon('no-cars', 'No Cars', ['motor vehicles prohibited', 'car free', 'pedestrian zone', 'prohibited', 'sign'], [${NO(`line('M8.5 12.5h7l-1-3h-5Z'), body(R(7.5, 12.5, 9, 3, 1)), line(D(9.5, 16.8) + D(14.5, 16.8))`)}], ${Z})`,
  ],
};
