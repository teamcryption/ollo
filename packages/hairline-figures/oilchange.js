/**
 * Oil drain pan: a car's sump hangs overhead with its drain plug, and a round
 * drain pan sits on the floor below. The pan slides to follow the pointer
 * across the floor, clamped to a reach round the plug; a dashed drip falls
 * from the plug to the floor. At rest the pan waits off to one side and the
 * plug is bright.
 *
 * The pattern: one part following the pointer on the ground (terrain).
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, seg,
} = HL;

const PX = 0, PY = 0, ZS = 58, PR = 22, PH = 7, REACH = 34, RX = 22, RY = -16;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-REACH - PR, -REACH - PR, 0], [REACH + PR, REACH + PR, 0], [REACH + PR, -REACH - PR, 0], [-REACH - PR, REACH + PR, 0], [-34, -22, ZS + 12], [34, 22, ZS + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the sump: a rounded pan bolted under the engine, and the plug under it
  const [sr, si] = rings(-34, -22, 34, 22, 8, 2);
  put(solid(g), prism(P, front, sr, si, ZS, ZS + 12));
  const plug = solid(g);
  put(plug, prism(P, front, disc(PX, PY, 4, 20), disc(PX, PY, 2.5, 20), ZS - 4, ZS));
  const drip = mk("path", { class: "dash" }, g);
  const pan = mk("g", {}, g);
  const sil = mk("path", { class: "sil" }, pan), cr = mk("path", { class: "nf lo" }, pan), oil = mk("path", { class: "nf lo" }, pan);
  const sx = spring(RX), sy = spring(RY);
  let last = "";

  function draw() {
    const x = sx.x, y = sy.x, key = x.toFixed(2) + "," + y.toFixed(2);
    if (key === last) return;
    last = key;
    // a pan that flares: foot ring smaller than the rim
    const foot = disc(x, y, PR - 4), top = disc(x, y, PR), inner = disc(x, y, PR - 2);
    const pts = foot.map((q) => P(q.u, q.v, 0)).concat(top.map((q) => P(q.u, q.v, PH)));
    sil.setAttribute("d", poly(HL.hull(pts)));
    cr.setAttribute("d", poly(inner.map((q) => P(q.u, q.v, PH))));
    oil.setAttribute("d", poly(disc(x, y, PR - 6).map((q) => P(q.u, q.v, PH - 3))));
    const d = Math.hypot(x - PX, y - PY), land = d < PR - 6 ? PH - 3 : d < PR ? PH : 0;
    drip.setAttribute("d", seg(P(PX, PY, ZS - 5), P(PX, PY, land)));
    if (d >= PR - 2 && d < PR + 1) drip.setAttribute("d", seg(P(PX, PY, ZS - 5), P(PX, PY, PH)));
    // the drip shows in front of the pan only when it lands inside it
    if (d < PR) pan.after(drip); else pan.before(drip);
  }

  const B = register(stage, (dt) => {
    const a = stepS(sx, dt), b = stepS(sy, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  function aim(on, wx, wy) {
    const d = Math.hypot(wx, wy), s = d > reach ? reach / d : 1;
    sx.t = on ? clamp(wx * s, -REACH, REACH) : RX;
    sy.t = on ? clamp(wy * s, -REACH, REACH) : RY;
    sil.classList.toggle("hi", on);
    plug.sil.classList.toggle("hi", !on);
    const off = Math.round(Math.hypot(sx.t, sy.t));
    read.textContent = on ? (off < 6 ? "under" : "off " + off) : "rest";
    B.wake();
  }
  aim(false, 0, 0);
  bag.add(pointer(stage, {
    move: ([px, py]) => { const [wx, wy] = unproj(C, px, py, 0); aim(true, wx, wy); },
    leave: () => aim(false, 0, 0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "oilchange",
  means: "A sump and drain plug overhead, a round drain pan on the floor: the pan slides under the pointer to catch the drip.",
  rules: [1, 3, 5, 6],
  range: [10, 34, 34],
  tour: [[150, 189], [200, 208], [150, 239], null],
  mount,
});
