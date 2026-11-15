/**
 * School locker: a bank of three lockers, each door hung on a hinge with
 * vent slots and a latch. The pointer picks a locker and its door swings
 * open on a 700ms ease; the neighbours settle back, staggered by distance.
 * At rest one door stands ajar and is bright. The slider is how far a door
 * swings.
 */
const {
  Cam, fit, prism, proj, rings, seg, facing, tween, tset, tval, tdone, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 26, D = 22, H = 80, T = 1.8, OPEN = 100;
const REST = [5, 30, 0], FAV = 1;
const R = Math.PI / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const ext = [[0, 0, 0], [N * W, D, 0], [0, 0, H], [N * W, D, H]];
  for (let i = 0; i < N; i++) ext.push([i * W, D + W, 0], [i * W, D + W, H], [i * W + W, D, H]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [ring, inner] = rings(0, 0, N * W, D, 3, 1.4);
  put(solid(g), prism(P, front, ring, inner, 0, H));
  // door frames, a shelf and a hook inside each locker, on the front face
  let frames = "";
  for (let i = 0; i < N; i++) {
    const x0 = i * W + 1.2, x1 = i * W + W - 1.2, z0 = 2.5, z1 = H - 2.5;
    const q = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([x, z]) => P(x, D, z));
    frames += seg(q[0], q[1]) + seg(q[1], q[2]) + seg(q[2], q[3]) + seg(q[3], q[0]);
    frames += seg(P(x0, D, H - 16), P(x1, D, H - 16));
    frames += seg(P(i * W + W / 2, D, H - 22), P(i * W + W / 2, D, H - 26));
  }
  mk("path", { class: "nf lo", d: frames }, g);

  const DOOR = rings(0.4, 0, W - 0.4, T, 0.7, 0.3)[0];
  const doors = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g);
    const s = solid(grp);
    const marks = mk("path", { class: "nf lo", d: "" }, grp);
    doors.push({ i, hx: i * W, s, marks, tw: tween(REST[i]), drawn: NaN, cx: P(i * W + W / 2, D, H / 2)[0] });
  }

  function draw(d, now) {
    const a = tval(d.tw, now);
    if (Math.abs(a - d.drawn) < 1e-3) return;
    d.drawn = a;
    const c = Math.cos(a * R), sn = Math.sin(a * R);
    const L = (u, v) => [d.hx + u * c - v * sn, D + u * sn + v * c];
    const rr = DOOR.map((q) => { const [x, y] = L(q.u, q.v); return { u: x, v: y, nu: q.nu * c - q.nv * sn, nv: q.nu * sn + q.nv * c }; });
    put(d.s, prism(P, front, rr, null, 1.5, H - 1.5));
    let m = "";
    if (c - sn > 0.05) {
      for (let k = 0; k < 4; k++) {
        const z = H - 9 - k * 3.2, a0 = L(W * 0.28, T), a1 = L(W * 0.72, T);
        m += seg(P(a0[0], a0[1], z), P(a1[0], a1[1], z));
      }
      const h = L(W - 4.5, T);
      m += seg(P(h[0], h[1], H / 2 - 5), P(h[0], h[1], H / 2 + 5));
    }
    d.marks.setAttribute("d", m);
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const d of doors) { draw(d, now); if (!tdone(d.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let cur = null;
  function choose(a, now) {
    cur = a;
    for (const d of doors) {
      const to = a === null ? REST[d.i] : d.i === a ? clamp(OPEN * value, 20, 125) : REST[d.i] * 0.4;
      tset(d.tw, to, now, a === null ? Math.abs(d.i - FAV) * 40 : Math.abs(d.i - a) * 40);
      d.s.sil.classList.toggle("hi", a === null ? d.i === FAV : d.i === a);
    }
    read.textContent = a === null ? "rest" : "locker " + (a + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      let a = null, bd = Infinity;
      for (const d of doors) { const dd = Math.abs(p[0] - d.cx); if (dd < bd) { bd = dd; a = d.i; } }
      if (bd > 70 || p[1] < 20 || p[1] > 305) a = null;
      if (a !== cur) choose(a, performance.now());
    },
    leave: () => choose(null, performance.now()),
  }));
  bag.add(() => svg.replaceChildren());
  choose(null, performance.now());
  return {
    set: (v) => { value = v; if (cur !== null) { const c = cur; cur = -1; choose(c, performance.now()); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "lunchbag",
  means: "A bank of school lockers: the door under the pointer swings open on its hinge, and the open one is bright.",
  rules: [1, 2, 4, 5],
  range: [0.5, 1, 1.25],
  tour: [[150, 160], [200, 160], [250, 160], null],
  mount,
});
