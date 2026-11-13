/**
 * Bird feeders: a feeder pole on a ground plate with three arms at three
 * heights, each holding a feeder on a short cord: a seed tube, a little
 * house with a pitched roof, a hanging tray. Feeders near the pointer swing
 * away from it, each on its own spring, and the one under it swings most and
 * is bright. At rest one feeder hangs a little askew, bright. The slider is
 * how far the feeders swing.
 *
 * The pattern: a field of springs; the hit is each feeder's rest pose on
 * screen, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PH = 92, AR = 30, FAV = 1;
const ARMS = [[200, 84, "tube"], [-20, 72, "house"], [90, 60, "tray"]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.4);
  const ext = [[-12, -12, 0], [12, 12, 0], [12, -12, 0], [-12, 12, 0], [0, 0, PH + 4]];
  for (const [deg, z] of ARMS) { const a = (deg * Math.PI) / 180; for (const s of [-1, 1]) ext.push([AR * Math.cos(a) + 13 * s, AR * Math.sin(a) + 13 * s, z - 26], [AR * Math.cos(a) - 13 * s, AR * Math.sin(a) + 13 * s, z]); }
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const fs = ARMS.map(([deg, z, kind], k) => {
    const a = (deg * Math.PI) / 180, x = AR * Math.cos(a), y = AR * Math.sin(a);
    return { k, kind, x, y, z, ox: spring(k === FAV ? 3 : 0), oy: spring(k === FAV ? -2 : 0), last: "" };
  });
  const draws = [...fs, null].sort((p, q) => (p ? p.x + p.y : 0) - (q ? q.x + q.y : 0));
  for (const f of draws) {
    if (!f) {
      const [pr, pi] = rings(-9, -9, 9, 9, 3, 1.4);
      put(solid(g), prism(P, front, pr, pi, 0, 2));
      put(solid(g), prism(P, front, circ(2, 20), null, 2, PH));
      put(solid(g), prism(P, front, circ(3.2, 20), circ(2.4, 20), PH, PH + 3));
      continue;
    }
    f.grp = mk("g", {}, g);
    mk("path", { class: "nf sil", d: open([P(0, 0, f.z + 4), P(f.x * 0.5, f.y * 0.5, f.z + 1), P(f.x, f.y, f.z)]) }, f.grp);
    f.cord = mk("path", { class: "nf" }, f.grp);
    f.body = solid(f.grp);
    f.parts = [solid(f.grp), solid(f.grp)];
    f.mark = mk("path", { class: "nf lo" }, f.grp);
  }

  function draw(f) {
    const ox = f.ox.x, oy = f.oy.x, key = ox.toFixed(3) + "," + oy.toFixed(3);
    if (key === f.last) return;
    f.last = key;
    const cx = f.x + ox, cy = f.y + oy, lift = (ox * ox + oy * oy) / 60, top = f.z - 6 + lift, D = (r) => disc(cx, cy, r);
    const hang = P(f.x, f.y, f.z);
    if (f.kind === "tube") {
      f.cord.setAttribute("d", seg(hang, P(cx, cy, top)));
      put(f.parts[0], prism(P, front, D(6), D(5), top - 3, top));
      put(f.body, prism(P, front, D(4.4), null, top - 22, top - 3));
      put(f.parts[1], prism(P, front, D(6.4), D(5.4), top - 25, top - 22));
      f.mark.setAttribute("d", seg(P(cx - 7, cy + 7, top - 18), P(cx + 7, cy - 7, top - 18)) + seg(P(cx - 3, cy + 3, top - 10), P(cx + 3, cy - 3, top - 10)));
    } else if (f.kind === "house") {
      f.cord.setAttribute("d", seg(hang, P(cx, cy, top)));
      const [r, i] = rings(cx - 6, cy - 6, cx + 6, cy + 6, 1.5, 1);
      put(f.parts[0], prism(P, front, r, i, top - 22, top - 20));
      put(f.body, prism(P, front, rings(cx - 5, cy - 5, cx + 5, cy + 5, 1.2, 0.8)[0], null, top - 20, top - 9));
      const eave = [P(cx - 8, cy - 8, top - 9), P(cx + 8, cy - 8, top - 9), P(cx + 8, cy + 8, top - 9), P(cx - 8, cy + 8, top - 9)];
      put(f.parts[1], { sil: poly(hull(eave.concat([P(cx - 8, cy, top), P(cx + 8, cy, top)]))), crease: open([P(cx - 7, cy, top - 0.6), P(cx + 7, cy, top - 0.6)]) });
      const hole = [];
      for (let j = 0; j < 14; j++) hole.push(P(cx + 5.05, cy + 2 * Math.cos((j / 14) * 6.283), top - 14.5 + 2 * Math.sin((j / 14) * 6.283)));
      f.mark.setAttribute("d", poly(hole));
    } else {
      let d = "";
      for (const [sx, sy] of [[-9, -9], [9, -9], [9, 9], [-9, 9]]) d += seg(P(cx, cy, top), P(cx + sx, cy + sy, top - 14));
      f.cord.setAttribute("d", seg(hang, P(cx, cy, top)) + d);
      const [r, i] = rings(cx - 11, cy - 11, cx + 11, cy + 11, 3, 1.4);
      put(f.body, prism(P, front, r, i, top - 17, top - 14));
      put(f.parts[0], { sil: "", crease: "" });
      put(f.parts[1], { sil: "", crease: "" });
      f.mark.setAttribute("d", seg(P(cx - 4, cy - 2, top - 14), P(cx - 2, cy - 2, top - 14)) + seg(P(cx + 2, cy + 3, top - 14), P(cx + 4, cy + 3, top - 14)));
    }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const f of fs) { if (stepS(f.ox, dt)) m = true; if (stepS(f.oy, dt)) m = true; draw(f); }
    return m;
  });
  bag.add(B.unregister);

  const mids = fs.map((f) => P(f.x, f.y, f.z - 18));
  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    if (over) fs.forEach((f, k) => { const d = Math.hypot(over[0] - mids[k][0], over[1] - mids[k][1]); if (d < bd) { bd = d; near = f; } });
    if (bd > 34) near = null;
    fs.forEach((f, k) => {
      if (over) {
        const d = Math.hypot(over[0] - mids[k][0], over[1] - mids[k][1]), w = f === near ? 1 : clamp(0.1 + 0.6 * Math.exp(-(d * d) / 5000), 0, 0.7);
        const [px, py] = unproj(C, over[0], over[1], f.z - 18);
        let dx = f.x - px, dy = f.y - py; const n = Math.hypot(dx, dy) || 1;
        f.ox.t = (dx / n) * 10 * amp * w; f.oy.t = (dy / n) * 10 * amp * w;
      } else { f.ox.t = k === FAV ? 3 : 0; f.oy.t = k === FAV ? -2 : 0; }
      (f.kind === "house" ? f.parts[1] : f.body).sil.classList.toggle("hi", near ? f === near : !over && k === FAV);
    });
    read.textContent = near ? "feeder " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "birdfeeders",
  means: "A feeder pole with three hanging bird feeders: feeders near the pointer swing away from it, the one under it most.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[162, 88], [257, 160], [142, 196], null],
  mount,
});
