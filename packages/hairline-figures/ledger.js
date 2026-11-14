/**
 * Ledger book: an open account book on its boards, a stack of leaves on each
 * side of the spine. The pointer across the book is how far it has been read:
 * the leaves turn over the spine one after another as it passes, each landing
 * on the other pile. At rest one leaf stands half turned, bright. The slider
 * is how high the turning leaf lifts.
 *
 * The pattern: a run of leaves turning past the pointer (riffle).
 */
const {
  Cam, fit, fillet, poly, prism, proj, rings, unproj, clamp, rad, open,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing,
} = HL;

const N = 7, WP = 46, D = 64, Z0 = 3, REST = 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let arc = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-WP - 4, -4, 0], [WP + 4, D + 4, 0], [WP + 4, -4, 0], [-WP - 4, D + 4, 0], [0, 0, WP + 4], [0, D, WP + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-WP - 4, -4, WP + 4, D + 4, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  const spine = mk("path", { class: "nf lo", d: open([P(0, -2, Z0), P(0, D + 2, Z0)]) }, g);
  const lay = mk("g", {}, g);
  const leaves = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, lay);
    leaves.push({ k, grp, edge: mk("path", { class: "sil" }, grp), rule: mk("path", { class: "nf lo" }, grp), s: spring(0), last: NaN });
  }
  const f = spring(REST);
  let act = false, hiK = -1;

  function angle(it, s) { return lerpA(176 - it.k * 1.6, 4 + (N - 1 - it.k) * 1.6, s); }
  function lerpA(a, b, s) { return a + (b - a) * s; }
  function draw() {
    const order = [];
    let turning = -1, best = 2;
    for (const it of leaves) {
      const s = clamp(f.x * N - it.k, 0, 1);
      const th = rad(angle(it, 1 - s));
      const lift = Math.sin(Math.PI * s) * arc;
      const at = (w, y) => P(w * Math.cos(th), y, Z0 + 0.6 + w * Math.sin(th) + (w / WP) * lift * 0.2);
      if (s !== it.last) {
        it.last = s;
        it.edge.setAttribute("d", poly(fillet([at(0, 0), at(WP, 0), at(WP, D), at(0, D)], [0.5, 3, 3, 0.5])));
        // the account's ruled columns, faint on the leaf
        it.rule.setAttribute("d", [0.35, 0.6, 0.8].map((w) => open([at(WP * w, 6), at(WP * w, D - 6)])).join(" "));
      }
      const d = Math.abs(s - 0.5);
      if (d < best && s > 0 && s < 1) { best = d; turning = it.k; }
      order.push([Math.cos(th), it]);
    }
    order.sort((a, b) => (a[0] < 0 && b[0] < 0) ? a[0] - b[0] : (a[0] < 0 ? -1 : b[0] < 0 ? 1 : b[0] - a[0]));
    order.forEach(([, it]) => lay.appendChild(it.grp));
    if (turning !== hiK) {
      hiK = turning;
      leaves.forEach((it) => it.edge.classList.toggle("hi", it.k === turning));
    }
    read.textContent = act ? "leaf " + (turning >= 0 ? turning + 1 : f.t > 0.5 ? N : 1) : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(f, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t, on) { act = on; f.t = t; B.wake(); }
  draw();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x] = unproj(C, sx, sy, Z0); aim(clamp((WP - x) / (2 * WP), 0.02, 0.98), true); },
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { arc = v; leaves.forEach((it) => { it.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "ledger",
  means: "An open ledger book: leaves turn over the spine one after another as the pointer crosses the pages.",
  rules: [1, 2, 4, 5],
  range: [0, 8, 16],
  tour: [[167, 148], [155, 175], [259, 227], null],
  mount,
});
