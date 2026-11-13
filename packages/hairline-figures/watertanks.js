/**
 * Water tanks: three cylindrical storage tanks on a concrete pad, each with a
 * lid, a ladder up its side and a sight-glass gauge whose float shows the
 * level. The pointer draws water: the tanks near it fill, each level on its
 * own spring, the tank under it full and bright. At rest the three stand at
 * uneven levels, the middle one bright. The slider is the reach, in tanks.
 *
 * The pattern: a continuous field along one row; the hit is each tank's rest
 * centre on screen x, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, open, prism, proj, rings, ringAt, run, seg, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 15, H = 44, GAP = 44, LV0 = 4, LV1 = H - 5;
const REST = [0.42, 0.68, 0.26], FAV = 1;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.6 : u <= 1 ? 0.4 - ((u - 0.45) / 0.55) * 0.4 : 0);
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * GAP, over = null;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-GAP - R - 8, -R - 8, -3], [GAP + R + 8, R + 8, -3], [-GAP - R, -R, H + 6], [GAP + R, R, H + 6]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [po, pi] = rings(-GAP - R - 8, -R - 8, GAP + R + 8, R + 8, 5, 1.6);
  put(solid(g), prism(P, front, po, pi, -3, 0));

  const tanks = [];
  for (let k = 0; k < 3; k++) {
    const cx = (k - 1) * GAP, cy = 0, ring = disc(cx, cy, R), grp = mk("g", {}, g);
    const body = solid(grp);
    put(body, prism(P, front, ring, disc(cx, cy, R - 1.4), 0, H));
    put(solid(grp), prism(P, front, disc(cx, cy, R - 4, 40), disc(cx, cy, R - 5.2, 40), H, H + 2.5));
    put(solid(grp), prism(P, front, disc(cx + 4, cy - 4, 1.8, 16), null, H + 2.5, H + 5));
    // the sight glass on the near-left face, its float a dot
    const gy = cy + R + 1.2;
    mk("path", { class: "nf lo", d: seg(P(cx, gy, LV0), P(cx, gy, LV1)) + seg(P(cx - 1.4, gy, LV0), P(cx + 1.4, gy, LV0)) + seg(P(cx - 1.4, gy, LV1), P(cx + 1.4, gy, LV1)) }, grp);
    const level = mk("path", { class: "nf", d: "" }, grp);
    const float = flatDot(grp, C, 1.5, "dot m");
    // the ladder on the near-right face
    const lx = cx + R + 1.6;
    let rails = seg(P(lx, cy - 2.4, 0), P(lx, cy - 2.4, H + 4)) + seg(P(lx, cy + 2.4, 0), P(lx, cy + 2.4, H + 4)), rungs = "";
    for (let z = 4; z < H + 3; z += 5) rungs += seg(P(lx, cy - 2.4, z), P(lx, cy + 2.4, z));
    mk("path", { class: "nf sil", d: rails }, grp);
    mk("path", { class: "nf lo", d: rungs }, grp);
    tanks.push({ k, cx, cy, ring, gy, body, level, float, sx: P(cx, cy, H / 2)[0], sp: spring(REST[k]), drawn: NaN });
  }

  function draw(t) {
    const f = clamp(t.sp.x, 0, 1);
    if (Math.abs(f - t.drawn) < 1e-4) return;
    t.drawn = f;
    const z = LV0 + f * (LV1 - LV0);
    t.level.setAttribute("d", open(ringAt(P, run(t.ring, front), z)));
    place(t.float, P(t.cx, t.gy, z));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const t of tanks) { if (stepS(t.sp, dt)) m = true; draw(t); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null;
    if (over) hit = tanks.reduce((a, b) => (Math.abs(b.sx - over[0]) < Math.abs(a.sx - over[0]) ? b : a));
    const pxGap = Math.abs(tanks[1].sx - tanks[0].sx);
    for (const t of tanks) {
      if (!over) t.sp.t = REST[t.k];
      else if (t === hit) t.sp.t = 1;
      else t.sp.t = Math.max(REST[t.k], REST[t.k] + (0.92 - REST[t.k]) * falloff(Math.abs(t.sx - over[0]) / ((RAD / GAP) * pxGap)));
      t.body.sil.classList.toggle("hi", over ? t === hit : t.k === FAV);
    }
    read.textContent = hit ? "tank " + (hit.k + 1) : "rest";
    B.wake();
  }

  const top = P(0, 0, H + 6)[1], bot = P(GAP + R, R + 8, 0)[1];
  bag.add(pointer(stage, {
    move: (p) => {
      over = p[0] > tanks[0].sx - 50 && p[0] < tanks[2].sx + 50 && p[1] > top - 40 && p[1] < bot + 30 ? p : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * GAP; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "watertanks",
  means: "Three storage tanks with ladders and gauges on a pad: the tanks near the pointer fill, the one under it full.",
  rules: [1, 3, 5, 8],
  range: [0.8, 1.4, 2.4],
  tour: [[125, 100], [200, 133], [275, 170], null],
  mount,
});
