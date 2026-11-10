const TRI = `body(poly([[12, 3.5], [21, 19.5], [3, 19.5]], 1.5, true))`;
export default {
  weather: [
    `icon('wind-warning', 'High Winds', ['crosswind', 'gale warning', 'windsock', 'warning sign', 'weather'], [${TRI}, accent(scaleD('M8.5 10v7.5M8.5 10l7 1.5v3l-7 1.5', 0.8, 12, 14))])`,
    `icon('fog-warning', 'Fog Warning', ['low visibility', 'mist', 'fog', 'warning sign', 'weather'], [${TRI}, accent('M9.5 12.5h5M8.5 15h7M9.5 17.5h5')])`,
  ],
  logistics: [
    `icon('keep-dry', 'Keep Dry', ['protect from rain', 'waterproof', 'shipping label', 'parcel', 'handling'], [line('M4.5 13a7.5 7.5 0 0 1 15 0ZM12 13v5.5a1.5 1.5 0 0 0 3 0'), line('M8 3.5V5M16 3.5V5')], { noAccent: true })`,
  ],
};
