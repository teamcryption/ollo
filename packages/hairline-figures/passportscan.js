/**
 * Kiosk check-in: three self check-in kiosks in a row on the terminal floor,
 * each a rounded pedestal with a hinged screen on top and a ticket slot in
 * its front. The pointer picks a kiosk by where it stands: its screen tilts
 * up to face the traveller and a boarding pass slides out of the slot; the
 * kiosks beside it wake a little, staggered. At rest one screen is half up,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), parts tilting on a hinge.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, KW = 30, KD = 20, KH = 54, STEP = 50, SL = 30, FAV = 1;
const REST = [16, 46, 10], OPEN = 78;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X1 = (N - 1) * STEP + KW;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-10, -24, 0], [X1 + 10, KD + 26, 0], [X1 + 10, -24, 0], [-10, KD + 26, 0], [KW / 2, KD - 6, KH + SL + 2], [X1 - KW / 2, KD - 6, KH + SL + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-10, -24, X1 + 10, KD + 26, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  // a queue line on the floor in front of the kiosks
  mk("path", { d: "M" + P(-4, KD + 18, 3).join(",") + "L" + P(X1 + 4, KD + 18, 3).join(","), class: "dash nf" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + KW, grp = mk("g", {}, g);
    const [kr, ki] = rings(x0, 0, x1, KD, 5, 1.6);
    put(solid(grp), prism(P, front, kr, ki, 3, KH));
    // reader window and ticket slot on the front face
    mk("path", { d: poly([P(x0 + 7, KD, 30), P(x0 + 7, KD, 38), P(x1 - 7, KD, 38), P(x1 - 7, KD, 30)]), class: "lo" }, grp);
    mk("path", { d: "M" + P(x0 + 8, KD, 24).join(",") + "L" + P(x1 - 8, KD, 24).join(","), class: "lo nf" }, grp);
    const pass = mk("path", { class: "" }, grp);
    const screen = mk("path", { class: "sil" }, grp), glass = mk("path", { class: "lo nf" }, grp);
    items.push({ k, x0, x1, pass, screen, glass, t: tween(REST[k]), last: NaN, mid: P((x0 + x1) / 2, KD / 2, KH / 2) });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const r = (a * Math.PI) / 180, dy = -SL * Math.cos(r), dz = SL * Math.sin(r), hy = KD - 1, hz = KH + 1;
    const q = (x, s) => P(x, hy + dy * s, hz + dz * s);
    it.screen.setAttribute("d", poly([q(it.x0 + 1, 0), q(it.x0 + 1, 1), q(it.x1 - 1, 1), q(it.x1 - 1, 0)]));
    it.glass.setAttribute("d", poly([q(it.x0 + 5, 0.15), q(it.x0 + 5, 0.85), q(it.x1 - 5, 0.85), q(it.x1 - 5, 0.15)]));
    // the pass comes out of the slot as the screen rises
    const out = Math.max(0, (a - 20) / (OPEN - 20)) * 16;
    it.pass.setAttribute("d", out < 0.5 ? "" : poly([P(it.x0 + 10, KD, 24), P(it.x0 + 10, KD + out, 24 - out * 0.35), P(it.x1 - 10, KD + out, 24 - out * 0.35), P(it.x1 - 10, KD, 24)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const dd = Math.abs(it.mid[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(items[best].mid[1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 30 : 8;
      tset(it.t, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.screen.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "desk " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "passportscan",
  means: "Three check-in kiosks: the one under the pointer tilts its screen up and slides out a boarding pass; its neighbours wake a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[140, 135], [201, 166], [262, 196], null],
  mount,
});
