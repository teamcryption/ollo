/**
 * Gravy boat: a long low boat with a pouring lip at one end and a looped
 * handle at the other, standing on its own oval saucer. The pointer over it
 * tips the boat forward on the saucer's front edge to pour. At rest it leans
 * back a little, the lip bright. The slider is how far it tips.
 *
 * The pattern: one part tilting about a fixed hinge.
 */
const { Cam, fit, hull, open, poly, proj, rad, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const ell = (cx, cy, a, b, n = 32) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push([cx + a * Math.cos(t), cy + b * Math.sin(t)]); } return o; };
// the boat's plan: an oval drawn out to a point at +x, the lip
const boat = (a, b, lip) => ell(0, 0, a, b, 36).map(([x, y]) => [x > 0 ? x + lip * Math.pow(Math.max(0, 1 - Math.abs(y) / b), 3) * (x / a) : x, y]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.15);
  const PIV = [34, 0, 4]; // the boat tips about the saucer's front edge
  fit(C, [[-44, -26, 0], [44, 26, 0], [-44, 26, 0], [44, -26, 0], [-50, 0, 34], [52, 0, 30], [40, 0, -2], [-40, 0, 66]], 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // saucer: an oval plate
  const sau = solid(g);
  sau.sil.setAttribute("d", poly(hull(ell(0, 0, 42, 24).map(([x, y]) => P(x, y, 0)).concat(ell(0, 0, 42, 24).map(([x, y]) => P(x, y, 3))))));
  sau.cr.setAttribute("d", poly(ell(0, 0, 39, 21).map(([x, y]) => P(x, y, 3))));

  const bg = mk("g", {}, g);
  const handle = mk("path", { class: "nf sil" }, bg);
  const bs = solid(bg);
  const rim = mk("path", { class: "nf" }, bg);
  const lip = mk("path", { class: "nf sil hi" }, bg);
  const foot = ell(0, 0, 16, 9, 28), lower = boat(30, 13, 6), top = boat(34, 17, 16), inner = boat(31, 14.5, 13);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(lerp(-4, Math.min(30, 24 * amp), t)), ca = Math.cos(a), sa = Math.sin(a);
    // rotate about the y axis through PIV: +a lowers the lip end
    const W = ([x, y], z) => { const dx = x - PIV[0], dz = z - PIV[2]; return P(PIV[0] + dx * ca + dz * sa, y, PIV[2] - dx * sa + dz * ca); };
    const R = (ring, z) => ring.map((p) => W(p, z));
    bs.sil.setAttribute("d", poly(hull(R(foot, 3).concat(R(foot, 7), R(lower, 14), R(top, 26)))));
    bs.cr.setAttribute("d", poly(R(inner, 25.5)));
    rim.setAttribute("d", poly(R(inner.map(([x, y]) => [x * 0.9, y * 0.82]), 21)));
    lip.setAttribute("d", open(R(top.slice(18).concat(top.slice(0, 18)).filter(([x]) => x > 26), 26)));
    const hp = [];
    for (let i = 0; i <= 14; i++) { const u = (i / 14) * Math.PI; hp.push(W([-33 - 15 * Math.sin(u), 0], 24 - 15 * (1 - Math.cos(u)) / 2 + 6 * Math.sin(u))); }
    const h2 = hp.slice().reverse().map(([sx, sy]) => [sx + 2.6, sy + 1.6]);
    handle.setAttribute("d", poly(hp.concat(h2)));
  }
  const lerp = (x, y, t) => x + (y - x) * t;
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, 14);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "pour" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 90), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "gravyboat",
  means: "A gravy boat on its saucer: the pointer tips it forward over the lip to pour, and it settles back when the pointer leaves.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[200, 181], [140, 186], [262, 200], null],
  mount,
});
