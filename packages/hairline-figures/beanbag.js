/**
 * Book cart: a library cart on four wheels, two shelves of books between end
 * panels, a push handle at one end. The pointer is where it is wheeled: the
 * cart rolls along its length on a spring to sit under it, the wheels turning
 * as it goes, and the handle is bright. At rest it stands a little off
 * centre, the top shelf's rim bright. The slider is how far it may roll.
 */
const {
  Cam, fit, prism, proj, rings, facing, seg, spring, stepS, clamp, r2,
  disposer, mk, pointer, put, register, solid, unproj, flatDot, place,
} = HL;

const L = 64, Wd = 20, SPAN = 22, REST = -8, WR = 4.5;
const LOW = [[4, 13, 3], [8.5, 16, -6], [12, 11, 0], [20, 15, 4], [24, 12, 0], [36, 16, 0], [41, 13, 8]];
const HIGH = [[6, 15, 0], [10, 12, 0], [14, 17, -5], [28, 14, 0], [32, 16, 0], [36, 11, 0], [48, 15, 10]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-SPAN, 0, 0], [L + SPAN, Wd, 0], [-SPAN, 0, 58], [L + SPAN + 6, Wd, 58], [-SPAN, Wd, 0], [L + SPAN, 0, 58]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheels = [];
  for (const [x, y] of [[6, 2], [L - 6, 2], [6, Wd - 2], [L - 6, Wd - 2]]) {
    const w = mk("g", {}, g);
    put(solid(w), prism(P, front, rings(x - WR, y - 1, x + WR, y + 1, 0.9, 0.3)[0], null, 0, 0.01));
    const disc = mk("path", { class: "sil", d: "" }, w);
    wheels.push({ x, y, disc, spoke: mk("path", { class: "nf lo", d: "" }, w) });
  }
  put(solid(g), prism(P, front, ...rings(0, 0, 2.5, Wd, 1, 0.5), WR + 2, 52));
  const shelf = (z) => { const s = solid(g); put(s, prism(P, front, ...rings(0, 0, L, Wd, 2.5, 1.2), z, z + 2.5)); return s; };
  const book = (x, z, [x0, h, lean]) => {
    const t = lean * 0.15;
    put(solid(g), prism(P, front, ...rings(x0 + t, 3, x0 + t + (x || 3.6), Wd - 3, 0.8, 0.4), z, z + h));
  };
  shelf(WR + 4);
  for (const b of LOW) book(3.6, WR + 6.5, b);
  const top = shelf(32);
  for (const b of HIGH) book(3.6, 34.5, b);
  put(solid(g), prism(P, front, ...rings(L - 2.5, 0, L, Wd, 1, 0.5), WR + 2, 52));
  const handle = solid(g);
  put(handle, prism(P, front, ...rings(L + 2, 2, L + 5, Wd - 2, 1.4, 0.5), 46, 50));
  const pos = spring(REST);
  const ux = P(1, 0, 0), o = P(0, 0, 0), dx = [ux[0] - o[0], ux[1] - o[1]];
  let drawn = NaN;

  function draw() {
    if (Math.abs(pos.x - drawn) < 1e-3) return;
    drawn = pos.x;
    g.setAttribute("transform", "translate(" + r2(dx[0] * pos.x) + " " + r2(dx[1] * pos.x) + ")");
    const turn = pos.x / WR;
    for (const w of wheels) {
      let d = "";
      for (let k = 0; k <= 24; k++) { const a = (k / 24) * Math.PI * 2; d += (k ? "L" : "M") + P(w.x + WR * Math.cos(a), w.y, WR + WR * Math.sin(a)).map(r2).join(" "); }
      w.disc.setAttribute("d", d + "Z");
      const c = P(w.x, w.y, WR);
      w.spoke.setAttribute("d", seg(c, P(w.x + WR * 0.8 * Math.cos(turn), w.y, WR + WR * 0.8 * Math.sin(turn))) + seg(c, P(w.x - WR * 0.8 * Math.cos(turn), w.y, WR - WR * 0.8 * Math.sin(turn))));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(on, x) {
    pos.t = on ? clamp(x - L / 2, -SPAN * value, SPAN * value) : REST;
    handle.sil.classList.toggle("hi", on);
    top.sil.classList.toggle("hi", !on);
    read.textContent = on ? (pos.t >= 0 ? "+" : "") + Math.round(pos.t) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      set(x > -SPAN - 10 && x < L + SPAN + 10 && y > -30 && y < Wd + 30, x);
    },
    leave: () => set(false, 0),
  }));
  bag.add(() => svg.replaceChildren());
  set(false, 0);
  draw();
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "beanbag",
  means: "A library book cart: it rolls along its length to sit under the pointer, wheels turning, and its handle is bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[117, 195], [200, 236], [295, 284], null],
  mount,
});
