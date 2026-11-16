/**
 * USB hub: a slim hub bar with four ports along its long face and a stick
 * waiting at each one. The pointer picks a port by where it is along the
 * hub: that stick slides home into its port, the sticks beside it edge in
 * after it, staggered by distance. At rest the sticks stand off at uneven
 * gaps, one plugged in and bright. The slider is the stagger.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, L = 76, D = 20, H = 11, X0 = 9, STEP = 18, SW = 10, SL = 26, PL = 9;
const REST = [11, 0, 7, 15], FAV = 1, OUT = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [L, 0, H], [0, D + OUT + PL + SL, 0], [L, D + OUT + PL + SL, H], [0, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [hr, hi] = rings(0, 0, L, D, 5, 1.4);
  const body = solid(g);
  put(body, prism(P, front, hr, hi, 0, H));
  let ports = "", leds = "";
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    ports += poly(rrect(x - 1, 3, x + SW + 1, 8, 0.8, 2).map((q) => P(q.u, D, q.v)));
    leds += seg(P(x + 3, 4, H), P(x + 7, 4, H));
  }
  mk("path", { class: "nf lo", d: ports + leds + seg(P(L, 6, 5.5), P(L, 14, 5.5)) }, body.g);

  const sticks = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    const plug = solid(g), st = solid(g);
    const cap = mk("path", { class: "nf lo" }, st.g);
    sticks.push({ k, x, plug, st, cap, gap: tween(REST[k]), last: NaN });
  }
  function draw(s, gap) {
    if (gap === s.last) return;
    s.last = gap;
    const y0 = D + gap;
    const [pr, pi] = rings(s.x + 1, D - 0.5, s.x + SW - 1, y0 + 1, 0.5, 0.4);
    put(s.plug, gap > 0.4 ? prism(P, front, pr, pi, 3.6, 7.4) : { sil: "", crease: "" });
    const [r, i] = rings(s.x, y0, s.x + SW, y0 + SL, 3, 1);
    put(s.st, prism(P, front, r, i, 1.5, 9.5));
    s.cap.setAttribute("d", seg(P(s.x + 1, y0 + SL - 7, 9.5), P(s.x + SW - 1, y0 + SL - 7, 9.5)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    sticks.forEach((s) => { draw(s, tval(s.gap, now)); if (!tdone(s.gap, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest stick by the screen x of its rest middle, inside the figure's band
  const mids = sticks.map((s) => P(s.x + SW / 2, D + REST[s.k] + SL / 2, 5));
  function hit([sx, sy]) {
    let best = -1, bd = 1e9;
    mids.forEach((m, k) => { const d = Math.hypot(sx - m[0], (sy - m[1]) * 0.6); if (d < bd) { bd = d; best = k; } });
    return bd < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sticks.forEach((s, k) => {
      const v = a < 0 ? REST[k] : k === a ? 0 : clamp(OUT - 6 / Math.abs(k - a), 0, OUT);
      tset(s.gap, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.st.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "port " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "usbhub",
  means: "A four-port USB hub: the stick at the port under the pointer slides home, the sticks beside it edge in after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[143, 150], [223, 182], [251, 204], null],
  mount,
});
