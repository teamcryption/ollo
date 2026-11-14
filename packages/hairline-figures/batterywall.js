/**
 * Battery wall: four home-battery packs standing side by side against a wall
 * plate, each with a status light and a handle seam. The pointer picks a pack
 * by where it is along the row: that pack slides out from the wall, the
 * others ease forward a little, staggered from it. At rest the packs sit at
 * uneven depths, one pulled out and bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest rest
 * centre by screen x.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 14, W = 11, D = 9, H = 44, SLIDE = 14, BUMP = 4;
const X1 = (N - 1) * STEP + W;
const REST = [1, 6, 0, 2.5], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-5, -5, 0], [X1 + 5, -5, 0], [-5, D + SLIDE, 0], [X1 + 5, D + SLIDE, 0], [-5, -5, H + 10], [X1 + 5, -5, H + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the wall plate the packs hang against
  const wall = solid(g);
  const [wr, wi] = rings(-5, -5, X1 + 5, -2, 1.4, 0.6);
  put(wall, prism(P, front, wr, wi, 0, H + 10));

  const packs = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    packs.push({ k, x: k * STEP, s, seam: mk("path", { class: "nf lo" }, s.g), led: mk("circle", { class: "dot off", r: 1.6 }, s.g), y: tween(REST[k]), last: NaN });
  }

  function draw(p, y) {
    if (y === p.last) return;
    p.last = y;
    const [r, i] = rings(p.x, y, p.x + W, y + D, 3, 1.2);
    put(p.s, prism(P, front, r, i, 0, H));
    const fy = y + D;
    p.seam.setAttribute("d", seg(P(p.x + 2.5, fy, H - 9), P(p.x + W - 2.5, fy, H - 9)) + seg(P(p.x + 2.5, fy, 6), P(p.x + W - 2.5, fy, 6)));
    place(p.led, P(p.x + W / 2, fy, H - 5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    packs.forEach((p) => { draw(p, tval(p.y, now)); if (!tdone(p.y, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest pack by its rest centre's screen x, inside the row's box
  const cx = packs.map((p) => P(p.x + W / 2, D / 2, H / 2)[0]);
  const top = P(0, -5, H + 10)[1], bot = P(X1, D + 4, 0)[1];
  function hit([sx, sy]) {
    if (sy < top - 6 || sy > bot + 10) return -1;
    let best = -1, bd = 1e9;
    cx.forEach((c, k) => { const d = Math.abs(sx - c); if (d < bd) { bd = d; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    packs.forEach((p, k) => {
      const y = a < 0 ? REST[k] : k === a ? SLIDE : clamp(BUMP - Math.abs(k - a) * 1.5, 0, BUMP);
      tset(p.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      p.s.sil.classList.toggle("hi", on);
      p.led.setAttribute("class", on ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "pack " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "batterywall",
  means: "A home battery wall: the pack under the pointer slides out from the wall, the others ease forward after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 160], [212, 166], [248, 172], null],
  mount,
});
