/**
 * Rug: a fringed rug half rolled up on the floor. The pointer across the
 * stage rolls it out, on a spring: the roll slides along the floor and
 * thins as the flat rug grows behind it. At rest two fifths lie flat and the
 * roll is bright. The slider is how much the rug can unroll.
 *
 * The pattern: a continuous aim (terrain's spring, on one unrolled length).
 */
const { Cam, fit, hull, poly, open, proj, clamp, lerp, spring, stepS, mk, pointer, register, disposer } = HL;

const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - a[1] * b[0]; } return s; };
const L = 130, Wd = 62, R0 = 17, R1 = 5, TH = 1.6, REST = 0.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-8, 0, 0], [-8, Wd, 0], [R0 * 2, 0, R0 * 2], [R0 * 2, Wd, R0 * 2], [L + 2 * R1, 0, 0], [L + 2 * R1, Wd, 0], [L, Wd, 2 * R1]], 200, 165);
  const P = proj(C);
  const sg = Math.sign(area([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map((p) => P(...p))));
  const g = mk("g", {}, svg);
  const fringe = mk("path", { class: "nf lo" }, g);
  const slab = mk("path", {}, g), border = mk("path", { class: "nf lo" }, g);
  const roll = mk("path", { class: "sil hi" }, g), cap = mk("path", {}, g), spiral = mk("path", { class: "nf lo" }, g);
  const fr = [];
  for (let k = 0; k <= 12; k++) { const y = 3 + k * ((Wd - 6) / 12); fr.push(open([P(0, y, 0), P(-6, y, 0)])); }
  fringe.setAttribute("d", fr.join(""));
  const circle = (cx, y, cz, r, n = 32) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return P(cx + r * Math.cos(t), y, cz + r * Math.sin(t)); });

  let last = NaN;
  function draw(u) {
    if (Math.abs(u - last) < 0.0005) return;
    last = u;
    const r = Math.sqrt(R0 * R0 - u * (R0 * R0 - R1 * R1)), U = u * L, cx = U + r;
    const top = (z) => [[0, 0, z], [U, 0, z], [U, Wd, z], [0, Wd, z]].map((p) => P(...p));
    slab.setAttribute("d", U < 0.5 ? "" : poly(hull(top(0).concat(top(TH)))) + poly(top(TH)));
    border.setAttribute("d", U < 8 ? "" : poly([[4, 4, TH], [U - 2, 4, TH], [U - 2, Wd - 4, TH], [4, Wd - 4, TH]].map((p) => P(...p))));
    const near = circle(cx, Wd, r, r), far = circle(cx, 0, r, r);
    roll.setAttribute("d", poly(hull(near.concat(far))));
    cap.setAttribute("d", poly(area(near) * sg < 0 ? near : far));
    const sp = [];
    for (let i = 0; i <= 90; i++) { const t = i / 90, a = t * 3.2 * 2 * Math.PI, rr = r * (0.18 + 0.78 * t); sp.push(P(cx + rr * Math.cos(-a), Wd, r + rr * Math.sin(-a))); }
    spiral.setAttribute("d", open(sp));
  }
  const s = spring(REST, { k: 60, c: 15.5 });
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); read.textContent = s.t === REST && !m ? "rest" : Math.round(s.x * 100) + "%"; return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx]) => { s.t = lerp(REST, max, clamp((sx - 120) / 170, 0, 1)); B.wake(); },
    leave: () => { s.t = REST; B.wake(); },
  }));
  draw(REST);
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "rugroll",
  means: "A fringed rug half rolled on the floor: the pointer rolls it out, the roll sliding away and thinning as the flat rug grows.",
  rules: [3, 5, 8],
  range: [0.6, 0.9, 1],
  tour: [[200, 122], [285, 150], [150, 120], null],
  mount,
});
