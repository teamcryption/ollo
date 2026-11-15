/**
 * Luggage rack: a folding hotel rack, two scissor legs at each end under two
 * rails joined by webbing straps. At rest it stands half folded, tall and
 * narrow, its middle strap bright. The pointer over it opens the rack: the
 * legs scissor out, the rails spread and drop, the straps pull taut.
 * The slider is how far it opens.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, clamp, unproj, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 74, LEG = 46, REST = 16, CZ = 0;
const hOf = (s) => Math.sqrt(LEG * LEG - s * s);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-4, -22, 0], [L + 4, 22, 0], [L + 4, -22, 0], [-4, 22, 0], [0, 0, LEG + 2], [L, 0, LEG + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const legsFar = mk("path", { class: "nf" }, g);
  const railA = solid(g);
  const straps = [0, 1, 2, 3].map(() => mk("path", { class: "nf" }, g));
  const railB = solid(g);
  const legsNear = mk("path", { class: "nf" }, g);
  const sp = tween(REST);
  let last = NaN;

  function draw(s) {
    if (s === last) return;
    last = s;
    const h = hOf(s), y = s / 2;
    const leg = (x) => seg(P(x, -y, 0), P(x, y, h)) + seg(P(x, y, 0), P(x, -y, h));
    legsFar.setAttribute("d", leg(4));
    legsNear.setAttribute("d", leg(L - 4));
    const [ra, ia] = rings(0, -y - 1.6, L, -y + 1.6, 1.6, 0.6);
    put(railA, prism(P, front, ra, ia, h - 2.4, h));
    const [rb, ib] = rings(0, y - 1.6, L, y + 1.6, 1.6, 0.6);
    put(railB, prism(P, front, rb, ib, h - 2.4, h));
    straps.forEach((st, i) => {
      const x = 14 + i * 15.3, sag = clamp(6 - s * 0.16, 0.5, 6);
      const pts = [], n = 8;
      for (let j = 0; j <= n; j++) { const t = j / n; pts.push(P(x, lerpY(-y, y, t), h - 1 - sag * 4 * t * (1 - t))); }
      const pts2 = pts.map((p, j) => P(x + 4, lerpY(-y, y, j / n), h - 1 - sag * 4 * (j / n) * (1 - j / n)));
      st.setAttribute("d", "M" + pts.map((p) => p.join(",")).join("L") + "L" + pts2.reverse().map((p) => p.join(",")).join("L") + "Z");
    });
  }
  const lerpY = (a, b, t) => a + (b - a) * t;

  const B = register(stage, (_dt, now) => { draw(tval(sp, now)); return !tdone(sp, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(sp, a ? 18 + 18 * open : REST, performance.now(), 0);
    straps.forEach((st, i) => st.classList.toggle("hi", a ? i === 0 || i === 3 : i === 1));
    railB.sil.classList.toggle("hi", !!a);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const [x2, y2] = unproj(C, sx, sy, 30);
    return (x > -8 && x < L + 8 && Math.abs(y) < 26) || (x2 > -8 && x2 < L + 8 && Math.abs(y2) < 20);
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "hotelsafe",
  means: "A folding luggage rack stands half folded; the pointer opens it, the scissor legs spreading and the straps pulling taut.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[200, 114], [124, 77], [276, 152], null],
  mount,
});
