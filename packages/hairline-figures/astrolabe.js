/**
 * Astrolabe: a brass mater lying on its back with a hanging ring at the top,
 * the pierced rete over its face, star pointers on the rete, and the sighting
 * rule across both. The pointer turns rete and rule together to face it,
 * about the central pin. At rest the rule is the bright mark.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, ZT = 4, A0 = -0.6;
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-R, -R - 12, 0], [R, R, 0], [R, -R - 12, 0], [-R, R, 0], [0, 0, 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const hang = solid(g), [hr, hi] = rings(-6, -R - 12, 6, -R + 4, 6, 1.5);
  put(hang, prism(P, front, hr, hi, 0, ZT));
  mk("path", { class: "nf", d: poly(ringAt(P, disc(0, -R - 5, 3, 20), ZT)) }, hang.g);
  const mat = solid(g);
  put(mat, prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.5), 0, ZT));
  let tk = poly(ringAt(P, disc(0, 0, R - 6), ZT));
  for (let k = 0; k < 24; k++) { const a = (k / 24) * 2 * Math.PI, l = k % 6 ? 2.5 : 5; tk += seg(P((R - 6) * Math.cos(a), (R - 6) * Math.sin(a), ZT), P((R - 6 + l) * Math.cos(a), (R - 6 + l) * Math.sin(a), ZT)); }
  mk("path", { class: "nf lo", d: tk }, mat.g);
  const rete = mk("path", { class: "nf" }, g);
  const rule = solid(g);
  rule.sil.classList.add("hi");
  mk("path", { class: "nf", d: poly(ringAt(P, disc(0, 0, 2.5, 16), ZT + 3)) }, g);
  const t = tween(A0);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const z = ZT + 0.5, Q = (x, y) => { const c = Math.cos(a), s = Math.sin(a); return P(x * c - y * s, x * s + y * c, z); };
    const ecl = [];
    for (let k = 0; k < 48; k++) { const b = (k / 48) * 2 * Math.PI; ecl.push(Q(9 + 23 * Math.cos(b), 23 * Math.sin(b))); }
    let d = poly(ecl);
    for (const [b, r0, r1] of [[0.3, 14, 31], [1.5, 22, 33], [2.4, 16, 30], [3.5, 24, 33], [4.4, 18, 31], [5.4, 25, 33]]) {
      const c = Math.cos(b), s = Math.sin(b), w = 2.2;
      d += poly([Q(r0 * c - w * s, r0 * s + w * c), Q(r1 * c, r1 * s), Q(r0 * c + w * s, r0 * s - w * c)]);
    }
    d += seg(Q(-R + 6, 0), Q(-14, 0));
    rete.setAttribute("d", d);
    put(rule, prism(P, front, rot(rrect(-R + 2, -3, R - 2, 3, 3, 4), a + Math.PI / 2), rot(rrect(-R + 3, -2, R - 3, 2, 2, 4), a + Math.PI / 2), ZT + 1, ZT + 2.5));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let cur = A0;
  function aim(p) {
    let a = A0;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], ZT), want = Math.atan2(y, x);
      a = A0 + (want - A0) * amt;
      while (a - cur > Math.PI) a -= 2 * Math.PI;
      while (cur - a > Math.PI) a += 2 * Math.PI;
    }
    if (Math.abs(a - cur) < 0.02) return;
    cur = a;
    tset(t, a, performance.now(), 0);
    read.textContent = p ? Math.round((((a * 180) / Math.PI) % 360 + 360) % 360) + "°" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; }, destroy: bag.dispose };
}

hairline({
  name: "astrolabe",
  means: "An astrolabe on its back: the pointer turns the star rete and sighting rule round the pin to face it.",
  rules: [1, 2, 4, 5],
  range: [0.3, 1, 1],
  tour: [[162, 240], [113, 95], [282, 107], null],
  mount,
});
