/**
 * Mobile shelving: five tall shelving units packed together on floor rails,
 * each with a three-spoke handwheel on its end panel. The pointer picks an
 * aisle by where it stands: the units on the near side roll apart along the
 * rails, their handwheels turning, and open the aisle to show the shelves.
 * At rest one aisle stands half open and its wheel is bright. The slider is
 * how wide the aisle opens.
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, W = 16, L = 64, H = 66, Z0 = 2, R = 7, OPEN = 34, FAV = 2, RESTO = 15;
const SH = [16, 32, 48];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  const YM = N * W + OPEN;
  fit(C, [[-4, -4, 0], [L + 10, -4, 0], [-4, YM + 4, 0], [L + 10, YM + 4, 0], [0, 0, H], [L + 10, 0, H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the floor plate and its rails
  const [fr, fi] = rings(-4, -4, L + 4, YM + 4, 3, 1.4);
  put(solid(g), prism(P, front, fr, fi, -2, 0));
  let rd = "";
  for (const x of [8, L - 8]) rd += seg(P(x, -2, 0), P(x, YM + 2, 0)) + seg(P(x + 2, -2, 0), P(x + 2, YM + 2, 0));
  mk("path", { d: rd, class: "nf lo" }, g);

  let s = 5;
  const books = SH.concat([Z0 + 1]).map((z) => {
    const out = []; let x = 4;
    while (x < L - 8) { s = (s * 41 + 7) % 97; const w = 2.5 + (s % 3); if (s % 7) out.push([x, w, 9 + (s % 5)]); x += w + 0.5; }
    return [z, out];
  });

  const units = [];
  for (let k = 0; k < N; k++) {
    const el = solid(g), shelves = mk("path", { class: "nf lo" }, el.g);
    const wheel = mk("path", {}, el.g), spokes = mk("path", { class: "nf lo" }, el.g);
    units.push({ k, y0: k * W, el, shelves, wheel, spokes, y: tween(k >= FAV ? RESTO : 0), last: NaN });
  }

  function draw(u, dy) {
    if (dy === u.last) return;
    u.last = dy;
    const y = u.y0 + dy, y1 = y + W - 0.6;
    const [r, i] = rings(0, y, L, y1, 1.6, 0.9);
    put(u.el, prism(P, front, r, i, Z0, Z0 + H));
    let d = "";
    for (const z of SH) d += seg(P(1, y1, z), P(L - 1, y1, z));
    for (const [z, list] of books) for (const [x, w, h] of list) d += poly([P(x, y1, z), P(x + w, y1, z), P(x + w, y1, z + h), P(x, y1, z + h)]);
    u.shelves.setAttribute("d", d);
    const cy = y + W / 2, cz = Z0 + H * 0.52, xw = L + 3, ring = [];
    for (let t = 0; t < 24; t++) { const a = (t / 24) * 2 * Math.PI; ring.push(P(xw, cy + R * Math.cos(a), cz + R * Math.sin(a))); }
    u.wheel.setAttribute("d", poly(ring) + seg(P(L, cy, cz), P(xw, cy, cz)));
    const rot = dy / R;
    let sp = "";
    for (let j = 0; j < 3; j++) { const a = rot + (j * 2 * Math.PI) / 3; sp += seg(P(xw, cy, cz), P(xw, cy + R * Math.cos(a), cz + R * Math.sin(a))); }
    const ka = rot + 0.4, kp = P(xw + 2, cy + (R + 1.5) * Math.cos(ka), cz + (R + 1.5) * Math.sin(ka));
    sp += open([P(xw, cy + R * Math.cos(ka), cz + R * Math.sin(ka)), kp]);
    u.spokes.setAttribute("d", sp);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const u of units) { draw(u, tval(u.y, now)); if (!tdone(u.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // aisles 1..4 sit between packed units; pick the nearest by screen x on the closed layout
  const mids = []; for (let k = 1; k < N; k++) mids.push(P(L, k * W, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k + 1; } });
    return bd < 18 && Math.abs(mids[best - 1][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : FAV;
    act = a;
    const at = a < 0 ? FAV : a, gap = a < 0 ? RESTO : OPEN * clamp(reach, 0, 1);
    units.forEach((u, k) => {
      tset(u.y, k >= at ? gap : 0, now, Math.abs(k - from) * 45);
      u.wheel.classList.toggle("hi", k === at);
    });
    read.textContent = a < 0 ? "rest" : "aisle " + a;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "compactshelving",
  means: "Mobile shelving on floor rails: the units roll apart on turning handwheels to open the aisle under the pointer.",
  rules: [1, 2, 3, 5, 8],
  range: [0.3, 0.9, 1],
  tour: [[247, 178], [287, 158], [227, 188], null],
  mount,
});
