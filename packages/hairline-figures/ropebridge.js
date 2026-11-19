/**
 * Rope bridge: a plank deck slung between two pairs of posts, hand ropes
 * above, hangers down to each plank. The pointer picks a plank by where it
 * stands: the deck swings sideways and dips under it, staggered out from the
 * plank. At rest the middle plank is bright. The slider is how far it swings.
 *
 * The pattern: one of many in a single row (cloches).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, tdone, tset, tval, tween, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 13, L = 190, HW = 12, DZ = 30, SAG = 9, PH = 54, FAV = 6;
const tx = (i) => (i + 0.5) / N;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.48);
  fit(C, [[-12, -HW - 34, 0], [L + 12, HW + 34, 0], [-12, HW + 34, PH], [L + 12, -HW - 34, PH], [L / 2, HW + 30, DZ - SAG - 12]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, y, gr) => { const [r, i] = rings(x - 3, y - 3, x + 3, y + 3, 2.5, 0.8); put(solid(gr), prism(P, front, r, i, 0, PH)); };
  for (const [x, y] of [[-6, -HW - 2], [L + 6, -HW - 2]]) post(x, y, g);
  const farRope = mk("path", { class: "nf" }, g), farHang = mk("path", { class: "nf lo" }, g);
  const planks = [];
  for (let i = 0; i < N; i++) planks.push({ s: solid(g), dy: tween(0), dz: tween(0) });
  const nearHang = mk("path", { class: "nf lo" }, g), nearRope = mk("path", { class: "nf" }, g);
  const footRopes = mk("path", { class: "nf lo" }, g);
  const ng = mk("g", {}, g);
  for (const [x, y] of [[-6, HW + 2], [L + 6, HW + 2]]) post(x, y, ng);
  let last = "";

  const W = L / N;
  function draw(now) {
    const v = planks.map((p) => [tval(p.dy, now), tval(p.dz, now)]);
    const key = v.join();
    if (key === last) return;
    last = key;
    const deck = (i) => DZ - SAG * Math.sin(Math.PI * tx(i)) + v[i][1];
    planks.forEach((p, i) => {
      const x0 = i * W + 1.4, y = v[i][0], z = deck(i);
      const [r, inn] = rings(x0, -HW + y, x0 + W - 2.8, HW + y, 1.4, 0.6);
      put(p.s, prism(P, front, r, inn, z - 1.6, z));
    });
    const rope = (side, up) => {
      const pts = [P(-6, side * (HW + 2), up ? PH - 4 : DZ)];
      planks.forEach((_, i) => pts.push(P(tx(i) * L, side * HW + v[i][0], deck(i) + (up ? 18 : 0))));
      pts.push(P(L + 6, side * (HW + 2), up ? PH - 4 : DZ));
      return open(pts);
    };
    const hang = (side) => planks.map((_, i) => "M" + P(tx(i) * L, side * HW + v[i][0], deck(i) + 18).join(",") + "L" + P(tx(i) * L, side * HW + v[i][0], deck(i)).join(",")).join("");
    farRope.setAttribute("d", rope(-1, true));
    nearRope.setAttribute("d", rope(1, true));
    farHang.setAttribute("d", hang(-1));
    nearHang.setAttribute("d", hang(1));
    footRopes.setAttribute("d", rope(1, false));
  }

  const B = register(stage, (_dt, now) => { draw(now); return planks.some((p) => !tdone(p.dy, now) || !tdone(p.dz, now)); });
  bag.add(B.unregister);

  const mids = planks.map((_, i) => P(tx(i) * L, 0, DZ - SAG * Math.sin(Math.PI * tx(i))));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    planks.forEach((p, i) => {
      const s = Math.sin(Math.PI * tx(i)), near = a < 0 ? 0 : Math.exp(-(((i - a) / 3) ** 2));
      tset(p.dy, a < 0 ? 4 * s : amp * s * clamp(0.55 + 0.45 * near, 0, 1), now, from < 0 ? 0 : Math.abs(i - from) * 40);
      tset(p.dz, a < 0 ? 0 : -amp * 0.3 * near * s, now, from < 0 ? 0 : Math.abs(i - from) * 40);
      p.s.sil.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "plank " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "ropebridge",
  means: "A plank rope bridge between posts: the plank under the pointer dips and the deck swings sideways, spreading out from it.",
  rules: [1, 2, 3, 5],
  range: [12, 22, 30],
  tour: [[200, 144], [150, 118], [250, 175], null],
  mount,
});
