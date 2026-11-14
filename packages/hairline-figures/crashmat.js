/**
 * Gym mats: a stack of six folded mats, each a little off square from the
 * one beneath, with its fold seams down the front. The pointer picks a mat
 * by height: it slides out toward the reader and the mats beside it ease out
 * a little, staggered from it. At rest one mat sits half pulled, bright.
 * The slider is the stagger.
 */
const {
  Cam, fit, prism, proj, facing, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, L = 64, D = 38, T = 7, OUT = 16, FAV = 3;
const OFF = [[0, 0], [3, -2], [-2, 1], [2, 2], [-3, -1], [1, -3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-4, -4, 0], [L + 4, D + OUT + 4, 0], [L + 4, -4, 0], [-4, D + OUT, 0], [0, 0, N * T], [L, D + OUT, N * T]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const mats = OFF.map(([ox, oy], k) => {
    const el = solid(g), seams = mk("path", { class: "nf lo" }, el.g);
    return { k, ox, oy, el, seams, y: tween(k === FAV ? 7 : 0), last: "" };
  });

  function draw(m, y) {
    const key = y.toFixed(2);
    if (key === m.last) return false;
    m.last = key;
    const x0 = m.ox, y0 = m.oy + y, z0 = m.k * T, z1 = z0 + T - 0.6;
    const [r, i] = rings(x0, y0, x0 + L, y0 + D, 3, 1.2);
    put(m.el, prism(P, front, r, i, z0, z1));
    let d = "";
    for (const f of [1, 2]) {
      const x = x0 + (L * f) / 3;
      d += seg(P(x, y0 + D, z0 + 1), P(x, y0 + D, z1 - 1)) + seg(P(x + D * 0, y0 + 2, z1), P(x, y0 + D - 2, z1));
    }
    m.seams.setAttribute("d", d);
    return true;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const m of mats) { draw(m, tval(m.y, now)); if (!tdone(m.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The mat whose resting front middle is nearest the pointer's y on screen. */
  const mids = mats.map((m) => P(m.ox + L / 2, m.oy + D, m.k * T + T / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((p, k) => { const d = Math.abs(p[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 14 && Math.abs(mids[best][0] - sx) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    mats.forEach((m, k) => {
      const d = Math.abs(k - a);
      const y = a < 0 ? (k === FAV ? 7 : 0) : d === 0 ? OUT : d === 1 ? 4 : 0;
      tset(m.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      m.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "mat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "crashmat",
  means: "Six folded gym mats in a stack: the one under the pointer slides out, and its neighbours ease out in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[175, 201], [206, 171], [186, 149], null],
  mount,
});
