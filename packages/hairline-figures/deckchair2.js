/**
 * Deck chair: a folding deck chair, two crossed rails a side, a canvas sling
 * hung between the top bar and the front bar. The pointer's place along the
 * chair tilts the back: toward the front it sits up, toward the back it
 * lies down, the sling sagging with it. At rest it leans halfway, its sling
 * bright. The slider is how far the back can lie.
 */
const {
  Cam, circ, fit, hull, poly, proj, rad, clamp, lerp, spring, stepS, unproj,
  disposer, mk, pointer, register,
} = HL;

const W = 44, R = 2.2, PIV = [62, 0], LEN = 82, FB = [70, 34], REAR = [4, 0], REST = 58;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-30, 0, 0], [80, W, 0], [70, 0, 80], [-10, W, 70], [80, W, 36]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const disc = circ(R * 1.95, 12);
  const bar = (a, b) => { const pa = P(...a), pb = P(...b), pts = []; for (const q of disc) { pts.push([pa[0] + q.u, pa[1] + q.v], [pb[0] + q.u, pb[1] + q.v]); } return poly(hull(pts)); };
  const farA = mk("path", { class: "sil" }, g), farB = mk("path", { class: "sil" }, g);
  const topBar = mk("path", { class: "sil" }, g), frontBar = mk("path", { class: "sil" }, g);
  const sling = mk("path", { class: "sil" }, g);
  const nearA = mk("path", { class: "sil" }, g), nearB = mk("path", { class: "sil" }, g);
  for (const [el, y] of [[farB, 0], [nearB, W]]) el.setAttribute("d", bar([REAR[0], y, 0], [FB[0], y, FB[1]]));
  frontBar.setAttribute("d", bar([FB[0], 0, FB[1]], [FB[0], W, FB[1]]));
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    const r = r2(a);
    if (r === last) return;
    last = r;
    const tx = PIV[0] - LEN * Math.cos(rad(a)), tz = LEN * Math.sin(rad(a));
    farA.setAttribute("d", bar([PIV[0], 0, 0], [tx, 0, tz]));
    nearA.setAttribute("d", bar([PIV[0], W, 0], [tx, W, tz]));
    topBar.setAttribute("d", bar([tx, 0, tz], [tx, W, tz]));
    // the sling: a curve from the top bar to the front bar, sagging by how far it lies back
    const sag = 10 + (78 - a) * 0.35, curve = (y) => {
      const out = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16, x = lerp(tx, FB[0], t), z = lerp(tz, FB[1], t) - sag * 4 * t * (1 - t);
        out.push(P(x, y, z));
      }
      return out;
    };
    sling.setAttribute("d", poly(curve(3).concat(curve(W - 3).reverse())));
  }
  const r2 = (n) => Math.round(n * 100) / 100;

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -40 || x > 110 || y < -30 || y > W + 30) return leave();
    const t = clamp((x + 20) / 110, 0, 1);
    ang.t = lerp(78 - 40 * reach, 78, t);
    sling.classList.add("hi");
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; sling.classList.add("hi"); B.wake(); }
  draw(REST); leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "deckchair2",
  means: "A folding deck chair: the pointer's place along it tilts the back, sitting it up at the front or laying it down at the back.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.7, 1],
  tour: [[128, 177], [216, 221], [295, 260], null],
  mount,
});
