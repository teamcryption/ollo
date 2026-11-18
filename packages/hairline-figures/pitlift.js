/**
 * Orchestra pit lift: a stage block with the pit in front of it, and in the
 * pit a platform with chairs standing on scissor arms. Over the figure the
 * platform rises out of the pit past the stage edge; leaving lowers it back
 * to its rest, half sunk. The platform is bright. The slider is the climb.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 12, SZ = 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let climb = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [120, 104, 0], [120, 0, 0], [0, 104, 0], [12, 44, REST + 40 + 12], [108, 92, REST + 40 + 12]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 3, b = 1.4) => {
    const s = solid(par), [ri, ii] = rings(x0, y0, x1, y1, r, b);
    put(s, prism(P, front, ri, ii, z0, z1));
    return s;
  };
  box(g, 0, 0, 120, 34, 0, SZ, 4, 2);
  box(g, 6, 40, 114, 98, 0, 2, 4, 2);
  const mg = mk("g", {}, g);
  const arms = mk("path", { class: "nf lo" }, mg);
  const deck = solid(mg);
  deck.sil.classList.add("hi");
  const chairs = [[30, 58], [60, 58], [90, 58], [45, 76], [75, 76]].map(([x, y]) => ({ x, y, s: solid(mg) }));
  box(g, 4, 98, 116, 104, 0, 7, 2, 1);

  const h = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const a = [], X = [[24, 54], [66, 96]];
    for (const [x0, x1] of X) {
      a.push(open([P(x0, 92, 2), P(x1, 92, z)]), open([P(x0, 92, z), P(x1, 92, 2)]));
    }
    arms.setAttribute("d", a.join(""));
    const [ri, ii] = rings(12, 44, 108, 92, 4, 2);
    put(deck, prism(P, front, ri, ii, z, z + 4));
    for (const c of chairs) {
      const [r1, i1] = rings(c.x - 5, c.y - 4, c.x + 5, c.y + 4, 2, 1);
      put(c.s, prism(P, front, r1, i1, z + 4, z + 11));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(h, now)); return !tdone(h, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(h, v ? REST + climb : REST, performance.now(), 0);
    read.textContent = v ? "up" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -10 && x < 130 && y > -10 && y < 114;
  }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { climb = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "pitlift",
  means: "An orchestra pit lift: over the stage the chaired platform rises out of the pit on its scissor arms; the slider sets the climb.",
  rules: [1, 3, 5, 6],
  range: [16, 32, 40],
  tour: [[180, 177], [140, 195], [215, 168], null],
  mount,
});
