/**
 * Stage lights: five PAR cans hung from a square truss between two towers.
 * The pointer picks a can: it tips down toward the front, and the wave runs
 * out to its neighbours, smaller each step. At rest the cans hang at uneven
 * angles with the second one bright. The slider is how far the picked can tips.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, seg, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const XS = [-44, -22, 0, 22, 44], Z = 92, TZ = 100, LEN = 22, RB = 7, RF = 10.5;
const RESTP = [18, 34, 8, 26, 14], REST = 1, FALL = [1, 0.5, 0.2, 0.08, 0.04];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-70, -6, 0], [70, 6, 0], [-70, -6, 112], [70, 6, 112], [-44, 30, 60], [44, 30, 60]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tower = (x) => { const [r, i] = rings(x - 5, -5, x + 5, 5, 1.5, 0.8); const s = solid(g); put(s, prism(P, front, r, i, 0, 112)); return s; };
  tower(-64);
  const [tr, ti] = rings(-59, -5, 59, 5, 1.5, 0.8);
  put(solid(g), prism(P, front, tr, ti, TZ, TZ + 10));
  let lace = "";
  for (let x = -55; x < 55; x += 10) lace += seg(P(x, 5, TZ + 1), P(x + 5, 5, TZ + 9)) + seg(P(x + 5, 5, TZ + 9), P(x + 10, 5, TZ + 1));
  mk("path", { class: "nf lo", d: lace }, g);
  const cans = XS.map((x, i) => {
    const yoke = mk("path", { class: "nf sil" }, g), body = mk("path", { class: "sil" }, g), lens = mk("path", { class: "nf lo" }, g);
    return { i, x, yoke, body, lens, tw: tween(RESTP[i]), last: NaN };
  });
  const t2 = tower(64);
  let tip = value, sel = REST, over = false;

  function drawCan(c, deg) {
    if (deg === c.last) return;
    c.last = deg;
    const p = (deg * Math.PI) / 180, d = [0, Math.sin(p), -Math.cos(p)], u = [1, 0, 0], v = [0, Math.cos(p), Math.sin(p)];
    const ring = (off, r) => Array.from({ length: 24 }, (_, k) => {
      const t = (k / 24) * Math.PI * 2, q = (j) => [c.x, 0, Z][j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const back = ring(-2, RB), lensRing = ring(LEN, RF);
    c.body.setAttribute("d", poly(hull(back.concat(lensRing))));
    c.lens.setAttribute("d", poly(ring(LEN, RF - 2)));
    c.yoke.setAttribute("d", seg(P(c.x - RB - 2, 0, Z), P(c.x - RB - 2, 0, TZ)) + seg(P(c.x + RB + 2, 0, Z), P(c.x + RB + 2, 0, TZ)) + seg(P(c.x - RB - 2, 0, Z), P(c.x + RB + 2, 0, Z)));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const c of cans) { drawCan(c, tval(c.tw, now)); if (!tdone(c.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function choose(a) {
    sel = a;
    const now = performance.now(), top = 40 + 30 * tip;
    cans.forEach((c) => {
      const k = Math.abs(c.i - a), to = over ? RESTP[c.i] + (top - RESTP[c.i]) * FALL[k] : RESTP[c.i];
      tset(c.tw, Math.round(to * 10) / 10, now, k * 45);
      c.body.classList.toggle("hi", c.i === a);
    });
    read.textContent = over ? `can ${a + 1}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      let best = 0, bd = Infinity;
      cans.forEach((c) => { const d = Math.abs(P(c.x, 0, Z)[0] - p[0]); if (d < bd) { bd = d; best = c.i; } });
      over = bd < 40; choose(over ? best : REST);
    },
    leave: () => { over = false; choose(REST); },
  }));
  bag.add(() => svg.replaceChildren());
  choose(REST);
  return { set: (v) => { tip = v; if (over) choose(sel); }, destroy: bag.dispose };
}

hairline({
  name: "stagelight",
  means: "Five PAR cans on a truss: the one under the pointer tips down to the front and the tilt ripples out to its neighbours.",
  rules: [1, 2, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[182, 170], [129, 144], [235, 197], null],
  mount,
});
