/**
 * Straddle carrier: four tall legs on bogies under two top girders, a cab on
 * the front corner, and a spreader hanging a container between the legs on
 * four cables. Over the machine the spreader hoists the container on the
 * 700ms ease; leaving lowers it near the ground, the spreader bright. The
 * slider is the hoist height.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, clamp, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 6, TOPZ = 62, LX = 34, LY = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-42, -24, 0], [42, 24, 0], [42, -24, 0], [-42, 24, 0], [-42, -24, TOPZ + 14], [42, 24, TOPZ + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, s) => { const [o, i] = rings(x0, y0, x1, y1, r, b); s = s || solid(g); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const leg = (x, y) => { box(x - 9, y - 3, x + 9, y + 3, 2.5, 0.8, 0, 7); box(x - 2.5, y - 2.5, x + 2.5, y + 2.5, 1, 0.6, 7, TOPZ); };
  leg(-LX, -LY);
  box(-40, -LY - 3, 40, -LY + 3, 2, 0.8, TOPZ, TOPZ + 6);
  box(-LX - 3, -LY, -LX + 3, LY, 2, 0.8, TOPZ, TOPZ + 5);
  leg(LX, -LY); leg(-LX, LY);
  const cables = mk("path", { class: "lo nf" }, g);
  const cg = mk("g", {}, g);
  const cont = solid(cg), ribs = mk("path", { class: "lo nf" }, cg), spread = solid(cg);
  spread.sil.classList.add("hi");
  leg(LX, LY);
  box(LX - 3, -LY, LX + 3, LY, 2, 0.8, TOPZ, TOPZ + 5);
  box(-40, LY - 3, 40, LY + 3, 2, 0.8, TOPZ, TOPZ + 6);
  box(LX - 6, LY - 8, LX + 6, LY + 4, 3, 1.2, TOPZ + 6, TOPZ + 16);

  const lift = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    box(-28, -11, 28, 11, 1.5, 1, z, z + 22, cont);
    let d = "";
    for (let i = 1; i < 10; i++) { const x = -28 + i * 5.6; d += "M" + P(x, 11, z + 2).join(",") + "L" + P(x, 11, z + 20).join(","); }
    ribs.setAttribute("d", d);
    box(-30, -12, 30, 12, 2, 1, z + 22, z + 25, spread);
    let c = "";
    for (const x of [-22, 22]) for (const s of [-1, 1]) c += "M" + P(x, s * 10, z + 25).join(",") + "L" + P(x, s * (LY - 2), TOPZ).join(",");
    cables.setAttribute("d", c);
  }

  const B = register(stage, (dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 160 || sy < 10 || sy > 310) return leave();
    tset(lift, top, performance.now(), 0);
    read.textContent = "hoist " + Math.round(top);
    B.wake();
  }
  function leave() { tset(lift, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 16, 32); }, destroy: bag.dispose };
}

hairline({
  name: "straddlecarrier",
  means: "A straddle carrier: over it the spreader hoists the container up between the tall legs; the slider sets the hoist height.",
  rules: [3, 5, 8],
  range: [16, 24, 32],
  tour: [[200, 172], [109, 215], [200, 127], null],
  mount,
});
