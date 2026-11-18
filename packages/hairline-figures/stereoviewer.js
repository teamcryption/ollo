/**
 * Stereo viewer: a toy picture viewer, two eyepieces on its face, a picture
 * reel standing in the slot on top and an advance lever on its side. Over
 * it, the lever clicks down and the reel rises out of the slot, turning its
 * ring of slides round. At rest the reel sits low and the lever is bright.
 * The slider is how far the reel rises and turns.
 *
 * The pattern: one object, one gesture (a tween on the hover).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, seg, unproj, tset, tval, tdone, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZT = 30, RR = 22, RC = 34, N = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-32, -14, 0], [34, 20, 0], [34, -14, 0], [-32, 20, 0], [0, 0, RC + RR + 28], [-22, 0, RC + 28], [22, 0, RC + 28]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, i] = rings(-30, -12, 30, 12, 7, 1.8);
  put(solid(g), prism(P, front, o, i, 0, ZT));
  mk("path", { d: seg(P(-RR - 2, 0, ZT), P(RR + 2, 0, ZT)), class: "nf lo" }, g);
  const reel = mk("g", {}, g);
  const leverG = mk("g", {}, g);
  for (const x of [-13, 13]) {
    const pts = [];
    for (const y of [12, 18]) for (const q of circ(6, 24)) pts.push(P(x + q.u, y, 15 + q.v));
    mk("path", { d: poly(hull(pts)), class: "sil" }, g);
    mk("path", { d: poly(circ(3.6, 20).map((q) => P(x + q.u, 18, 15 + q.v))), class: "nf lo" }, g);
  }
  const st = { h: tween(3), a: tween(8) };
  let last = "", act = null;
  const disc = (cx, cz, r, n, z0) => circ(r, n).map((q) => [cx + q.u, cz + q.v]).filter(([, z]) => z >= z0);
  function draw(h, a) {
    const key = h.toFixed(2) + a.toFixed(2);
    if (key === last) return;
    last = key;
    reel.replaceChildren(); leverG.replaceChildren();
    const cz = RC + h, half = Math.sqrt(Math.max(0, RR * RR - (ZT - cz) ** 2));
    const rim = disc(0, cz, RR, 64, ZT).map(([x, z]) => P(x, 0, z)).concat([P(-half, 0, ZT), P(half, 0, ZT)]);
    const rs = mk("path", { d: poly(hull(rim)), class: "sil" }, reel);
    const turn = rad(h * 12);
    for (let k = 0; k < N; k++) {
      const t = turn + (k / N) * Math.PI * 2, wx = 15 * Math.cos(t), wz = cz + 15 * Math.sin(t);
      if (wz - 3.6 < ZT + 0.5) continue;
      mk("path", { d: poly(circ(3.4, 14).map((q) => P(wx + q.u, 0, wz + q.v))), class: "nf lo" }, reel);
    }
    if (cz - 3 > ZT) mk("path", { d: poly(circ(2.6, 14).map((q) => P(q.u, 0, cz + q.v))), class: "nf" }, reel);
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a)), ey = 16 * ca, ez = 24 + 16 * sa, pts = [];
    for (const x of [30, 33]) for (const [y, z, r] of [[0, 24, 3.4], [ey, ez, 2.4]]) for (const q of circ(r, 14)) pts.push(P(x, y + q.u, z + q.v));
    const lv = mk("path", { d: poly(hull(pts)), class: "sil" }, leverG);
    (act ? rs : lv).classList.add("hi");
  }
  const B = register(stage, (_dt, now) => { draw(tval(st.h, now), tval(st.a, now)); return !tdone(st.h, now) || !tdone(st.a, now); });
  bag.add(B.unregister);
  function setOn(v) {
    if (v === act) return;
    act = v; last = "";
    const now = performance.now();
    tset(st.a, v ? 8 - 52 * reach : 8, now, 0);
    tset(st.h, v ? 3 + 14.5 * reach : 3, now, v ? 80 : 0);
    read.textContent = v ? "slide " + (1 + Math.round(6 * reach)) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); setOn(x > -50 && x < 54 && y > -40 && y < 40); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; const o2 = act; act = null; setOn(o2); }, destroy: bag.dispose };
}

hairline({
  name: "stereoviewer",
  means: "A toy stereo picture viewer: over it, the side lever clicks down and the picture reel rises from its slot, turning its slides.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.8, 1],
  tour: [[204, 171], [230, 200], [175, 190], null],
  mount,
});
