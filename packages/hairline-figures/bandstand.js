/**
 * Band stand: a folding music stand, three splayed legs, a shaft, and a wide
 * desk leaning back with a ledge along its foot. The pointer is the player:
 * the desk swivels on the shaft to face them, on a spring. At rest it faces
 * the viewer, a little turned, bright. The slider is how quickly it follows
 * (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (a spring on one angle); the hit is the
 * pointer's screen x, which never moves with the drawing.
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HT = 62, T = 0.32, REST = -0.55, FEET = 3;
const PLATE = rrect(-32, 0, 32, 42, 3, 4), FACE = rrect(-30, 2, 30, 40, 2, 4), LIP = rrect(-33, -1.5, 33, 2.5, 1.2, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([28 * Math.cos(a), 28 * Math.sin(a), 0], [33 * Math.cos(a), 33 * Math.sin(a), HT + 40]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const legs = [];
  for (let i = 0; i < FEET; i++) { const b = 2.2 + (i / FEET) * Math.PI * 2; legs.push(seg(P(0, 0, 14), P(26 * Math.cos(b), 26 * Math.sin(b), 0))); }
  mk("path", { class: "nf sil", d: legs.join("") }, g);
  put(solid(g), prism(P, front, circ(2.4, 20), circ(1.6, 20), 10, 16));
  put(solid(g), prism(P, front, circ(1.4, 16), null, 16, HT + 2));
  const desk = solid(g), lip = solid(g);
  desk.sil.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const ca = Math.cos(a), sa = Math.sin(a), cT = Math.cos(T), sT = Math.sin(T);
    const at = (u, t, v) => { const y = t * cT - v * sT, z = t * sT + v * cT; return P(u * ca - y * sa, u * sa + y * ca, HT + z); };
    const pts = [];
    for (const q of PLATE) pts.push(at(q.u, -1, q.v), at(q.u, 1, q.v));
    put(desk, { sil: poly(hull(pts)), crease: poly(FACE.map((q) => at(q.u, 1.1, q.v))) });
    const lp = [];
    for (const q of LIP) lp.push(at(q.u, 1, q.v), at(q.u, 7, q.v));
    put(lip, { sil: poly(hull(lp)), crease: "" });
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over == null ? REST : over;
    read.textContent = over == null ? "rest" : Math.round((-over * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp(lerp(0.3, -1.5, (p[0] - 80) / 240), -1.5, 0.3); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "bandstand",
  means: "A band music stand: its wide desk swivels on the shaft to face the pointer, like a player stepping round.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[157, 108], [245, 150], [113, 76], null],
  mount,
});
