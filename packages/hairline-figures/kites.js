/**
 * Kites: three diamond kites on strings, tied to stakes in a patch of grass.
 * Each kite drifts toward the side the pointer is on, on its own spring, and
 * the kite nearest the pointer climbs highest and is bright. At rest they fly
 * at three heights, leaning a little, the middle one bright. The slider is
 * how far they drift.
 *
 * The pattern: a continuous drift (terrain's spring) per kite; the pick is by
 * each kite's rest x on screen, which never moves.
 */
const {
  Cam, fit, fillet, poly, prism, proj, rings, seg, open, clamp, lerp, spring, stepS, facing,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const K = [{ x: -26, y: 14, h: 62, d: -8 }, { x: 0, y: 0, h: 80, d: 4 }, { x: 26, y: -14, h: 66, d: 10 }];
const FAV = 1, CLIMB = 16, DRIFT = 22;
const E = [Math.SQRT1_2, -Math.SQRT1_2]; // screen-right on the ground

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.75);
  const ext = [[-44, -44, 0], [44, 44, 0], [44, -44, 0], [-44, 44, 0]];
  for (const k of K) for (const s of [-1, 1]) ext.push([k.x + E[0] * s * (DRIFT + 14), k.y + E[1] * s * (DRIFT + 14), k.h + CLIMB + 14]);
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-40, -40, 40, 40, 14, 2);
  put(solid(g), prism(P, front, gr, gi, 0, 2.4));
  const tufts = [];
  for (const [x, y] of [[-30, 2], [-12, 26], [10, -30], [24, 20], [-4, -14], [30, -2]]) for (const dx of [-1.6, 0, 1.6]) tufts.push(seg(P(x, y, 2.4), P(x + dx, y + dx * 0.3, 6 - Math.abs(dx))));
  mk("path", { class: "lo nf", d: tufts.join("") }, g);

  const kites = K.map((k, i) => {
    const grp = mk("g", {}, g);
    place(flatDot(grp, C, 1.4, "dot off"), P(k.x, k.y, 2.4));
    return { i, ...k, line: mk("path", { class: "lo nf" }, grp), tail: mk("path", { class: "lo nf" }, grp), body: mk("path", {}, grp), spar: mk("path", { class: "lo nf" }, grp),
      sx: spring(k.d * amp), sh: spring(k.h + (i === FAV ? 6 : 0)), last: "" };
  });

  function draw(kt) {
    const key = kt.sx.x.toFixed(3) + "," + kt.sh.x.toFixed(3);
    if (key === kt.last) return;
    kt.last = key;
    const lean = clamp(kt.sx.x / 60, -0.4, 0.4);
    const at = (u, w) => P(kt.x + E[0] * (kt.sx.x + u + w * lean), kt.y + E[1] * (kt.sx.x + u + w * lean), kt.sh.x + w);
    const pts = [at(0, 14), at(10, 3), at(0, -16), at(-10, 3)];
    kt.body.setAttribute("d", poly(fillet(pts, [1.5, 1.5, 1.5, 1.5])));
    kt.spar.setAttribute("d", seg(at(0, 13), at(0, -15)) + seg(at(-9, 3), at(9, 3)));
    const a = P(kt.x, kt.y, 2.4), b = at(0, -16), sag = [];
    for (let t = 0; t <= 1.0001; t += 0.125) sag.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t) + 10 * t * (1 - t)]);
    kt.line.setAttribute("d", open(sag));
    const tail = [];
    for (let j = 0; j <= 6; j++) tail.push(at((j % 2 ? 2.4 : -2.4) - j * lean * 3, -16 - j * 3.5));
    kt.tail.setAttribute("d", open(tail));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const kt of kites) { if (stepS(kt.sx, dt)) m = true; if (stepS(kt.sh, dt)) m = true; draw(kt); }
    return m;
  });
  bag.add(B.unregister);

  const xs = kites.map((kt) => P(kt.x, kt.y, kt.h)[0]), mid = P(0, 0, 0)[0];
  let over = null;
  function retarget() {
    let near = -1;
    if (over) { let bd = Infinity; xs.forEach((x, i) => { const d = Math.abs(x - over[0]); if (d < bd) { bd = d; near = i; } }); }
    for (const kt of kites) {
      kt.sx.t = over ? clamp((over[0] - mid) / 90, -1, 1) * DRIFT * amp : kt.d * amp;
      kt.sh.t = kt.h + (over ? (kt.i === near ? CLIMB : 0) : kt.i === FAV ? 6 : 0);
      kt.body.classList.toggle("hi", kt.i === (over ? near : FAV));
      kt.body.classList.toggle("sil", true);
    }
    read.textContent = over ? "kite " + (near + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = Math.abs(p[0] - mid) < 150 ? p : null; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "kites",
  means: "Three kites tied in a grass patch: they drift toward the pointer's side, and the nearest climbs highest and is bright.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.4],
  tour: [[151, 119], [200, 105], [249, 128], null],
  mount,
});
