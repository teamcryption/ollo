/**
 * Rosette: a prize rosette standing upright, a pleated outer ring, a smaller
 * pleated ring inside it and a round button at the centre, with two ribbon
 * tails hanging below. The pointer spins the pleats, the inner ring against
 * the outer, and swings the tails toward it. At rest the button is bright.
 * The slider is how far the pleats spin.
 */
const {
  Cam, fit, poly, proj, clamp, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const R1 = 44, R2 = 31, RB = 17, TL = 70;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.02);
  const s2 = Math.SQRT1_2, Z0 = TL + 6;
  const W = (u, v, t = 0) => [u * s2 + t * s2, -u * s2 + t * s2, Z0 + v];
  fit(C, [W(-R1 - 4, R1 + 4), W(R1 + 4, R1 + 4), W(-R1 - 4, -TL - 6), W(R1 + 4, -TL - 6)], 200, 162);
  const P = proj(C), Q = (u, v, t) => P(...W(u, v, t));
  const g = mk("g", {}, svg);
  const tails = [-1, 1].map(() => mk("path", { class: "sil" }, g));
  const tcr = [-1, 1].map(() => mk("path", { class: "nf lo" }, g));
  const back = mk("path", { class: "lo" }, g), outer = mk("path", { class: "sil" }, g), oc = mk("path", { class: "nf lo" }, g);
  const inner = mk("path", { class: "sil" }, g), ic = mk("path", { class: "nf lo" }, g);
  const btn = mk("path", { class: "sil" }, g), bc = mk("path", { class: "nf lo" }, g);
  const star = (n, ro, ri, a, t = 0) => { const p = []; for (let i = 0; i < 2 * n; i++) { const r = i % 2 ? ri : ro, th = a + (i * Math.PI) / n; p.push(Q(r * Math.cos(th), r * Math.sin(th), t)); } return p; };
  const ring = (r, t = 0) => Array.from({ length: 36 }, (_, i) => { const th = (i / 36) * 2 * Math.PI; return Q(r * Math.cos(th), r * Math.sin(th), t); });
  const REST = 0.12;
  const sp = spring(REST);
  let last = NaN;

  function draw(a) {
    const k = Math.round(a * 400) / 400;
    if (k === last) return;
    last = k;
    [-1, 1].forEach((sd, i) => {
      const sw = sd * 0.32 + k * 0.5, ca = Math.cos(sw), sa = Math.sin(sw);
      const loc = [[-8, 0], [8, 0], [9, -TL], [0, -TL + 10], [-9, -TL]];
      const pts = loc.map(([x, y]) => Q(x * ca - y * sa, x * sa + y * ca, -2));
      tails[i].setAttribute("d", poly(pts));
      tcr[i].setAttribute("d", poly(loc.slice(0, 2).concat([[6, -TL + 6], [-6, -TL + 6]]).map(([x, y]) => Q(x * 0.7 * ca - y * 0.92 * sa, x * 0.7 * sa + y * 0.92 * ca, -2))));
    });
    back.setAttribute("d", poly(star(18, R1, R1 - 7, k * 2 + 0.1, -3)));
    outer.setAttribute("d", poly(star(18, R1, R1 - 7, k * 2)));
    oc.setAttribute("d", poly(ring(R1 - 10)));
    inner.setAttribute("d", poly(star(14, R2, R2 - 5, -k * 3 + 0.2, 1.5)));
    ic.setAttribute("d", poly(ring(R2 - 8, 1.5)));
    btn.setAttribute("d", poly(ring(RB, 3)));
    bc.setAttribute("d", poly(ring(RB - 4, 3)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const mid = Q(0, 0, 0);
  let act = null;
  function aim(p) {
    const on = !!p && Math.abs(p[0] - mid[0]) < 130 && p[1] > mid[1] - 110 && p[1] < mid[1] + 170;
    sp.t = on ? clamp((p[0] - mid[0]) / 90, -1, 1) * reach : REST;
    if (on !== act) { act = on; btn.classList.toggle("hi", !on); outer.classList.toggle("hi", on); }
    read.textContent = on ? Math.round((sp.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "rosette",
  means: "A prize rosette: the pointer spins its pleated rings against each other and swings the ribbon tails toward it.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[125, 82], [275, 90], [200, 235], null],
  mount,
});
