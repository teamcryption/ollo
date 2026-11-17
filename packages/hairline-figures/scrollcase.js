/**
 * Scroll case: a tall round tube with a slip-on cap, a rolled scroll inside
 * and a second scroll lying loose beside it. The pointer over the case lifts
 * its cap away and slides the scroll up out of the tube. At rest the cap sits
 * ajar, bright. The slider is how far the scroll comes out.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 22, BH = 52, CH = 15, SR = 16, LIFT = 30, AJAR = 5, TOP = BH + 2 + LIFT * 1.2 + 4 + CH;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  let reach = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, TOP], [R, -R, TOP], [95, 8, 0], [40, 22, 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.6), 0, BH));
  mk("path", { class: "nf lo", d: ringAt(P, disc(0, 0, R, 40), 14).filter((_, i) => i > 4 && i < 24).reduce((s, p, i, a) => i ? s + seg(a[i - 1], p) : s, "") }, g);
  const scroll = solid(g), cap = solid(g);
  // a loose scroll lying beside the case, along x
  const lie = [], end = [];
  for (let i = 0; i < 24; i++) {
    const t = (i / 24) * Math.PI * 2, y = 14 + 7 * Math.cos(t), z = 7 + 7 * Math.sin(t);
    lie.push(P(40, y, z), P(92, y, z));
    end.push(P(92, y, z));
  }
  mk("path", { class: "sil", d: poly(hull(lie)) }, g);
  mk("path", { class: "nf lo", d: poly(end) }, g);

  const lift = tween(AJAR);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const k = clampK(l), s = 2 + k * LIFT * reach;
    put(scroll, prism(P, front, disc(0, 0, SR), disc(0, 0, SR - 4), BH - 2, BH + s));
    const z = (BH - 6 + AJAR) * (1 - k) + (BH + s + 2) * k;
    put(cap, prism(P, front, disc(0, 0, R + 1.6), disc(0, 0, R), z, z + CH));
  }
  const clampK = (l) => Math.max(0, (l - AJAR) / (LIFT - AJAR));

  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, BH / 2);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(lift, o ? LIFT : AJAR, performance.now(), 0);
    cap.sil.classList.toggle("hi", !o);
    scroll.sil.classList.toggle("hi", o);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: (p) => set(Math.abs(p[0] - mid[0]) < 60 && Math.abs(p[1] - mid[1]) < 120),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "scrollcase",
  means: "A scroll case: the pointer lifts its cap away and slides the rolled scroll up out of the tube.",
  rules: [1, 5, 8, 9],
  range: [0.5, 1, 1.2],
  tour: [[169, 119], [169, 200], [178, 150], null],
  mount,
});
