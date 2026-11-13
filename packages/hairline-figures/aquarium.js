/**
 * Aquarium: a glass fish tank on a low cabinet stand, a gravel bed, two
 * weed plants and five fish swimming at different depths. The pointer is what
 * the fish notice: every fish turns on its own spring to face it and swims a
 * little toward it, and the fish nearest it is bright. At rest the fish drift
 * on their own headings, one bright. The slider is how quickly they follow.
 *
 * The pattern: a continuous aim (officechairs' springs, on heading and
 * position); the hit is a fixed plane through the water, read from rest.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, ringAt, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const X1 = 90, Y1 = 38, H = 42, ZM = 24, L = 18, HB = 9, SWIM = 13;
const FISH = [[20, 13, 31, 10], [44, 24, 18, 200], [66, 12, 32, 150], [72, 26, 12, 25], [30, 12, 12, -40]];
const FAV = 1, PLANTS = [[11, 7, 30], [54, 6, 34]];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-3, -3, -22], [X1 + 3, Y1 + 3, -22], [X1 + 3, -3, -22], [-3, Y1 + 3, -22], [-3, -3, H], [X1 + 3, -3, H], [-3, Y1 + 3, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the stand: one solid, three cabinet doors on its front
  const [sr, si] = rings(-3, -3, X1 + 3, Y1 + 3, 2.5, 1);
  const stand = solid(g);
  put(stand, prism(P, front, sr, si, -22, 0));
  const fy = Y1 + 3, sd = (x) => seg(P(x, fy, -19), P(x, fy, -6));
  mk("path", { class: "nf lo", d: seg(P(2, fy, -4), P(X1 - 2, fy, -4)) + sd(X1 / 3) + sd((2 * X1) / 3) }, stand.g);
  // the gravel bed and its pebbles
  const [gr, gi] = rings(0.5, 0.5, X1 - 0.5, Y1 - 0.5, 2, 1);
  put(solid(g), prism(P, front, gr, gi, 0, 5));
  [[10, 26], [28, 32], [42, 9], [52, 30], [70, 20], [82, 8], [22, 18]].forEach(([x, y]) => place(flatDot(g, C, 1, "dot off"), P(x, y, 5)));

  const swim = mk("g", {}, g);
  const plants = PLANTS.map(([x, y, h]) => {
    const grp = mk("g", {}, swim), d = [];
    for (let s = 0; s < 3; s++) {
      const pts = [], top = h - s * 6, ox = (s - 1) * 2.5;
      for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push(P(x + ox + Math.sin(t * 5 + s * 2) * 2.2 * t, y + s * 0.8, 5 + t * top)); }
      d.push(open(pts));
    }
    mk("path", { class: "nf", d: d.join("") }, grp);
    return { grp, key: x + y };
  });
  const fish = FISH.map(([x, y, z, h], k) => {
    const grp = mk("g", {}, swim), a = h * (Math.PI / 180);
    const tail = mk("path", { class: "sil" }, grp), body = mk("path", { class: "sil" }, grp), gill = mk("path", { class: "nf lo" }, grp);
    const opt = { k: 100 * value, c: 18 * Math.sqrt(value) };
    return { k, x0: x, y0: y, z, a0: a, grp, tail, body, gill, sx: spring(x, opt), sy: spring(y, opt), sa: spring(a, opt), last: "" };
  });
  // the glass: a silhouette and a rim, no fill, painted over what swims inside
  const [tr, ti] = rings(0, 0, X1, Y1, 1.5, 0.8), glass = prism(P, front, tr, ti, 0, H);
  mk("path", { class: "nf sil", d: glass.sil }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, tr, H)) + poly(ringAt(P, ti, H)) }, g);
  mk("path", { class: "nf dash", d: poly(ringAt(P, ti, H - 5)) }, g);

  function draw(f) {
    const x = f.sx.x, y = f.sy.x, a = f.sa.x, key = x.toFixed(2) + y.toFixed(2) + a.toFixed(3);
    if (key === f.last) return;
    f.last = key;
    const c = Math.cos(a), s = Math.sin(a), W = (u, v, z) => P(x + u * c - v * s, y + u * s + v * c, f.z + z);
    const ring = [];
    for (let i = 0; i < 18; i++) { const t = (i / 18) * Math.PI * 2; ring.push([(L / 2) * Math.cos(t), (HB / 2) * Math.sin(t) * (Math.cos(t) > 0 ? 1 : 0.85)]); }
    const pts = ring.map(([u, z]) => W(u, 1.3, z)).concat(ring.map(([u, z]) => W(u, -1.3, z)));
    f.body.setAttribute("d", poly(hull(pts)));
    f.tail.setAttribute("d", poly(fillet([W(-L / 2 + 1.5, 0, 0), W(-L / 2 - 4.5, 0, 3.4), W(-L / 2 - 3, 0, 0), W(-L / 2 - 4.5, 0, -3.4)], [0.6, 1, 0.6, 1])));
    const side = c - s > 0 ? 1.3 : -1.3;
    f.gill.setAttribute("d", open([-2.2, -1, 0, 1, 2.2].map((z) => W(L / 4 - Math.abs(z) * 0.4, side, z))));
  }

  let painted = null;
  const B = register(stage, (dt) => {
    let m = false;
    for (const f of fish) { if (stepS(f.sx, dt)) m = true; if (stepS(f.sy, dt)) m = true; if (stepS(f.sa, dt)) m = true; draw(f); }
    // paint far to near among the fish and the weeds
    const all = fish.map((f) => ({ grp: f.grp, key: f.sx.x + f.sy.x })).concat(plants);
    all.sort((p, q) => p.key - q.key);
    const key = all.map((p) => Math.round(p.key)).join();
    if (key !== painted) { painted = key; for (const p of all) swim.appendChild(p.grp); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const f of fish) {
      if (over) {
        const dx = over[0] - f.x0, dy = over[1] - f.y0, d = Math.hypot(dx, dy);
        if (d < bd) { bd = d; near = f; }
        const step = Math.min(SWIM, d * 0.5), aim = d < 3 ? f.sa.t : Math.atan2(dy, dx);
        f.sx.t = clamp(f.x0 + (d ? (dx / d) * step : 0), 12, X1 - 12);
        f.sy.t = clamp(f.y0 + (d ? (dy / d) * step : 0), 12, Y1 - 12);
        f.sa.t = f.sa.t + wrap(aim - f.sa.t);
      } else { f.sx.t = f.x0; f.sy.t = f.y0; f.sa.t = f.sa.t + wrap(f.a0 - f.sa.t); }
    }
    for (const f of fish) {
      const on = over ? f === near : f.k === FAV;
      f.body.classList.toggle("hi", on); f.tail.classList.toggle("hi", on);
    }
    read.textContent = near ? "fish " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZM);
      over = x < -12 || x > X1 + 12 || y < -12 || y > Y1 + 12 ? null : [clamp(x, 0, X1), clamp(y, 0, Y1)];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const f of fish) for (const sp of [f.sx, f.sy, f.sa]) { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "aquarium",
  means: "A fish tank on a stand: every fish turns and swims a little toward the pointer, and the nearest fish is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[155, 100], [190, 140], [245, 170], null],
  mount,
});
