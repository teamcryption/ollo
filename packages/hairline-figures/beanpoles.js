/**
 * Bean poles: five tall canes standing in a raised bed, a bean vine wound up
 * each one. The pointer picks a pole by where it stands: its vine climbs to
 * the top, and the vines beside it climb a little, staggered from it. At rest
 * the vines stand at uneven heights and one pole is bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 22, H = 92, CZ = 6, VR = 3.2, TURN = 13, FAV = 3;
const REST = [26, 44, 14, 58, 34];
const X1 = (N - 1) * STEP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-10, -12, 0], [X1 + 10, 12, 0], [X1 + 10, -12, 0], [-10, 12, 0], [0, 0, CZ + H + 2], [X1, 0, CZ + H + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-10, -12, X1 + 10, 12, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    const back = mk("path", { class: "nf lo" }, grp);
    const pole = solid(grp);
    const [pr, pi] = rings(x - 1.6, y - 1.6, x + 1.6, y + 1.6, 1.2, 0.5);
    put(pole, prism(P, front, pr, pi, CZ, CZ + H - (k % 2) * 6));
    const fr = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, back, fr, pole, h: tween(k === FAV ? 0 : REST[k]), last: NaN });
  }

  // the vine: a helix round the pole, split into the runs behind and in front of it
  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    let bd = "", fd = "", run = [], side = null;
    const steps = Math.max(2, Math.round(h / 1.2)), ph = it.k * 1.3;
    for (let i = 0; i <= steps; i++) {
      const z = (h * i) / steps, a = ph + (z / TURN) * Math.PI * 2;
      const nu = Math.cos(a), nv = Math.sin(a), f = front({ u: nu, v: nv, nu, nv });
      const pt = P(it.x + VR * nu, it.y + VR * nv, CZ + z);
      if (side !== null && f !== side) {
        run.push(pt);
        if (run.length > 1) { if (side) fd += open(run); else bd += open(run); }
        run = [];
      }
      side = f;
      run.push(pt);
      if (i % 6 === 3) {
        const lf = poly([pt, P(it.x + (VR + 7) * nu, it.y + (VR + 7) * nv, CZ + z + 4), P(it.x + (VR + 4) * nu, it.y + (VR + 4) * nv, CZ + z - 1)]);
        if (f) fd += lf; else bd += lf;
      }
    }
    if (run.length > 1) { if (side) fd += open(run); else bd += open(run); }
    it.back.setAttribute("d", bd || "M0 0");
    it.fr.setAttribute("d", fd || "M0 0");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.h, now)); if (!tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), top = H - (k % 2) * 6 - 4;
      const h = a < 0 ? REST[k] : dd === 0 ? top : dd === 1 ? Math.min(top, REST[k] + 14) : REST[k];
      tset(it.h, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.pole.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pole " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beanpoles",
  means: "Five bean poles in a raised bed: the vine on the pole under the pointer climbs to the top, its neighbours climb a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 158], [264, 190], [136, 126], null],
  mount,
});
