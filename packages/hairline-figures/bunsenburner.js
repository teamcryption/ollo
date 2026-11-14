/**
 * Bunsen burner: a burner on a square foot, its tube rising through an air
 * collar to a flame. The pointer's side-to-side position turns the collar,
 * sliding its air hole round: more air, and the flame shrinks to a tight
 * cone; less, and it stands tall and lazy. At rest the collar is part open
 * and the flame is the bright mark. The slider is the flame's full height.
 *
 * The pattern: one continuous dial (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TR = 5, TZ = 62, CR = 6.8, REST = 0.2;
const disc = (r, n = 32) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxH = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-26, -26, 0], [26, 26, 0], [26, -26, 0], [-26, 26, 0], [0, 0, TZ + 44]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-26, -26, 26, 26, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  // the foot's boss and the gas inlet stub, nearest corner kept clear
  put(solid(g), prism(P, front, disc(9), disc(7.5), 4, 8));
  const inlet = rings(-24, -2.6, -8, 2.6, 2.6, 0.8);
  put(solid(g), prism(P, front, inlet[0], inlet[1], 7, 11.5));
  put(solid(g), prism(P, front, disc(TR), disc(TR - 1.2), 8, TZ));
  put(solid(g), prism(P, front, disc(CR), disc(CR - 1.4), 14, 24));
  const hole = mk("path", { class: "nf" }, g);
  const flame = mk("path", { class: "sil hi" }, g), cone = mk("path", { class: "nf lo" }, g);

  const a = spring(REST);
  let last = NaN, lastH = NaN;
  function draw(v) {
    if (v === last && maxH === lastH) return;
    last = v; lastH = maxH;
    // the air hole: a slot on the collar, swung round by the air setting
    const th = lerp(-2.2, 1.2, v), w = 0.28 + 0.32 * v, pts = [];
    const facingHole = Math.cos(th - Math.PI / 4) > 0.15;
    for (let i = 0; i <= 6; i++) { const t = th - w + (2 * w * i) / 6; pts.push(P(CR * Math.cos(t), CR * Math.sin(t), 16.5)); }
    for (let i = 6; i >= 0; i--) { const t = th - w + (2 * w * i) / 6; pts.push(P(CR * Math.cos(t), CR * Math.sin(t), 21.5)); }
    hole.setAttribute("d", facingHole ? poly(pts) : "");
    const h = lerp(maxH, maxH * 0.42, v), r = lerp(6.2, 4, v), ch = lerp(0.18, 0.55, v) * h;
    const f = [];
    f.push(...ringAt(P, disc(r * 0.85, 24), TZ + 0.5), ...ringAt(P, disc(r, 24), TZ + h * 0.22), ...ringAt(P, disc(r * 0.7, 24), TZ + h * 0.55));
    f.push(P(0, 0, TZ + h), P(lerp(1.6, 0.3, v), lerp(-1.6, -0.3, v), TZ + h * 0.92));
    flame.setAttribute("d", poly(hull(f)));
    const c = ringAt(P, disc(r * 0.55, 20), TZ + 0.8).concat([P(0, 0, TZ + ch)]);
    cone.setAttribute("d", poly(hull(c)));
  }

  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);
  function setAir(t) { a.t = t; read.textContent = t === REST && idle ? "rest" : "air " + Math.round(t * 100) + "%"; B.wake(); }
  let idle = true;
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: (p) => { idle = false; setAir(clamp((p[0] - 120) / 160, 0, 1)); },
    leave: () => { idle = true; setAir(REST); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxH = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bunsenburner",
  means: "A burner whose air collar turns with the pointer: open it and the flame tightens to a short cone, close it and it stands tall.",
  rules: [3, 5, 8, 9],
  range: [24, 38, 44],
  tour: [[298, 171], [102, 171], [200, 91], null],
  mount,
});
