/**
 * Star wheel: a planisphere, a star disc turning in its square holder. The
 * pointer turns the sky: the disc follows the pointer's angle round its pin on
 * a spring, carrying its constellations past the holder's index. At rest the
 * disc sits a little off the hour, its rim bright. The slider is how much of
 * the pointer's turn the disc takes.
 */
const {
  Cam, circ, fit, prism, proj, rings, facing, open, seg, unproj, clamp,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 44, REST = 0.5;
const STARS = [[30, 0.3], [24, 0.7], [33, 1.0], [18, 1.3], [28, 1.9], [36, 2.3], [22, 2.6], [31, 3.1], [14, 3.5], [27, 3.9], [35, 4.3], [20, 4.8], [30, 5.3], [16, 5.8], [8, 0.9], [9, 4.1]];
const LINES = [[0, 1, 2, 4, 3, 1], [5, 6, 7, 5], [9, 10, 11, 8, 9], [12, 13, 0], [14, 3, 6], [15, 11, 12], [8, 15, 14, 2], [1, 6, 10], [4, 7, 13]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-56, -56, 0], [56, 56, 0], [-56, 56, 0], [56, -56, 0], [0, 0, 8]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, rings(-56, -56, 56, 56, 9, 2)[0], null, 0, 4));
  const disc = solid(g);
  put(disc, prism(P, front, circ(R, 96), null, 4, 6.5));
  disc.sil.classList.add("hi");
  const lines = mk("path", { class: "nf lo", d: "" }, g);
  const ticks = mk("path", { class: "nf lo", d: "" }, g);
  const dots = STARS.map((s, i) => flatDot(g, C, i % 3 ? 1.1 : 1.6, i % 3 ? "dot off" : "dot m"));
  put(solid(g), prism(P, front, circ(2.2, 16), null, 6.5, 9));
  // the index: a fixed tab on the holder pointing at the rim
  const tab = solid(g);
  put(tab, prism(P, front, ...rings(R + 2, -3, R + 9, 3, 1.2, 0.6), 4, 5.5));

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const at = (r, b) => P(r * Math.cos(b + a), r * Math.sin(b + a), 6.5);
    let d = "";
    for (const L of LINES) d += open(L.map((i) => at(STARS[i][0], STARS[i][1])));
    lines.setAttribute("d", d);
    let t = "";
    for (let k = 0; k < 36; k++) { const b = (k / 36) * Math.PI * 2; t += seg(at(R - 2.6, b), at(R - (k % 6 ? 5 : 8), b)); }
    ticks.setAttribute("d", t);
    STARS.forEach((s, i) => place(dots[i], at(s[0], s[1])));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const hour = (a) => { const h = Math.round((((-a / (Math.PI * 2)) * 24) % 24 + 24) % 24); return (h < 10 ? "0" : "") + h + "h"; };
  let over = null;
  function aim() {
    if (!over) { sp.t = REST; read.textContent = "rest"; }
    else {
      let want = REST + Math.atan2(over[1], over[0]) * 1.6 * value;
      sp.t = want;
      read.textContent = hour(want);
    }
    tab.sil.classList.toggle("hi", !!over);
    disc.sil.classList.toggle("hi", !over);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); over = Math.hypot(x, y) < 70 && Math.hypot(x, y) > 4 ? [x, y] : null; aim(); },
    leave: () => { over = null; aim(); },
  }));
  bag.add(() => svg.replaceChildren());
  aim();
  return { set: (v) => { value = v; aim(); }, destroy: bag.dispose };
}

hairline({
  name: "planisphere",
  means: "A star wheel in its holder: the disc turns to follow the pointer round its pin, carrying its constellations past the index.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[142, 180], [262, 140], [200, 230], null],
  mount,
});
