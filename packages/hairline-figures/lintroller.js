/**
 * Lintroller: a lint roller resting on a folded cloth. The pointer slides the
 * roller along the cloth to where it stands, the sticky drum riding the
 * nap. At rest the roller sits partway along, bright. The slider is how far
 * the roller may travel.
 *
 * The pattern: one part following the pointer (slide).
 */
const { Cam, circ, rrect, fit, hull, poly, proj, clamp, spring, stepS, mk, pointer, register, disposer } = HL;

const lev = (r, x, y, z, n = 24) => circ(r, n).map((q) => [x + q.u, y + q.v, z]);
const drum = (x, r, y0, y1, n = 28) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; for (const y of [y0, y1]) o.push([x + r * Math.cos(a), y, 10 + r * Math.sin(a)]); } return o; };
const R = 9, W = 22, CL = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-50, -30, 0], [60, 30, 0], [-50, 30, 0], [60, -30, 0], [60, 0, 50], [-50, 0, 50]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const cloth = mk("path", { class: "sil" }, g), fold = mk("path", { class: "nf lo" }, g);
  const ring = rrect(-60, -32, 60, 32, 6, 8).map((q) => [q.u, q.v]);
  cloth.setAttribute("d", poly(hull(ring.map(([u, v]) => P(u, v, 0)).concat(ring.map(([u, v]) => P(u, v, 3))))));
  fold.setAttribute("d", poly(ring.map(([u, v]) => P(u * 0.94, v * 0.88, 3))));
  const mg = mk("g", {}, g);
  const handle = mk("path", { class: "sil" }, mg), arm = mk("path", { class: "sil" }, mg);
  const body = mk("path", { class: "sil" }, mg), seam = mk("path", { class: "nf lo" }, mg), end = mk("path", { class: "nf lo" }, mg);
  body.classList.add("hi");
  const sp = spring(-8);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    const T = (p) => P(...p);
    handle.setAttribute("d", poly(hull([...lev(3.2, x - 26, W / 2 + 4, 38), ...lev(3.6, x - 10, W / 2 + 4, 26)].map(T))));
    arm.setAttribute("d", poly(hull([...lev(1.4, x - 10, W / 2 + 4, 26, 10), ...lev(1.4, x, W / 2 + 4, 10, 10), ...lev(1.4, x, W / 2, 10, 10)].map(T))));
    body.setAttribute("d", poly(hull(drum(x, R, -W / 2, W / 2).map(T))));
    seam.setAttribute("d", poly(hull(drum(x + 3, R, -W / 2 + 0.1, W / 2 - 0.1, 2).map(T))));
    const e = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * 2 * Math.PI; e.push(T([x + R * Math.cos(a), W / 2, 10 + R * Math.sin(a)])); }
    end.setAttribute("d", poly(e));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const a0 = P(-40, 0, 0), a1 = P(40, 0, 0);
  function aim(p) {
    const inside = p && p[1] > a0[1] - 90 && p[1] < a1[1] + 60 && p[0] > a0[0] - 40 && p[0] < a1[0] + 40;
    const t = inside ? clamp((p[0] - a0[0]) / (a1[0] - a0[0]), 0, 1) : null;
    sp.t = t === null ? -8 : (t * 2 - 1) * reach;
    read.textContent = t === null ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "lintroller",
  means: "A lint roller on a folded cloth: the sticky drum slides along the cloth to where the pointer stands.",
  rules: [1, 3, 4, 5],
  range: [20, 40, 48],
  tour: [[251, 183], [135, 143], [200, 165], null],
  mount,
});
