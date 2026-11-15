/**
 * Folding sawhorse: a beam on two pairs of hinged legs. The pointer's distance
 * from the beam, across it on the floor, is how far the legs splay: spread them
 * and the beam drops, fold them and it rises. At rest it stands half open, the
 * beam bright.
 */
const {
  Cam, facing, fit, prism, proj, rings, unproj, spring, stepS, clamp, fillet, poly, seg,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const L = 50, S0 = 17, SMIN = 5, SMAX = 32, XL = [-30, 30], BW = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-44, -SMAX, 0], [44, SMAX, 0], [-44, -SMAX, 0], [44, -4, 56], [-44, 4, 56], [44, SMAX, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g), beam = solid(g), fore = mk("g", {}, g);
  const legs = [];
  for (const side of [-1, 1]) for (const x of XL) {
    const par = side < 0 ? back : fore;
    legs.push({ side, x, el: mk("path", { class: "sil" }, par), lo: mk("path", { class: "lo nf" }, par), dot: flatDot(par, C, 1.3, "dot off") });
  }
  const brace = mk("path", { class: "lo nf" }, back);
  beam.sil.classList.add("hi");

  const sp = spring(S0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const s = sp.x;
    if (Math.abs(s - drawn) < 1e-3) return;
    drawn = s;
    const h = Math.sqrt(L * L - s * s);
    for (const l of legs) {
      const y0 = l.side * BW, y1 = l.side * s, a = l.x - 2.6 * Math.sign(l.x) - 2.4, b = a + 4.8;
      const q = [P(a, y0, h), P(b, y0, h), P(b + Math.sign(l.x) * 3, y1, 0), P(a + Math.sign(l.x) * 3, y1, 0)];
      l.el.setAttribute("d", poly(fillet(q, [1, 1, 1, 1])));
      l.lo.setAttribute("d", seg(P(a + 1.2, y0, h - 1), P(a + 1.2 + Math.sign(l.x) * 3, y1, 1)));
      place(l.dot, P(l.x + Math.sign(l.x) * 3, y1, 0));
    }
    const m = 0.45;
    brace.setAttribute("d", seg(P(XL[0] + 1, -BW - (s - BW) * m, h * (1 - m)), P(XL[1] - 1, -BW - (s - BW) * m, h * (1 - m))));
    put(beam, prism(P, front, ...rings(-44, -BW - 1, 44, BW + 1, 2, 1), h, h + 6));
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(t, live) {
    sp.t = t;
    read.textContent = live ? Math.round((2 * Math.atan(t / Math.sqrt(L * L - t * t)) * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(x) > 70 || Math.abs(y) > 60) { aim(S0, false); return; }
      aim(clamp(Math.round(Math.abs(y)), SMIN, SMAX), true);
    },
    leave: () => aim(S0, false),
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sawhorse",
  means: "A folding sawhorse: the legs splay as far as the pointer is from the beam, and the beam drops as they spread.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[192, 212], [147, 235], [283, 200], null],
  mount,
});
