/**
 * Lectern: a speaker's lectern on a low dais, a slanted reading desk on a
 * column, a gooseneck microphone at its front edge. The pointer is the
 * audience: the lectern swivels on its base, on one spring, to face it. At
 * rest it stands a little askew, its desk bright.
 */
const {
  Cam, facing, fit, prism, proj, rings, hull, poly, open, run, seg, unproj, rad,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const BZ = 5, CZ = 8, DZ = 46, REST = rad(62);
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  const ext = [[-38, -30, 0], [38, 30, 0], [38, -30, 0], [-38, 30, 0], [0, 0, 70]];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const dais = rings(-38, -30, 38, 30, 6, 1.8);
  put(solid(g), prism(P, front, dais[0], dais[1], 0, BZ));

  const BASE = rings(-13, -16, 13, 16, 3, 1.2), COL = rings(-8, -12, 8, 12, 2.5, 1);
  const DESK = rings(-13, -17, 13, 17, 2.5, 1.4);
  const base = solid(g), col = solid(g), desk = solid(g);
  const micG = mk("g", {}, g);
  const stalk = mk("path", { class: "nf sil", d: "" }, micG);
  const head = flatDot(micG, C, 1.8, "dot m");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, micFirst = null;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a);
    const W = (u, v, z) => P(u * c - v * s, u * s + v * c, z);
    const T = (r) => r.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
    put(base, prism(P, front, T(BASE[0]), T(BASE[1]), BZ, CZ));
    put(col, prism(P, front, T(COL[0]), null, CZ, DZ));
    const top = (q) => DZ + 5 + 0.3 * q.u;
    const pts = DESK[0].map((q) => W(q.u, q.v, DZ)).concat(DESK[0].map((q) => W(q.u, q.v, top(q))));
    put(desk, { sil: poly(hull(pts)), crease: poly(DESK[1].map((q) => W(q.u, q.v, top(q)))) });
    const m0 = W(11, 0, top({ u: 11 })), m1 = W(9, 0, DZ + 13), m2 = W(4, 0, DZ + 18);
    stalk.setAttribute("d", seg(m0, m1) + seg(m1, m2));
    place(head, m2);
    const mf = c + s < 0;
    if (mf !== micFirst) { micFirst = mf; if (mf) desk.g.before(micG); else desk.g.after(micG); }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (p) sp.t = sp.t + wrap(Math.atan2(p[1], p[0]) - sp.t);
    else sp.t = sp.t + wrap(REST - sp.t);
    desk.sil.classList.add("hi");
    const deg = Math.round(((sp.t * 180) / Math.PI % 360 + 360) % 360);
    read.textContent = p ? "face " + deg + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y);
      aim(d < 8 || d > 120 ? null : [x, y]);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "podium2",
  means: "A lectern on a dais: it swivels on its base to face the pointer, as a speaker turns to the audience.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[142, 148], [103, 245], [336, 226], null],
  mount,
});
