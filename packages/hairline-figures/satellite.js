/**
 * Satellite: a box bus with a dish on top and two solar wings on booms, each
 * wing three cells long. The pointer is the sun: both wings unfold and tilt on
 * springs to face it, the nearer one all the way open and bright. At rest one
 * wing is half stowed and the other open at a slant, and the dish is bright.
 * The slider is how quickly the wings follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (spotlights); the hit is on the bus's
 * middle plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, lerp, poly, prism, proj, ringAt, rings, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const B0 = 10, BZ = 24, ZC = 12, HW = 9, BOOM = 5, LMIN = 12, LMAX = 42, BMAX = 0.95;
const REST = [{ u: 0.3, b: 0.5 }, { u: 0.85, b: -0.35 }];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  const R = B0 + BOOM + LMAX, hz = HW * Math.sin(BMAX);
  fit(C, [[-R, -HW, ZC - hz], [-R, HW, ZC + hz], [R, -HW, ZC + hz], [R, HW, ZC - hz], [0, 0, BZ + 15], [B0, B0, 0], [-B0, -B0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const opt = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const wing = (k) => {
    const grp = mk("g", {}, g);
    return {
      k, side: k ? 1 : -1, grp, u: spring(REST[k].u, opt), b: spring(REST[k].b, opt), drawn: "",
      boom: mk("path", { class: "nf sil" }, grp), panel: mk("path", { class: "sil" }, grp), cells: mk("path", { class: "nf lo" }, grp),
    };
  };
  const wings = [wing(0)];
  // the bus, then its dish on a short mast, the feed standing out of the bowl
  const [br, bi] = rings(-B0, -B0, B0, B0, 2.5, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  mk("path", { class: "nf lo", d: seg(P(B0, -B0 + 3, 6), P(B0, B0 - 3, 6)) }, g);
  put(solid(g), prism(P, front, circ(1.4, 16), null, BZ, BZ + 4));
  const bowl = mk("path", { class: "sil", d: poly(hull(ringAt(P, circ(3, 24), BZ + 4).concat(ringAt(P, circ(11, 48), BZ + 9)))) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, circ(10, 48), BZ + 9)) }, g);
  mk("path", { class: "nf sil", d: seg(P(0, 0, BZ + 5), P(0, 0, BZ + 14)) }, g);
  place(flatDot(g, C, 0.9, "dot m"), P(0, 0, BZ + 14));
  wings.push(wing(1));

  function draw(w) {
    const u = w.u.x, b = w.b.x, key = u.toFixed(4) + "," + b.toFixed(4);
    if (key === w.drawn) return;
    w.drawn = key;
    const L = lerp(LMIN, LMAX, u), x0 = w.side * (B0 + BOOM), x1 = w.side * (B0 + BOOM + L);
    const at = (x, v) => P(x, v * Math.cos(b), ZC + v * Math.sin(b));
    w.boom.setAttribute("d", seg(P(w.side * B0, 0, ZC), at(x0, 0)));
    w.panel.setAttribute("d", poly(fillet([at(x0, -HW), at(x1, -HW), at(x1, HW), at(x0, HW)], [1.5, 1.5, 1.5, 1.5])));
    let d = seg(at(x0 + w.side, 0), at(x1 - w.side, 0));
    for (const t of [1 / 3, 2 / 3]) { const x = lerp(x0, x1, t); d += seg(at(x, -HW + 1), at(x, HW - 1)); }
    w.cells.setAttribute("d", d);
  }

  const Bk = register(stage, (dt) => {
    let m = false;
    for (const w of wings) { if (stepS(w.u, dt)) m = true; if (stepS(w.b, dt)) m = true; draw(w); }
    return m;
  });
  bag.add(Bk.unregister);

  let over = null;
  function retarget() {
    const near = over ? (over[0] < 0 ? 0 : 1) : -1;
    for (const w of wings) {
      w.u.t = over ? (w.k === near ? 1 : 0.7) : REST[w.k].u;
      w.b.t = over ? clamp(Math.atan2(-over[1], 40), -BMAX, BMAX) : REST[w.k].b;
      w.panel.classList.toggle("hi", w.k === near);
    }
    bowl.classList.toggle("hi", near < 0);
    read.textContent = near < 0 ? "rest" : `wing ${near + 1}`;
    Bk.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZC);
      over = Math.abs(x) > R + 16 || Math.abs(y) > 70 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const w of wings) for (const s of [w.u, w.b]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "satellite",
  means: "A satellite with two folding solar wings: they unfold and tilt to face the pointer as the sun, the nearer wing bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[293, 202], [100, 110], [270, 261], null],
  mount,
});
