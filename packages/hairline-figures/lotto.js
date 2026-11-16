/**
 * Bingo dabber: a squat ink bottle with a tall cap, standing beside a card
 * with a few squares already dabbed. Raising the pointer slides the cap up
 * off the sponge tip; at rest it sits a little ajar, bright. The slider is
 * how far it can lift.
 *
 * The pattern: one part sliding to follow the pointer.
 */
const { Cam, circ, fit, facing, prism, proj, rings, clamp, spring, stepS, disposer, mk, flatDot, place, pointer, put, register, solid } = HL;

const BR = 17, BH = 44, NR = 11, NH = 6, TR = 7, TH = 6, CR = 13, CH = 40, LIFT = 34, REST = 5;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-BR, -BR, 0], [100, 44, 0], [100, -34, 0], [-BR, 44, 0], [0, 0, BH + NH + CH + LIFT + 2]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the card, with its squares
  const [cr, ci] = rings(30, -34, 100, 44, 4, 1.4);
  put(solid(g), prism(P, front, cr, ci, 0, 1.6));
  const dabbed = new Set([0, 4, 8, 5]);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const d = flatDot(g, C, dabbed.has(i * 3 + j) ? 6 : 2.4, dabbed.has(i * 3 + j) ? "dot m" : "dot off");
    place(d, P(44 + i * 21, -18 + j * 23, 1.6));
  }
  put(solid(g), prism(P, front, disc(BR), disc(BR - 2.5), 0, BH));
  put(solid(g), prism(P, front, disc(NR), disc(NR - 1.5), BH, BH + NH));
  put(solid(g), prism(P, front, disc(TR), disc(TR - 1.5), BH + NH, BH + NH + TH));
  const cap = solid(g), band = solid(g);
  cap.sil.classList.add("hi");
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const z = BH + 1 + l;
    put(cap, prism(P, front, disc(CR), disc(CR - 2), z, z + CH));
    put(band, prism(P, front, disc(CR + 1.2), disc(CR - 1), z, z + 7));
  }
  const sp = spring(REST, { k: 120, c: 18 });
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(t, r) { sp.t = t; read.textContent = r ? "rest" : t > 16 ? "open" : "shut"; B.wake(); }
  aim(REST, 1);
  bag.add(pointer(stage, { move: ([, sy]) => aim(clamp((250 - sy) / 170, 0, 1) * LIFT * gain), leave: () => aim(REST, 1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "lotto",
  means: "A bingo dabber beside a dabbed card: raising the pointer slides its cap up off the sponge tip, and it rests a little ajar.",
  rules: [3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 120], [200, 60], [230, 200], null],
  mount,
});
