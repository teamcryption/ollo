/**
 * Antenna dish: a ground-station dish on a pedestal, its feed held out on
 * three struts. The pointer on the ground is where the dish aims: it swings
 * round to that bearing and tips lower the farther the pointer is. At rest it
 * looks up and to the left, its feed lit. The slider is how far it may tip.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, seg, stepS, spring, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 34, R = 32, DEPTH = 9, FEED = 26, AZ0 = rad(75), EL0 = rad(52);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-46, -46, 0], [46, 46, 0], [46, -46, 0], [-46, 46, 0], [0, 0, H + 6 + R + 8], [-30, -30, H + 40], [30, 30, H + 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-46, -46, 46, 46, 10, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  put(solid(g), prism(P, front, circ(14, 32), circ(12, 32), 4, 9));
  put(solid(g), prism(P, front, circ(6, 24), circ(4.8, 24), 9, H));
  const back = mk("g", {}, g), dish = mk("path", { class: "sil" }, g), bowl = mk("path", { class: "nf lo" }, g);
  const fore = mk("g", {}, g);
  const struts = mk("path", { class: "nf lo" }, fore), feed = mk("path", {}, fore), dot = mk("circle", { r: 2.4, class: "dot" }, fore);

  const az = spring(AZ0), el = spring(EL0);
  let last = "";
  const add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];

  function draw() {
    const key = az.x.toFixed(4) + el.x.toFixed(4);
    if (key === last) return;
    last = key;
    const ca = Math.cos(az.x), sa = Math.sin(az.x), ce = Math.cos(el.x), se = Math.sin(el.x);
    const n = [ce * ca, ce * sa, se], u = [-sa, ca, 0], w = [-se * ca, -se * sa, ce];
    const piv = [0, 0, H + 4], c = add(piv, n, 6);
    const ring = (o, r, m = 40) => {
      const out = [];
      for (let i = 0; i < m; i++) { const t = (i / m) * Math.PI * 2, q = add(add(o, u, r * Math.cos(t)), w, r * Math.sin(t)); out.push(P(q[0], q[1], q[2])); }
      return out;
    };
    const rim = ring(c, R), rear = ring(add(c, n, -DEPTH), R * 0.35, 20);
    // the rim's winding on screen says whether the bowl faces the reader
    let area = 0;
    rim.forEach((p, i) => { const q = rim[(i + 1) % rim.length]; area += p[0] * q[1] - q[0] * p[1]; });
    const open_ = area > 0;
    dish.setAttribute("d", poly(hull(rim.concat(rear))));
    bowl.setAttribute("d", open_ ? poly(ring(add(c, n, -DEPTH * 0.45), R * 0.72)) : poly(rear));
    const f = add(c, n, FEED), fp = P(f[0], f[1], f[2]);
    let s = "";
    for (const t of [0.5, 0.5 + 2.094, 0.5 + 4.189]) {
      const q = add(add(c, u, R * 0.93 * Math.cos(t)), w, R * 0.93 * Math.sin(t));
      s += seg(P(q[0], q[1], q[2]), fp);
    }
    struts.setAttribute("d", s);
    const fb = add(f, n, -5);
    feed.setAttribute("d", poly(hull(ring(f, 2.6, 12).concat(ring(fb, 3.6, 12)))));
    dot.setAttribute("cx", fp[0]); dot.setAttribute("cy", fp[1]);
    // feed and struts sit in front of the bowl when it faces the reader, behind it when not
    if (open_) g.append(fore); else back.append(fore);
  }

  const B = register(stage, (dt) => {
    const a = stepS(az, dt), b = stepS(el, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    const [gx, gy] = unproj(C, p[0], p[1], 0), d = Math.hypot(gx, gy);
    let t = Math.atan2(gy, gx);
    while (t - az.t > Math.PI) t -= Math.PI * 2;
    while (t - az.t < -Math.PI) t += Math.PI * 2;
    az.t = t;
    el.t = rad(clamp(lerp(78, 78 - 60 * (0.35 + 0.65 * tip), d / 140), 14, 78));
    if (on !== true) { on = true; dish.classList.add("hi"); dot.setAttribute("class", "dot m"); }
    const deg = Math.round(((t * 180 / Math.PI) % 360 + 360) % 360);
    read.textContent = "az " + deg;
    B.wake();
  }
  function rest() {
    az.t = AZ0 + Math.round((az.t - AZ0) / (Math.PI * 2)) * Math.PI * 2; el.t = EL0;
    on = false; dish.classList.remove("hi"); dot.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  rest();
  draw();
  bag.add(pointer(stage, { move: aim, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; }, destroy: bag.dispose };
}

hairline({
  name: "satellitearray",
  means: "A ground-station dish on its pedestal: it swings round to the pointer's bearing and tips lower the farther away the pointer is.",
  rules: [1, 3, 4, 8],
  range: [0, 0.5, 1],
  tour: [[300, 200], [120, 230], [110, 120], null],
  mount,
});
