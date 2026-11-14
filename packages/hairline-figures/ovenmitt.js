/**
 * Oven door: a countertop oven whose door is hinged along its foot. The pointer
 * on the floor in front of the oven is how far the door is pulled down: the
 * nearer the reader, the wider it swings, and once it lies open the baking tray
 * slides out over it. At rest the door stands a little ajar, its handle bright.
 *
 * The pattern: a continuous swing (a spring on one angle); the hit is on the
 * floor's plane, which never moves.
 */
const {
  Cam, facing, fit, fillet, hull, open, poly, prism, proj, rings, seg, unproj, spring, stepS, clamp, lerp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 52, H = 52, HZ = 5, L = 40, X0 = 6, X1 = 58, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [W, 0, H], [0, D + L + 4, 0], [W, D + L + 4, 0], [0, 0, H + 6], [W, D, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the body, its feet and the cavity on its door face
  const [ring, inner] = rings(0, 0, W, D, 5, 1.6);
  put(solid(g), prism(P, front, ring, inner, 2, H));
  for (const [x, y] of [[6, D - 4], [W - 6, D - 4], [W - 6, 6]]) put(solid(g), prism(P, front, rings(x - 2.5, y - 2.5, x + 2.5, y + 2.5, 1.2, 0.5)[0], null, 0, 2.2));
  const cav = fillet([P(X0 + 3, D, HZ + 3), P(X1 - 3, D, HZ + 3), P(X1 - 3, D, HZ + L - 3), P(X0 + 3, D, HZ + L - 3)], [2, 2, 2, 2]);
  mk("path", { class: "lo nf", d: poly(cav) }, g);
  const racks = [];
  for (const z of [16, 30]) racks.push(open([P(X0 + 4, D, z), P(X0 + 4, D - 14, z), P(X1 - 4, D - 14, z), P(X1 - 4, D, z)]));
  mk("path", { class: "lo nf", d: racks.join("") }, g);
  // knobs on the side face
  for (const z of [H - 10, H - 22]) mk("path", { class: "nf sil", d: poly(fillet([P(W, D - 6, z), P(W, D - 12, z), P(W, D - 12, z + 5), P(W, D - 6, z + 5)], [2, 2, 2, 2])) }, g);
  const tray = solid(g), door = solid(g);
  const handle = mk("path", { class: "nf sil hi", d: "" }, door.g);
  const sp = spring(rad(REST), { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, trayFirst = true;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), t = 3;
    const at = (x, l, o) => P(x, D + l * s + o * c, HZ + l * c - o * s);
    const outer = [at(X0, 0, t), at(X1, 0, t), at(X1, L, t), at(X0, L, t)];
    const back = [at(X0, 0, 0), at(X1, 0, 0), at(X1, L, 0), at(X0, L, 0)];
    const h = hull(outer.concat(back));
    door.sil.setAttribute("d", poly(fillet(h, h.map(() => 1.6), 3)));
    door.cr.setAttribute("d", poly(fillet(outer, [1.4, 1.4, 1.4, 1.4], 3)));
    handle.setAttribute("d", seg(at(X0 + 8, L - 5, t + 3.5), at(X1 - 8, L - 5, t + 3.5)) + seg(at(X0 + 8, L - 5, t), at(X0 + 8, L - 5, t + 3.5)) + seg(at(X1 - 8, L - 5, t), at(X1 - 8, L - 5, t + 3.5)));
    const out = clamp((a - rad(55)) / rad(32), 0, 1) * 30;
    if (out < 0.5) put(tray, { sil: "", crease: "" });
    else {
      const [tr, ti] = rings(X0 + 5, D - 12 + out, X1 - 5, D + out, 2, 1.2);
      put(tray, prism(P, front, tr, ti, 28, 30));
    }
    const tf = a < rad(60);
    if (tf !== trayFirst) { trayFirst = tf; if (tf) door.g.after(tray.g); else tray.g.after(door.g); }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let deg = REST, on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -14 && x < W + 14 && y > -10 && y < D + L + 24) { on = true; deg = lerp(REST, 90, clamp((y - D * 0.4) / (L + 10), 0, 1)); }
    }
    sp.t = rad(deg);
    door.sil.classList.toggle("hi", on);
    read.textContent = on ? "door " + Math.round(deg) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "ovenmitt",
  means: "An oven whose door swings down as the pointer comes near; opened wide, the baking tray slides out over it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[205, 212], [179, 238], [127, 264], null],
  mount,
});
