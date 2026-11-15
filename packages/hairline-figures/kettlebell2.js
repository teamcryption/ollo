/**
 * Kettlebell rack: a long shelf on four legs holding five kettlebells of
 * different sizes, each a round body under a loop handle. The pointer picks
 * the bell nearest it along the row; that bell slides forward to the shelf's
 * front edge and its neighbours follow less, staggered by distance. At rest
 * the bells sit unevenly, the middle one bright.
 */
const { Cam, fit, proj, facing, rings, circ, prism, poly, unproj, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const XS = [-40, -20, 0, 20, 40], RS = [5, 6, 7.5, 6.5, 5.5], YR = [-4, -1, 1, -3, 0], TOP = 19, FAV = 2, OUT = 9;
const FALL = [1, 0.45, 0.18, 0.08, 0.04];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-54, -12, 0], [54, 14, 0], [-46, -10, TOP + 20], [46, 14, TOP + 18]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1) => {
    const s = solid(g), r = rings(x0, y0, x1, y1, 0.8, Math.min(1, 0.25 * Math.min(x1 - x0, y1 - y0)));
    put(s, prism(P, front, r[0], r[1], z0, z1));
  };
  box(-50, -10, -46, -6, 0, 16); box(46, -10, 50, -6, 0, 16);
  box(-50, 8, -46, 12, 0, 16); box(46, 8, 50, 12, 0, 16);
  box(-54, -12, 54, 14, 16, TOP);
  const bells = XS.map((x, i) => {
    const bg = mk("g", {}, g);
    return { i, x, R: RS[i], body: solid(bg), handle: mk("path", { class: "sil" }, bg), tw: tween(YR[i]), drawn: NaN };
  });

  function draw(b, now) {
    const y = tval(b.tw, now);
    if (Math.abs(y - b.drawn) < 1e-3) return;
    b.drawn = y;
    const R = b.R, h = TOP + 1.5 * R, mv = (r) => r.map((q) => ({ ...q, u: q.u + b.x, v: q.v + y }));
    put(b.body, prism(P, front, mv(circ(R, 32)), mv(circ(R - 1, 32)), TOP, h));
    const out = [], inn = [];
    for (let k = 0; k <= 12; k++) {
      const t = (k / 12) * Math.PI, c = Math.cos(t), s = Math.sin(t);
      out.push(P(b.x - 0.7 * R * c, y, h - 0.4 + 0.95 * R * s));
      inn.unshift(P(b.x - 0.42 * R * c, y, h - 0.4 + 0.62 * R * s));
    }
    b.handle.setAttribute("d", poly(out.concat(inn)));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const b of bells) { draw(b, now); if (!tdone(b.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function pick(a) {
    const now = performance.now();
    bells.forEach((b) => {
      tset(b.tw, a == null ? YR[b.i] : YR[b.i] + OUT * value * FALL[Math.abs(b.i - a)], now, a == null ? 0 : Math.abs(b.i - a) * 45);
      b.body.sil.classList.toggle("hi", b.i === (a == null ? FAV : a));
    });
    read.textContent = a == null ? "rest" : RS[a] * 2 + " kg";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], TOP);
      if (Math.abs(x) > 62 || Math.abs(y) > 30) return pick(null);
      let a = 0, bd = Infinity;
      bells.forEach((b) => { const d = Math.abs(P(b.x, YR[b.i], TOP)[0] - q[0]); if (d < bd) { bd = d; a = b.i; } });
      pick(a);
    },
    leave: () => pick(null),
  }));
  bag.add(() => svg.replaceChildren());
  pick(null);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "kettlebell2",
  means: "A kettlebell rack: the bell nearest the pointer slides to the shelf's edge, its neighbours follow less, and it is bright.",
  rules: [1, 2, 3, 4, 5],
  range: [0.5, 1, 1.3],
  tour: [[241, 180], [124, 121], [280, 199], null],
  mount,
});
