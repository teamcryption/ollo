/**
 * Fuel tanker: a tractor unit pulling a round tank trailer, a hose reel at
 * the tank's tail. The pointer's place across the frame swings the tank
 * trailer round its kingpin, as on a tight turn. At rest it is swung a few
 * degrees, bright. The slider is how far it swings.
 *
 * The pattern: one turning part (swing).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 50, KX = 150, KY = W / 2, TR = 20, TZ = 34, TL = 150, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.25);
  const fp = [[KX, 0, 0], [205, W, 0], [205, 0, 60], [KX, W, 60]];
  for (const s of [-1, 1]) fp.push([KX - (TL + 4) * Math.cos(rad(50)), KY + s * (TL + 4) * Math.sin(rad(50)) + s * 22, 0], [KX - (TL + 4) * Math.cos(rad(50)), KY + s * (TL + 4) * Math.sin(rad(50)), TZ + TR]);
  fit(C, fp, 200, 166);
  const P = proj(C), front = facing(C);
  const tg = mk("g", {}, svg), g = mk("g", {}, svg);
  const tank = mk("path", { class: "sil hi" }, tg), cap = mk("path", { class: "nf lo" }, tg), band = mk("path", { class: "nf lo" }, tg);
  const reel = mk("path", { class: "nf" }, tg), whl = [0, 1, 2, 3].map(() => mk("path", {}, tg));
  // tractor: chassis, cab, wheels
  const wheel = (pt) => { const o = []; for (let i = 0; i < 22; i++) { const t = (i / 22) * Math.PI * 2; o.push(pt(11 * Math.cos(t), 11 + 11 * Math.sin(t))); } return o; };
  for (const x of [150, 188]) mk("path", { d: poly(wheel((a, b) => P(x + a, 3, b))) }, g);
  const [chr, chi] = rings(128, 5, 208, W - 5, 3, 1);
  put(solid(g), prism(P, front, chr, chi, 10, 18));
  const foot = rrect(172, 0, 208, W, 6, 6), top = rrect(176, 3, 202, W - 3, 5, 6);
  const cab = solid(g);
  cab.sil.setAttribute("d", poly(hull(ringAt(P, foot, 17).concat(ringAt(P, foot, 36), ringAt(P, top, 58)))));
  mk("path", { d: seg(P(207, W - 6, 38), P(201, W - 6, 55)), class: "nf lo" }, g);
  for (const x of [150, 188]) mk("path", { d: poly(wheel((a, b) => P(x + a, W - 3, b))) }, g);

  const yaw = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const W3 = (u, v, z) => P(KX + u * c - v * s, KY + u * s + v * c, z);
    const ring = (u, r) => { const o = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; o.push(W3(u, r * Math.cos(t), TZ + r * Math.sin(t))); } return o; };
    const back = ring(-TL, TR), fr = ring(-12, TR);
    tank.setAttribute("d", poly(hull(back.concat(fr))));
    cap.setAttribute("d", poly(fr));
    band.setAttribute("d", seg(W3(-TL / 2, TR * 0.7, TZ + TR * 0.7), W3(-TL / 2, TR, TZ)) + seg(W3(-TL / 2, TR, TZ), W3(-TL / 2, TR * 0.7, TZ - TR * 0.7)));
    const ro = []; for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; ro.push(W3(-TL - 3, 8 * Math.cos(t), TZ - 6 + 8 * Math.sin(t))); }
    reel.setAttribute("d", poly(ro.concat(ro.slice(0, 1))));
    const ws = [[-128, -W / 2 + 3], [-106, -W / 2 + 3], [-128, W / 2 - 3], [-106, W / 2 - 3]];
    ws.forEach(([u, v], i) => { const o = []; for (let k = 0; k < 22; k++) { const t = (k / 22) * Math.PI * 2; o.push(W3(u + 11 * Math.cos(t), v, 11 + 11 * Math.sin(t))); } whl[i].setAttribute("d", poly(o)); });
    // paint order: far wheels behind the tank, near wheels in front
    const nearer = s >= 0 ? [2, 3] : [2, 3];
    tg.replaceChildren(whl[0], whl[1], tank, cap, band, reel, whl[nearer[0]], whl[nearer[1]]);
  }
  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  function aim(a, r) { yaw.t = a; read.textContent = r ? "rest" : Math.round(a) + "°"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(clamp((sx - 200) / 130, -1, 1) * max), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "fueltanker",
  means: "A fuel tanker: the pointer swings the round tank trailer round its kingpin behind the tractor, as on a tight turn.",
  rules: [1, 3, 5, 6],
  range: [15, 32, 48],
  tour: [[147, 105], [319, 187], [250, 150], null],
  mount,
});
