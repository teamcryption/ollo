/**
 * Rug hook: a rug hooking frame, the stretched canvas on a square frame
 * that pivots between two uprights on a floor stand. Over the figure the
 * frame tilts up toward the hooker; at rest it lies low, the bright patch of
 * hooked loops on it. The slider is how far it tilts.
 */
const { Cam, fit, proj, poly, clamp, rad, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const AZ = 44, W = 30, REST = 12;
const FACES = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 4, 6, 2], [1, 3, 7, 5], [0, 1, 5, 4], [2, 6, 7, 3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-34, -38, 0], [34, 38, 0], [34, -38, 0], [-34, 38, 0], [-12, 0, AZ + 34], [12, 0, AZ + 34], [W, 0, AZ - 10]], 200, 165);
  const P = proj(C);
  const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
  const up = Math.sign(area([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map((p) => P(...p))));
  function box(x0, x1, y0, y1, z0, z1, f = (p) => p) {
    const c = [];
    for (let k = 0; k < 8; k++) c.push(P(...f([k & 1 ? x1 : x0, k & 2 ? y1 : y0, k & 4 ? z1 : z0])));
    return FACES.map((fc) => fc.map((i) => c[i])).filter((q) => Math.sign(area(q)) === up).map(poly).join("");
  }
  const g = mk("g", {}, svg);
  mk("path", { d: box(-34, 34, -38, -30, 0, 4) }, g);
  mk("path", { d: box(-3, 3, -36, -32, 4, AZ + 3) }, g);
  mk("path", { d: box(-3, 3, -32, 32, 0, 3) }, g);
  const frame = mk("path", {}, g), canvas = mk("path", { class: "nf lo" }, g), patch = mk("path", { class: "hi" }, g);
  mk("path", { d: box(-34, 34, 30, 38, 0, 4) }, g);
  mk("path", { d: box(-3, 3, 32, 36, 4, AZ + 3) }, g);
  const t = tween(0);

  function draw(f) {
    const th = rad(REST + f * reach), c = Math.cos(th), s = Math.sin(th);
    const tf = ([u, v, n]) => [u * c - n * s, v, AZ + u * s + n * c];
    frame.setAttribute("d", box(-W, W, -W, W, 0, 3, tf));
    const sq = (a, b, e, h) => poly([[a, e, 3.1], [b, e, 3.1], [b, h, 3.1], [a, h, 3.1]].map((p) => P(...tf(p))));
    canvas.setAttribute("d", sq(-W + 5, W - 5, -W + 5, W - 5));
    patch.setAttribute("d", sq(-6, 14, -12, 8));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const a = P(-34, 38, 0), b = P(34, -38, 0), top = P(0, 0, AZ + 34);
  const hit = ([sx, sy]) => sx > Math.min(a[0], b[0]) - 10 && sx < Math.max(a[0], b[0]) + 10 && sy > top[1] - 30 && sy < Math.max(a[1], b[1]) + 20;
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(t, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "up " + Math.round(REST + reach) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 30, 60); draw(tval(t, performance.now())); }, destroy: bag.dispose };
}

hairline({
  name: "tapestry",
  means: "A rug hooking frame on its stand: under the pointer the canvas frame tilts up on its pivots toward the hooker.",
  rules: [1, 3, 5],
  range: [30, 50, 60],
  tour: [[230, 138], [200, 170], [170, 120], null],
  mount,
});
