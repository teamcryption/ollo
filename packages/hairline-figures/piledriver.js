/**
 * Pile driver: a tracked base with a cab and a tall mast, a pile standing
 * at its foot and a heavy hammer riding the mast. Over the rig the hammer
 * climbs the mast on the 700ms ease; leaving drops it back to its rest
 * above the pile, the hammer bright. The slider is how high it climbs.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, prism, proj, rings, clamp, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 44, MAST = 132, HAM = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-34, -20, 0], [44, 20, 0], [44, -20, 0], [-34, 20, 0], [22, 0, MAST], [-34, -20, 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(-34, -20, 20, -10, 4, 1.2, 0, 8);
  box(-34, 10, 20, 20, 4, 1.2, 0, 8);
  box(-30, -16, 18, 16, 5, 1.6, 8, 17);
  const brace = mk("path", { class: "lo nf" }, g);
  brace.setAttribute("d", "M" + P(-10, 0, 30).join(",") + "L" + P(18, 0, 92).join(","));
  box(-28, -14, -4, 12, 4, 1.4, 17, 34);
  box(16, -4, 24, 4, 2, 1, 0, MAST);
  box(28, -5, 38, 5, 2, 1, 0, 20);
  mk("path", { class: "dash", d: "M" + P(33, 0, 20).join(",") + "L" + P(33, 0, MAST - 4).join(",") }, g);
  const ham = solid(g);
  ham.sil.classList.add("hi");
  const [hr, hi] = rings(24, -9, 42, 9, 3, 1.4);
  const cap = mk("path", { class: "lo nf" }, g);

  const lift = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(ham, prism(P, front, hr, hi, z, z + HAM));
    cap.setAttribute("d", "M" + P(24, 9, z + 6).join(",") + "L" + P(42, 9, z + 6).join(",") + "L" + P(42, -9, z + 6).join(","));
  }

  const B = register(stage, (dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 110 || sy < 10 || sy > 310) return leave();
    tset(lift, top, performance.now(), 0);
    read.textContent = "up " + Math.round(top);
    B.wake();
  }
  function leave() { tset(lift, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 76, MAST - HAM - 4); }, destroy: bag.dispose };
}

hairline({
  name: "piledriver",
  means: "A pile driver: over it the heavy hammer climbs the tall mast above the pile; the slider sets how high it climbs.",
  rules: [3, 5, 8],
  range: [76, 90, 102],
  tour: [[243, 151], [200, 240], [150, 215], null],
  mount,
});
