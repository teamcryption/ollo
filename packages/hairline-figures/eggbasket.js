/**
 * Egg basket: a round wire basket of eggs with a hoop handle pivoting on
 * its rim. The pointer's height over the stage swings the handle forward
 * over the eggs or back behind them, and the basket rocks a little with
 * it. At rest the handle leans back, bright. The slider is the swing.
 *
 * The pattern: one part answering the pointer's position (spring).
 */
const { Cam, fit, hull, poly, open, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const R = 24, RB = 19, H = 22, HH = 32, TH = 2.2, S2 = Math.SQRT1_2;
const EGGS = [[-9, -6], [3, -9], [12, -1], [-2, 2], [-13, 4]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.5);
  // local (a, b, z): a runs across the screen, b toward the viewer
  const W = (a, b, z, phi) => {
    const c = Math.cos(phi), s = Math.sin(phi);
    const b2 = b * c + z * s, z2 = z * c - b * s;
    return [(a + b2) * S2, (b2 - a) * S2, z2];
  };
  const ring = (r, z, n, ca = 0, cb = 0) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [ca + r * Math.cos(t), cb + r * Math.sin(t), z]; });
  const hoop = (th) => {
    const out = [], inn = [], c = Math.cos(th), s = Math.sin(th);
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI;
      out.push([(R + 1) * Math.cos(t), (HH) * Math.sin(t) * s, H + HH * Math.sin(t) * c]);
      inn.push([(R + 1 - TH) * Math.cos(t), (HH - TH) * Math.sin(t) * s, H + (HH - TH) * Math.sin(t) * c]);
    }
    return out.concat(inn.reverse());
  };
  const ext = [];
  for (const th of [-1.5, 0, 1.5]) for (const q of hoop(th).concat(ring(R, H, 16), ring(RB, 0, 16))) ext.push(W(...q, th * 0.1));
  fit(C, ext, 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const pr = (pts, phi) => pts.map((q) => P(...W(...q, phi)));

  const body = mk("path", { class: "sil" }, g);
  const back = mk("g", {}, g);
  const mouth = mk("path", { class: "lo nf" }, g);
  const eggs = EGGS.map(() => mk("path", {}, g));
  const front = mk("path", { class: "sil" }, g);
  const wires = mk("path", { class: "lo nf" }, g);
  const fore = mk("g", {}, g);
  const handle = mk("path", { class: "sil hi" }, g);
  const lugs = mk("path", {}, g);

  const half = (r, z, n) => Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * Math.PI; return [r * Math.cos(t), r * Math.sin(t), z]; });
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const phi = th * 0.1;
    body.setAttribute("d", poly(hull(pr(ring(R, H, 40).concat(ring(RB, 0, 40)), phi))));
    mouth.setAttribute("d", poly(pr(ring(R - 1.2, H, 40), phi)));
    EGGS.forEach(([ea, eb], i) => {
      const pts = ring(4.6, H - 4, 14, ea, eb).concat(ring(5, H - 1, 14, ea, eb), ring(3.6, H + 2.5, 14, ea, eb), ring(1.4, H + 4, 10, ea, eb));
      eggs[i].setAttribute("d", poly(hull(pr(pts, phi))));
    });
    const top = half(R, H, 30), bot = half(RB, 0, 30).reverse();
    front.setAttribute("d", poly(pr(top.concat(bot), phi)));
    let w = "";
    for (const f of [0.3, 0.55, 0.8]) w += open(pr(half(RB + (R - RB) * f, H * f, 30), phi));
    for (let k = 1; k < 8; k++) { const t = (k / 8) * Math.PI; w += open(pr([[RB * Math.cos(t), RB * Math.sin(t), 0], [R * Math.cos(t), R * Math.sin(t), H]], phi)); }
    wires.setAttribute("d", w);
    handle.setAttribute("d", poly(pr(hoop(th), phi)));
    let l = "";
    for (const sx of [-1, 1]) l += poly(hull(pr(ring(2.4, H - 3, 10, sx * (R + 1), 0).concat(ring(2.4, H + 1, 10, sx * (R + 1), 0)), phi)));
    lugs.setAttribute("d", l);
    (th < 0 ? back : fore).append(handle);
  }

  const REST = rad(-22), sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const cy = P(0, 0, H)[1];
  bag.add(pointer(stage, {
    move: ([, sy]) => {
      const f = clamp((sy - cy) / 70, -1, 1), th = f * rad(max);
      sp.t = th;
      const d = Math.round(Math.abs(th) * 180 / Math.PI);
      read.textContent = d < 3 ? "up" : (th > 0 ? "fwd " : "back ") + d + "°";
      B.wake();
    },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  draw(REST);
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "eggbasket",
  means: "A wire basket of eggs: the pointer swings its hoop handle forward over the eggs or back behind them, and the basket rocks along.",
  rules: [1, 3, 5, 8],
  range: [40, 70, 85],
  tour: [[200, 227], [200, 60], [200, 140], null],
  mount,
});
