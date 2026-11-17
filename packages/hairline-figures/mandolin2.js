/**
 * Box grater: a tall tapered four-sided grater with rows of rasps on its
 * faces and a looped handle over its open top, standing on a board. The
 * pointer over it tips the grater forward on its front foot, as a hand tilts
 * it to grate; at rest it leans a little, its handle bright. The hit is a
 * fixed screen box, so it never moves with the drawing.
 */
const {
  Cam, fit, hull, lerp, open, poly, prism, proj, rad, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, facing, mk, pointer, put, register, solid,
} = HL;

const H = 74, Y1 = 12, REST = 6, TILT = 42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.5);
  const rot = (th) => { const c = Math.cos(th), s = Math.sin(th); return (x, y, z) => [x, Y1 + (y - Y1) * c + z * s, -(y - Y1) * s + z * c]; };
  const ext = [];
  for (const th of [0, rad(TILT)]) { const f = rot(th); for (const x of [-16, 16]) for (const y of [-12, 12]) for (const z of [0, H + 14]) ext.push(f(x, y, z)); }
  ext.push([-26, -20, -4], [26, 30, -4]);
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-26, -20, 26, 30, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const foot = rrect(-15, -11, 15, 11, 3, 4), top = rrect(-11, -8, 11, 8, 3, 4), inner = rrect(-9.6, -6.6, 9.6, 6.6, 1.6, 4);
  const body = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g), rasps = mk("path", { class: "nf lo" }, g);
  const handle = mk("path", { class: "nf sil hi" }, g);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const f = rot(rad(REST + v * (TILT - REST) * amt)), Q = (x, y, z) => P(...f(x, y, z));
    const ring = (r, z) => r.map((q) => Q(q.u, q.v, z));
    body.setAttribute("d", poly(hull(ring(foot, 0).concat(ring(top, H)))));
    rim.setAttribute("d", poly(ring(inner, H)));
    let d = "";
    for (let z = 10; z < H - 6; z += 9) {
      const k = z / H, yf = lerp(11, 8, k), xf = lerp(15, 11, k), w = lerp(10, 7, k);
      for (let x = -w; x <= w - 3; x += 5) d += seg(Q(x, yf, z), Q(x + 2.6, yf, z + 1.2));
      for (let y = -lerp(8, 5, k); y <= lerp(8, 5, k) - 2; y += 5) d += seg(Q(xf, y, z), Q(xf, y + 2.6, z + 1.2));
    }
    rasps.setAttribute("d", d);
    const arc = [];
    for (let i = 0; i <= 12; i++) { const a = Math.PI * (i / 12); arc.push(Q(-9 * Math.cos(a), 0, H + 13 * Math.sin(a))); }
    handle.setAttribute("d", open(arc));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "tilt" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 120 && Math.abs(sy - 166) < 140), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "mandolin2",
  means: "A box grater with rasps on its faces: the pointer tips it forward on its front foot, as a hand tilts it to grate.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1],
  tour: [[252, 86], [241, 206], [245, 296], null],
  mount,
});
