/**
 * Bass pedal: a kick-drum pedal on its base plate, the footboard hinged at
 * the heel, a chain over the cam to the beater between two posts. Over the
 * figure the footboard presses down and the bright beater swings forward to
 * strike. The slider is how far the beater swings.
 */
const { Cam, fit, proj, poly, seg, clamp, rad, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const AX = 58, AZ = 62, HZ = 5, LEN = 40;
const FACES = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 4, 6, 2], [1, 3, 7, 5], [0, 1, 5, 4], [2, 6, 7, 3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-6, -16, 0], [66, 16, 0], [66, -16, 0], [-6, 16, 0], [AX - 30, 0, AZ + 40], [AX + 30, 0, AZ + 40]], 200, 165);
  const P = proj(C);
  const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
  const up = Math.sign(area([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map((p) => P(...p))));
  function box(x0, x1, y0, y1, z0, z1, f = (p) => p) {
    const c = [];
    for (let k = 0; k < 8; k++) c.push(P(...f([k & 1 ? x1 : x0, k & 2 ? y1 : y0, k & 4 ? z1 : z0])));
    return FACES.map((fc) => fc.map((i) => c[i])).filter((q) => Math.sign(area(q)) === up).map(poly).join("");
  }
  const g = mk("g", {}, svg);
  mk("path", { d: box(-6, 66, -16, 16, 0, 3) }, g);
  mk("path", { d: box(AX - 5, AX + 5, -14, 14, 3, 8) }, g);
  const board = mk("path", {}, g), chain = mk("path", { class: "nf" }, g);
  mk("path", { d: box(AX - 2, AX + 2, -14, -10, 3, AZ + 4) }, g);
  const rod = mk("path", {}, g), head = mk("path", { class: "hi" }, g);
  mk("path", { d: box(AX - 3, AX + 3, -10, 10, AZ - 3, AZ + 3) }, g);
  mk("path", { d: box(AX - 2, AX + 2, 10, 14, 3, AZ + 4) }, g);
  const t = tween(0);

  function draw(f) {
    const tilt = rad(lerp(16, 3, f)), phi = rad(lerp(-28, -28 + reach, f));
    const bf = ([x, y, z]) => [x * Math.cos(tilt), y, HZ + x * Math.sin(tilt) + z];
    board.setAttribute("d", box(0, 50, -9, 9, 0, 2.4, bf));
    const toe = bf([50, 0, 2.4]);
    chain.setAttribute("d", seg(P(...toe), P(AX + 3, 0, AZ - 4)));
    const rf = ([x, y, z]) => [AX + x * Math.cos(phi) + z * Math.sin(phi), y, AZ - x * Math.sin(phi) + z * Math.cos(phi)];
    rod.setAttribute("d", box(-1, 1, -1, 1, 0, LEN, rf));
    head.setAttribute("d", box(-5, 5, -6, 6, LEN - 4, LEN + 8, rf));
  }
  const lerp = (a, b, k) => a + (b - a) * k;
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const lo = P(-6, 16, 0), hi2 = P(66, -16, AZ + 40);
  const hit = ([sx, sy]) => sx > Math.min(lo[0], hi2[0]) - 20 && sx < Math.max(lo[0], hi2[0]) + 20 && sy > hi2[1] - 20 && sy < lo[1] + 30;
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(t, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "hit " + Math.round(reach) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 30, 70); draw(tval(t, performance.now())); }, destroy: bag.dispose };
}

hairline({
  name: "drumpedal",
  means: "A bass drum pedal: under the pointer the footboard presses down and the beater swings forward to strike.",
  rules: [1, 3, 5],
  range: [30, 60, 70],
  tour: [[196, 216], [200, 150], [240, 110], null],
  mount,
});
