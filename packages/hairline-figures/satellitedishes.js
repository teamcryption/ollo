/**
 * Satellite dishes: three dishes of different sizes on a roof slab, each a
 * shallow bowl on a post with a feed arm held out in front of it. The pointer
 * is the satellite: every dish turns on its own spring to face it, and the
 * dish nearest it is bright. At rest they all face one point of the sky, each
 * a little off, the middle one bright. The slider is how quickly they follow.
 *
 * The pattern: a continuous aim (terrain's spring, on an angle per dish); the
 * hit is on the roof's plane, which never moves.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const SX = 50, SY = 36, FAV = 1;
const DISH = [
  { x: -30, y: -16, R: 13, h: 26, tilt: 40, rest: 160 },
  { x: 18, y: -20, R: 18, h: 32, tilt: 36, rest: 150 },
  { x: -4, y: 22, R: 9, h: 18, tilt: 44, rest: 172 },
];
const VIEW = [0.612, 0.612, 0.5];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-SX, -SY, -6], [SX, SY, -6], [SX, -SY, -6], [-SX, SY, -6], [-30, -16, 48], [18, -20, 58]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-SX, -SY, SX, SY, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, -6, 0));

  const dishes = DISH.map((o, k) => ({ ...o, k, c: [o.x, o.y, o.h], rest: (o.rest * Math.PI) / 180, tilt: (o.tilt * Math.PI) / 180 }))
    .sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const d of dishes) {
    const grp = mk("g", {}, g);
    const [pr, pi] = rings(d.x - 5, d.y - 5, d.x + 5, d.y + 5, 2, 0.8);
    put(solid(grp), prism(P, front, pr, pi, 0, 2));
    place(flatDot(grp, C, 0.9, "dot off"), P(d.x + 3, d.y + 3, 2));
    d.post = solid(grp);
    put(d.post, prism(P, front, disc(d.x, d.y, 1.4, 16), null, 2, d.h - 2));
    d.aim = mk("g", {}, grp);
    d.arm = mk("path", { class: "nf sil" }, d.aim);
    d.bowl = mk("path", { class: "sil" }, d.aim);
    d.rim = mk("path", { class: "nf" }, d.aim);
    d.feed = mk("circle", { r: 1.4, class: "dot m" }, d.aim);
    d.sp = spring(d.rest, { k: 100 * value, c: 18 * Math.sqrt(value) });
    d.drawn = NaN; d.toward = null;
  }

  function draw(d) {
    const yaw = d.sp.x;
    if (Math.abs(yaw - d.drawn) < 1e-4) return;
    d.drawn = yaw;
    const ct = Math.cos(d.tilt), st = Math.sin(d.tilt);
    const n = [ct * Math.cos(yaw), ct * Math.sin(yaw), st];
    const u = [-Math.sin(yaw), Math.cos(yaw), 0], v = [-st * Math.cos(yaw), -st * Math.sin(yaw), ct];
    const ring = (off, r) => Array.from({ length: 32 }, (_, i) => {
      const t = (i / 32) * Math.PI * 2, q = (j) => d.c[j] + n[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const back = ring(0, d.R * 0.3), rim = ring(d.R * 0.32, d.R);
    const fp = (j) => d.c[j] + n[j] * d.R * 0.95;
    const feed = P(fp(0), fp(1), fp(2));
    d.bowl.setAttribute("d", poly(hull(back.concat(rim))));
    const toward = n[0] * VIEW[0] + n[1] * VIEW[1] + n[2] * VIEW[2] > 0;
    d.rim.setAttribute("d", poly(toward ? rim : back));
    d.rim.setAttribute("class", toward ? (d.on ? "nf hi" : "nf") : "nf lo");
    const r0 = (s) => P(d.c[0] + n[0] * d.R * 0.32 + s * d.R * 0.92 * v[0], d.c[1] + n[1] * d.R * 0.32 + s * d.R * 0.92 * v[1], d.c[2] + n[2] * d.R * 0.32 + s * d.R * 0.92 * v[2]);
    d.arm.setAttribute("d", seg(r0(-1), feed) + seg(r0(1), feed));
    place(d.feed, feed);
    if (toward !== d.toward) {
      d.toward = toward;
      if (toward) d.aim.append(d.bowl, d.rim, d.arm, d.feed); else d.aim.append(d.arm, d.feed, d.bowl, d.rim);
    }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const d of dishes) { if (stepS(d.sp, dt)) m = true; draw(d); }
    return m;
  });
  bag.add(B.unregister);

  let over = null, scr = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const d of dishes) {
      if (over) {
        const [hx, hy] = unproj(C, scr[0], scr[1], d.h), dist = Math.min(Math.hypot(over[0] - d.x, over[1] - d.y), Math.hypot(hx - d.x, hy - d.y));
        if (dist < bd) { bd = dist; near = d; }
        const aim = Math.hypot(over[0] - d.x, over[1] - d.y) < 4 ? d.sp.t : Math.atan2(over[1] - d.y, over[0] - d.x);
        d.sp.t = d.sp.t + wrap(aim - d.sp.t);
      } else d.sp.t = d.sp.t + wrap(d.rest - d.sp.t);
    }
    for (const d of dishes) { const on = over ? d === near : d.k === FAV; d.bowl.classList.toggle("hi", on); if (d.on !== on) { d.on = on; d.drawn = NaN; draw(d); } }
    read.textContent = near ? "dish " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0); scr = p;
      over = Math.abs(x) > SX + 30 || Math.abs(y) > SY + 30 ? null : [Math.max(-SX, Math.min(SX, x)), Math.max(-SY, Math.min(SY, y))];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const d of dishes) { d.sp.k = 100 * v; d.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "satellitedishes",
  means: "Three satellite dishes on a roof: every dish turns to face the pointer, and the nearest one is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[177, 104], [262, 128], [157, 172], null],
  mount,
});
