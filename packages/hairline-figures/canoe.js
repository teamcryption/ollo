/**
 * Canoe: an open canoe afloat on a round of lake, two thwarts across its
 * open hull, the bow and stern rising. The pointer stands somewhere on the
 * water and the canoe swings its bow round to face it, on a spring. At rest
 * it lies at a slant, the bow marked by one bright dot. The slider is how
 * far the canoe may swing from its rest heading.
 *
 * The pattern: one part turning to face the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rrect, seg, spring, stepS, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const L = 124, W = 15, D = 11, RISE = 7, R = 82, REST = 0.35, N = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, D + RISE + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lr = rrect(-R, -R, R, R, R, 14), li = rrect(-R + 2.2, -R + 2.2, R - 2.2, R - 2.2, R - 2.2, 14);
  put(solid(g), prism(P, front, lr, li, -3, 0));
  // a ripple guide on the water around the hull
  mk("path", { d: poly(circ(R * 0.82, 48).map((q) => P(q.u, q.v, 0))), class: "dash nf" }, g);

  const boat = solid(g);
  boat.g.removeChild(boat.cr);
  const inner = mk("path", { class: "nf lo" }, boat.g), thw = mk("path", { class: "nf lo" }, boat.g);
  const bow = flatDot(boat.g, C, 2.4, "dot");

  // plan outline at fraction t along the length: half-width, deck height
  const half = (t, w) => w * Math.pow(Math.sin(Math.PI * t), 0.75);
  const deck = (t) => D + RISE * Math.pow(Math.abs(2 * t - 1), 4);
  function outline(len, w, zf, a) {
    const ca = Math.cos(a), sa = Math.sin(a), pts = [];
    for (let s = -1; s <= 1; s += 2) for (let i = 0; i <= N; i++) {
      const t = s > 0 ? i / N : 1 - i / N, x = (t - 0.5) * len, y = s * half(t, w);
      pts.push(P(x * ca - y * sa, x * sa + y * ca, zf(t)));
    }
    return pts;
  }
  const at = (x, y, z, a) => P(x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z);

  const yaw = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const keel = outline(L * 0.82, W * 0.55, () => 0, a), top = outline(L, W, deck, a);
    boat.sil.setAttribute("d", poly(hull(keel.concat(top))));
    inner.setAttribute("d", poly(outline(L - 6, W - 2.4, (t) => deck(t) - 0.6, a)));
    let d = "";
    for (const f of [0.34, 0.66]) {
      const x = (f - 0.5) * L, w = half(f, W - 2.4), z = deck(f) - 0.6;
      d += seg(at(x, -w, z, a), at(x, w, z, a));
    }
    thw.setAttribute("d", d);
    place(bow, at(L / 2 - 3, 0, deck(1) - 1, a));
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function setAim(p) {
    if (!p) {
      yaw.t = REST; act = null;
      boat.sil.classList.remove("hi"); bow.setAttribute("class", "dot");
      read.textContent = "rest";
    } else {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.hypot(x, y) < 6) return;
      let d = Math.atan2(y, x) - REST;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      yaw.t = REST + clamp(d, -reach, reach);
      act = p;
      boat.sil.classList.add("hi"); bow.setAttribute("class", "dot m");
      const deg = Math.round((((yaw.t * 180) / Math.PI) % 360 + 360) % 360);
      read.textContent = String(deg).padStart(3, "0") + "°";
    }
    B.wake();
  }
  setAim(null);
  draw(yaw.x);
  bag.add(pointer(stage, { move: setAim, leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = (v * Math.PI) / 180; if (act) setAim(act); }, destroy: bag.dispose };
}

hairline({
  name: "canoe",
  means: "An open canoe afloat on a lake: it swings its bow round to face the pointer, as far as the slider lets it turn.",
  rules: [1, 3, 5, 8],
  range: [30, 120, 180],
  tour: [[268, 189], [109, 125], [245, 238], null],
  mount,
});
