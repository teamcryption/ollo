/**
 * Concrete pump: a truck with a cab up front, a turret behind it and a long
 * boom folded in three over its back. The pointer's place across the frame
 * unfolds the boom, each section swinging open on its knuckle until the tip
 * reaches out high over the cab. At rest the boom lies folded, a hair open,
 * its tip section bright. The slider is how far the boom unfolds.
 *
 * The pattern: a chain of parts turning on fixed knuckles (unfold).
 */
const { Cam, clamp, fit, facing, hull, lerp, poly, proj, rrect, seg, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const R = 12, PX = 42, PY = 28, PZ = 48, LS = [72, 66, 58], REST = 0.05;
const rad = (d) => (d * Math.PI) / 180;
const dirs = (u) => [lerp(9, 52, u), lerp(171, 18, u), lerp(5, -18, u)].map(rad);
const chain = (u) => { const pts = [[PX, PZ]]; dirs(u).forEach((a, i) => { const [x, z] = pts[i]; pts.push([x + LS[i] * Math.cos(a), z + LS[i] * Math.sin(a)]); }); return pts; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.62);
  const far = chain(1), mid = chain(0.5);
  fit(C, [[0, 0, 0], [156, 58, 0], [156, 0, 0], [0, 58, 0], [0, 58, 70]].concat(far.concat(mid).map(([x, z]) => [x, PY, z + 6])), 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const disc = (x, y, r) => { const p = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; p.push(P(x + r * Math.cos(t), y, R + r * Math.sin(t))); } return p; };
  const wheel = (x, y0, y1) => { mk("path", { d: poly(hull(disc(x, y0, R).concat(disc(x, y1, R)))) }, g); mk("path", { d: poly(disc(x, y1, 4.5)), class: "nf lo" }, g); };
  const box = (parent, b, r, k, T, s0) => {
    const s = s0 || solid(parent), ring = rrect(b[0], b[1], b[3], b[4], r, 4), inner = rrect(b[0] + k, b[1] + k, b[3] - k, b[4] - k, Math.max(0.5, r - k), 4);
    const at = (rg, z) => rg.map((q) => P(...T([q.u, q.v, z])));
    s.sil.setAttribute("d", poly(hull(at(ring, b[2]).concat(at(ring, b[5])))));
    s.cr.setAttribute("d", poly(at(inner, b[5])));
    return s;
  };
  const id = (p) => p;
  for (const x of [22, 50, 128]) wheel(x, 2, 11);
  box(g, [0, 2, 14, 120, 56, 30], 5, 1.6, id);
  box(g, [122, 4, 14, 156, 54, 66], 7, 1.8, id);
  mk("path", { d: seg(P(150, 54, 50), P(150, 54, 62)) + seg(P(150, 4, 50), P(150, 4, 62)) + seg(P(150, 4, 46), P(150, 54, 46)), class: "nf lo" }, g);
  box(g, [8, 6, 30, 30, 52, 44], 6, 1.6, id);
  box(g, [PX - 9, PY - 9, 30, PX + 9, PY + 9, PZ], 8, 1.6, id);
  for (const x of [22, 50, 128]) wheel(x, 47, 56);
  const secs = LS.map(() => solid(g)), hose = mk("path", { class: "nf lo" }, g);
  secs[2].sil.classList.add("hi");
  const sp = spring(REST);
  let last = NaN;
  function draw(u) {
    if (u === last) return;
    last = u;
    const pts = chain(u), ds = dirs(u);
    ds.forEach((a, i) => {
      const [ox, oz] = pts[i], c = Math.cos(a), s = Math.sin(a), w = 4 - i * 0.6;
      const T = ([x, y, z]) => [ox + x * c - z * s, y, oz + x * s + z * c];
      box(g, [-3, PY - w, -w, LS[i] + 3, PY + w, w], w * 0.8, 1, T, secs[i]);
    });
    const [tx, tz] = pts[3];
    hose.setAttribute("d", seg(P(tx, PY, tz), P(tx + 2, PY, tz - 18)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(Math.round(sp.x * 1000) / 1000); return m; });
  bag.add(B.unregister);
  function aim(u, r) { sp.t = u; read.textContent = r ? "rest" : Math.round(u * 100) + "%"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 60) / 240, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "concretepump",
  means: "A concrete pump truck: the pointer unfolds its three-part boom off the truck's back, the tip reaching out high over the cab.",
  rules: [1, 3, 5, 6],
  range: [0.5, 0.8, 1],
  tour: [[130, 160], [215, 150], [272, 126], null],
  mount,
});
