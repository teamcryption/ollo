/**
 * Globe: a desk globe on a tilted axis, held at its poles by a half-meridian
 * ring that stands on a stem and a round foot, its sphere drawn with lines of
 * latitude and longitude. The pointer spins it: the globe turns on its axis
 * toward the side the pointer is on (a spring on its angle), and the meridian
 * facing the pointer is bright. At rest the prime meridian is bright, a little
 * off centre. The slider is how far the globe turns.
 *
 * The pattern: a continuous aim on one angle (spotlights); the globe never
 * moves, so the hit is on the screen, and the meridian is read from the target.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, RR = 50, TILT = 23, STEP = 30, REST = 20, LATS = [-60, -30, 0, 30, 60];
// the axis leans 23° from upright toward screen right; b is the ring's plane beside it, w faces the viewer
const s2 = Math.SQRT1_2, Z = [0, 0, 1], e1 = [s2, -s2, 0], v = [0.866 * s2, 0.866 * s2, 0.5], wx = [s2, s2, 0];
const mix = (p, q, a, b) => p.map((x, j) => x * a + q[j] * b);
const ax = mix(Z, e1, Math.cos(rad(TILT)), Math.sin(rad(TILT))), bx = mix(Z, e1, -Math.sin(rad(TILT)), Math.cos(rad(TILT)));
const ZC = 64, CTR = [0, 0, ZC];
const at = (d, r) => CTR.map((c, j) => c + d[j] * r);
const dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const wrapD = (a) => a - 360 * Math.round(a / 360);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.1);
  const ext = [[-19, -19, 0], [19, 19, 0], [19, -19, 0], [-19, 19, 0]];
  for (let k = 0; k < 24; k++) { const t = (k / 24) * Math.PI * 2; ext.push(at(mix(ax, bx, Math.cos(t), Math.sin(t)), RR + 2), at(mix(e1, Z, Math.cos(t), Math.sin(t)), R)); }
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the foot and stem, straight under the ring's lowest point
  put(solid(g), prism(P, front, circ(19, 48), circ(17.4, 48), 0, 3.5));
  put(solid(g), prism(P, front, circ(4.5, 32), circ(3.6, 32), 3.5, 6));
  put(solid(g), prism(P, front, circ(1.8, 24), null, 6, ZC - RR));

  // the sphere: outline, latitudes (they do not move with the spin), meridians; only the near side is drawn
  const dir = (lat, lon) => { const c = Math.cos(rad(lat)); return ax.map((_, j) => c * Math.sin(rad(lon)) * bx[j] + c * Math.cos(rad(lon)) * wx[j] + Math.sin(rad(lat)) * ax[j]); };
  const near = (ds) => {
    let out = "", run = [];
    for (const d of ds) { if (dot3(d, v) > 0.01) run.push(P(...at(d, R))); else { if (run.length > 1) out += open(run); run = []; } }
    return run.length > 1 ? out + open(run) : out;
  };
  const samples = [];
  for (let la = -90; la <= 90; la += 10) for (let lo = 0; lo < 360; lo += 10) samples.push(P(...at(dir(la, lo), R)));
  mk("path", { class: "sil", d: poly(hull(samples)) }, g);
  const lats = LATS.map((la) => { const q = []; for (let lo = 0; lo <= 360; lo += 5) q.push(dir(la, lo)); return near(q); }).join("");
  mk("path", { class: "nf lo", d: lats }, g);
  const merLo = mk("path", { class: "nf lo" }, g), merHi = mk("path", { class: "nf hi" }, g);

  // the half-meridian ring round the poles, a band of two arcs, with its pivots (the far one only outside the sphere)
  const arc = (r) => { const q = []; for (let t = -4; t <= 184; t += 4) q.push(P(...at(mix(ax, bx, Math.cos(rad(t)), Math.sin(rad(t))), r))); return q; };
  mk("path", { class: "sil", d: poly(arc(RR + 1.6).concat(arc(RR - 1.2).reverse())) }, g);
  mk("path", { class: "nf lo", d: open(arc(RR + 0.2)) }, g);
  mk("path", { class: "nf sil", d: open([P(...at(ax, R)), P(...at(ax, RR - 1.2))]) + open([P(...at(ax, -R * 1.14)), P(...at(ax, -(RR - 1.2)))]) }, g);

  const sp = spring(REST);
  let drawn = NaN, drawnB = -1, bright = 0;
  function draw() {
    const phi = sp.x;
    if (Math.abs(phi - drawn) < 0.02 && drawnB === bright) return;
    drawn = phi; drawnB = bright;
    let lo = "", hi = "";
    for (let m = 0; m < 360 / STEP; m++) {
      const q = []; for (let la = -90; la <= 90; la += 5) q.push(dir(la, m * STEP + phi));
      if (m === bright) hi = near(q); else lo += near(q);
    }
    merLo.setAttribute("d", lo); merHi.setAttribute("d", hi);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // the globe stands still, so the hit is the pointer's offset across its face, read against the spring's target
  const c0 = P(...CTR), b1 = P(...at(e1, 1)), bs = [b1[0] - c0[0], b1[1] - c0[1]], bn = Math.hypot(...bs), RS = R * bn;
  let u = null;
  function retarget() {
    if (u === null) { sp.t = REST; bright = 0; read.textContent = "rest"; }
    else {
      sp.t = REST + gain * u;
      const lon = wrapD(Math.asin(clamp(u, -0.95, 0.95)) * (180 / Math.PI) - sp.t);
      bright = ((Math.round(lon / STEP) % 12) + 12) % 12;
      { const L = wrapD(bright * STEP); read.textContent = "lon " + Math.abs(L) + "°" + (L < 0 ? "W" : L > 0 ? "E" : ""); }
    }
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const dx = sx - c0[0], dy = sy - c0[1];
      u = Math.hypot(dx, dy) > RS * 1.25 ? null : clamp((dx * bs[0] + dy * bs[1]) / (bn * RS), -1, 1);
      retarget();
    },
    leave: () => { u = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (x) => { gain = x; if (u !== null) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "globe",
  means: "A desk globe on a tilted axis: it spins toward the pointer, and the meridian facing the pointer is bright.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 120],
  tour: [[150, 150], [245, 140], [200, 200], null],
  mount,
});
