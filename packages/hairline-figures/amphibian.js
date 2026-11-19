/**
 * Amphibious car: a boat hull below, a rounded car cabin with a windscreen
 * line above, and four wheels on swing arms at its sides. Bring the pointer
 * to it and the wheels fold up and out of the water, spreading from the wheel
 * nearest the pointer, turning flat as they lift. At rest the wheels stand
 * down, the rear pair half tucked, the front near wheel bright. The slider is
 * how far they fold.
 *
 * The pattern: parts folding with a stagger by distance (tween).
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, tween, tset, tval, tdone, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 8, L = 9.85, B0 = 0.42;
const WH = [[20, -1], [-20, -1], [20, 1], [-20, 1]];
const RESTR = [0.05, 0.45, 0.05, 0.45];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxR = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-36, -34, 0], [36, 34, 0], [-36, 34, 30], [36, -34, 30], [36, 34, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const far = mk("g", {}, g), body = mk("g", {}, g), near = mk("g", {}, g);
  const wheels = WH.map(([x, s], i) => {
    const par = s < 0 ? far : near;
    const arm = mk("path", { class: "nf lo" }, par), disc = mk("path", { class: "sil" }, par), hub = mk("path", { class: "nf" }, par);
    return { x, s, arm, disc, hub, tw: tween(RESTR[i]), last: NaN };
  });
  const [hr, hi] = rings(-36, -13, 36, 13, 11, 2);
  put(solid(body), prism(P, front, hr, hi, 6, 15));
  const [cr, ci] = rings(-22, -11, 16, 11, 8, 2);
  put(solid(body), prism(P, front, cr, ci, 15, 26));
  const ws = mk("path", { class: "nf lo" }, body);
  ws.setAttribute("d", open([P(16, -10, 22), P(16, 10, 22)]) + open([P(-14, -11, 21), P(-14, 11, 21)]));

  let chosen = 0;
  function drawWheel(w, r, hiOn) {
    w.disc.classList.toggle("hi", hiOn);
    if (Math.abs(r - w.last) < 0.002) return;
    w.last = r;
    const b = B0 + r, hy = w.s * 12, hz = 18;
    const cy = hy + w.s * L * Math.sin(b), cz = hz - L * Math.cos(b);
    const ey = -w.s * Math.sin(r), ez = Math.cos(r);
    const pts = [];
    for (let k = 0; k < 24; k++) { const t = (k / 24) * Math.PI * 2, a = WR * Math.cos(t), e = WR * Math.sin(t); pts.push(P(w.x + a, cy + e * ey, cz + e * ez)); }
    w.disc.setAttribute("d", poly(pts));
    const hp = [];
    for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2, a = 3 * Math.cos(t), e = 3 * Math.sin(t); hp.push(P(w.x + a, cy + e * ey, cz + e * ez)); }
    w.hub.setAttribute("d", poly(hp));
    w.arm.setAttribute("d", open([P(w.x, hy, hz), P(w.x, cy, cz)]));
  }
  let active = false;
  function drawAll(now) {
    wheels.forEach((w, i) => drawWheel(w, tval(w.tw, now), active ? i === chosen : i === 2));
  }
  drawAll(0);

  const B = register(stage, (dt, now) => { drawAll(now); return wheels.some((w) => !tdone(w.tw, now)); });
  bag.add(B.unregister);

  let lastP = null;
  function aim(p) {
    const now = performance.now();
    const w = p && unproj(C, p[0], p[1], 0);
    active = !!w && Math.abs(w[0]) < 48 && Math.abs(w[1]) < 34;
    if (!active) {
      wheels.forEach((wh, i) => tset(wh.tw, RESTR[i], now, 0));
      read.textContent = "rest";
    } else {
      let best = 1e9;
      wheels.forEach((wh, i) => { const d = Math.hypot(w[0] - wh.x, w[1] - wh.s * 16); if (d < best) { best = d; chosen = i; } });
      const c = wheels[chosen];
      wheels.forEach((wh, i) => { const d = (Math.abs(wh.x - c.x) > 0 ? 1 : 0) + (wh.s !== c.s ? 1 : 0); tset(wh.tw, clamp(maxR, 0, 2), now, d * 45); });
      read.textContent = "up " + Math.round((maxR * 180) / Math.PI);
    }
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => { lastP = p; aim(p); }, leave: () => { lastP = null; aim(null); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxR = (v * Math.PI) / 180; if (lastP) aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "amphibian",
  means: "An amphibious car afloat: bring the pointer near and its four wheels fold up and out of the water, spreading from the nearest.",
  rules: [2, 3, 5, 8],
  range: [40, 90, 100],
  tour: [[210, 199], [250, 160], [190, 107], null],
  mount,
});
