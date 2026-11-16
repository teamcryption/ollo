/**
 * Gym mat: a folding mat of four panels laid in a row. The pointer picks a
 * panel by where it stands on the floor: the panel tilts up on its hinge,
 * folding toward the far end, and the panels beside it tilt a little,
 * staggered from it. At rest one panel is half raised, bright. The slider
 * is the stagger.
 */
const { Cam, fit, fillet, hull, poly, proj, clamp, rad, tdone, tset, tval, tween, unproj, disposer, mk, pointer, register, solid } = HL;

const N = 4, W = 36, DY = 58, T = 6, FAV = 1, UP = 68, REST = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [N * W, 0, 0], [0, DY, 0], [N * W, DY, 0], [W * 0.4, 0, W], [W * 0.4, DY, W]], 200, 172);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) items.push({ k, s: solid(g), x1: (k + 1) * W, z: tween(k === FAV ? REST : 3 + 2 * k), last: NaN });

  function pt(it, a, u, h, y) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return P(it.x1 - u * c + (h - T) * s, y, T + u * s + (h - T) * c);
  }
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = [];
    for (const u of [0, W]) for (const h of [0, T]) for (const y of [0, DY]) pts.push(pt(it, a, u, h, y));
    const hl = hull(pts);
    it.s.sil.setAttribute("d", poly(fillet(hl, hl.map(() => 1.6))));
    const e = 1.6, top = [pt(it, a, e, T, e), pt(it, a, W - e, T, e), pt(it, a, W - e, T, DY - e), pt(it, a, e, T, DY - e)];
    it.s.cr.setAttribute("d", poly(fillet(top, [1, 1, 1, 1])));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (y < -6 || y > DY + 6 || x < -6 || x > N * W + 6) return -1;
    return clamp(Math.floor(x / W), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? REST : 3 + 2 * k) : dd === 0 ? UP : dd === 1 ? 22 : 5;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "panel " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mats",
  means: "A folding gym mat of four panels: the panel under the pointer tilts up on its hinge, and its neighbours tilt a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[273, 225], [200, 180], [150, 150], null],
  mount,
});
