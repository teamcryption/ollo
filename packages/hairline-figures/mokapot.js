/**
 * Moka pot: an eight-sided stovetop pot, its lower boiler screwed to the
 * upper jug, a hinged lid, a pouring spout and a side handle. The pointer
 * on the jug flips the lid open on its hinge; on the boiler the jug unscrews,
 * twisting and lifting off the threaded collar. At rest the lid sits ajar,
 * bright. The slider is how far the pot opens.
 *
 * The pattern: one object, two parts answering (cloches).
 */
const {
  Cam, fit, facing, hull, open, poly, proj, run, clamp, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const S8 = Math.cos(Math.PI / 8);
// a rounded octagon ring of radius R, corner radius r
function oct(R, r = 2.4) {
  const out = [], c = R - r / S8;
  for (let i = 0; i < 8; i++) {
    const a = rad(i * 45 + 22.5 - 45);
    for (let j = 0; j <= 3; j++) {
      const b = a - rad(22.5) + (j / 3) * rad(45);
      out.push({ u: c * Math.cos(a) + r * Math.cos(b), v: c * Math.sin(a) + r * Math.sin(b), nu: Math.cos(b), nv: Math.sin(b) });
    }
  }
  return out;
}
const twist = (ring, t) => ring.map((q) => {
  const c = Math.cos(t), s = Math.sin(t);
  return { u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c };
});

const H = [-Math.SQRT1_2, Math.SQRT1_2], SP = [Math.SQRT1_2, -Math.SQRT1_2]; // handle side, spout side
const ZW = 30, ZU = 31, ZT = 64, RB = 22, RW = 16, RT = 21;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-30, -30, 0], [30, 30, 0], [0, 0, ZT + 34], [-40, 40, 40], [40, -40, 70]], 200, 172);
  const P = proj(C), front = facing(C);
  const ringAt = (ring, z) => ring.map((q) => P(q.u, q.v, z));
  const g = mk("g", {}, svg);

  // the boiler: a frustum, then the threaded collar
  const base = solid(g);
  base.sil.setAttribute("d", poly(hull(ringAt(oct(RB), 0).concat(ringAt(oct(RW + 1), ZW)))));
  base.cr.setAttribute("d", open(ringAt(run(oct(RW - 0.5), front), ZW)));
  const valve = mk("ellipse", { class: "dot m", rx: 1.8, ry: 1.8 }, g);
  const vp = P(SP[0] * 17 + 9, SP[1] * 17 + 9, 14); valve.setAttribute("cx", vp[0]); valve.setAttribute("cy", vp[1]);
  const collar = solid(g);
  collar.sil.setAttribute("d", poly(hull(ringAt(oct(RW - 2), ZW).concat(ringAt(oct(RW - 2), ZW + 6)))));
  collar.cr.setAttribute("d", open(ringAt(run(oct(RW - 3.2), front), ZW + 3)));

  const jug = solid(g), handle = mk("path", { class: "sil" }, g), spout = mk("path", { class: "sil" }, g);
  const lid = solid(g), knob = mk("path", {}, g);

  const st = { lift: tween(0), tw: tween(0), lid: tween(14) };
  let last = "";
  function at(x, y, z, L, T) { const c = Math.cos(T), s = Math.sin(T); return P(x * c - y * s, x * s + y * c, z + L); }
  function capsule(a, b, r, L, T) {
    const pts = [];
    for (const [x, y, z] of [a, b]) for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; pts.push(at(x + r * Math.cos(t), y + r * Math.sin(t), z, L, T), at(x + r * Math.cos(t), y + r * Math.sin(t), z + r * 1.4, L, T)); }
    return poly(hull(pts));
  }
  function draw(L, T, th) {
    const key = [L, T, th].map((n) => n.toFixed(2)).join();
    if (key === last) return;
    last = key;
    jug.sil.setAttribute("d", poly(hull(ringAt(twist(oct(RW), T), ZU + L).concat(ringAt(twist(oct(RT), T), ZT + L)))));
    jug.cr.setAttribute("d", open(ringAt(run(twist(oct(RT - 1.8), T), front), ZT + L)));
    const hx = (d, z) => [H[0] * d, H[1] * d, z];
    handle.setAttribute("d", capsule(hx(18, 55), hx(34, 54), 2.6, L, T) + capsule(hx(34, 54), hx(37, 34), 2.6, L, T));
    const sp = [];
    for (const [d, w, z] of [[RT - 1, 5, ZT], [RT - 1, 5, ZT - 9], [RT + 9, 0.6, ZT + 2], [RT + 1, 0.6, ZT - 13]]) {
      sp.push(at(SP[0] * d + SP[1] * w, SP[1] * d - SP[0] * w, z, L, T), at(SP[0] * d - SP[1] * w, SP[1] * d + SP[0] * w, z, L, T));
    }
    spout.setAttribute("d", poly(hull(sp)));
    // the lid: rotate about the hinge on the handle side, then twist and lift
    const a = rad(-th), ca = Math.cos(a), sa = Math.sin(a), ax = [Math.SQRT1_2, Math.SQRT1_2];
    const hp = [H[0] * RT, H[1] * RT, ZT + 0.5];
    const tilt = (x, y, z) => {
      const v = [x - hp[0], y - hp[1], z - hp[2]], d = ax[0] * v[0] + ax[1] * v[1];
      const cr = [ax[1] * v[2], -ax[0] * v[2], ax[0] * v[1] - ax[1] * v[0]];
      return [hp[0] + v[0] * ca + cr[0] * sa + ax[0] * d * (1 - ca), hp[1] + v[1] * ca + cr[1] * sa + ax[1] * d * (1 - ca), hp[2] + v[2] * ca + cr[2] * sa];
    };
    const lp = (q, z) => { const p = tilt(q.u, q.v, z); return at(p[0], p[1], p[2], L, T); };
    const o = oct(RT + 0.6), oi = oct(RT - 3);
    lid.sil.setAttribute("d", poly(hull(o.map((q) => lp(q, ZT + 0.5)).concat(oi.map((q) => lp(q, ZT + 5))))));
    lid.cr.setAttribute("d", poly(oct(RT - 4.5).map((q) => lp(q, ZT + 5))));
    const kn = [];
    for (const q of oct(3.4, 1.2)) kn.push(lp(q, ZT + 5), lp(q, ZT + 9.5));
    knob.setAttribute("d", poly(hull(kn)));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(st.lift, now), tval(st.tw, now), tval(st.lid, now));
    return !(tdone(st.lift, now) && tdone(st.tw, now) && tdone(st.lid, now));
  });
  bag.add(B.unregister);

  // hit test on the rest pose: the pot's screen box, split at the collar
  const box = [[-RT, -RT, 0], [RT, RT, 0], [-RT, RT, ZT + 9], [RT, -RT, ZT], [0, 0, ZT + 9]].map((p) => P(...p));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]), yw = P(0, 0, ZW + 3)[1];
  const X0 = Math.min(...xs) - 10, X1 = Math.max(...xs) + 10, Y0 = Math.min(...ys) - 8, Y1 = Math.max(...ys) + 4;
  function hit([sx, sy]) {
    if (sx < X0 || sx > X1 || sy < Y0 || sy > Y1) return "rest";
    return sy < yw ? "lid" : "base";
  }

  let act = "", tgt = null;
  function apply() {
    const now = performance.now();
    const T = act === "lid" ? [6, 0, 95] : act === "base" ? [30, 40, 30] : [0, 0, 14];
    tset(st.lift, T[0] * (act === "rest" ? 1 : amp), now, 0);
    tset(st.tw, rad(T[1] * (act === "rest" ? 1 : amp)), now, 40);
    tset(st.lid, T[2] * (act === "rest" ? 1 : amp), now, act === "base" ? 120 : 0);
    B.wake();
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    lid.sil.classList.toggle("hi", a !== "base");
    base.sil.classList.toggle("hi", a === "base");
    read.textContent = a;
    apply();
  }
  setActive("rest");
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive("rest") }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 0.2, 1); act !== "rest" && apply(); }, destroy: bag.dispose };
}

hairline({
  name: "mokapot",
  means: "A stovetop moka pot: on the jug its hinged lid flips open; on the boiler the jug twists and lifts off its threaded collar.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[200, 104], [198, 235], [167, 155], null],
  mount,
});
