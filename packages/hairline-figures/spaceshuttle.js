/**
 * Space shuttle: an orbiter with delta wings, a tall fin and two long
 * payload bay doors on its back. The pointer swings the doors open on their
 * hinges, wider the further right it goes. The doors are the bright mark.
 */
const { Cam, fit, proj, hull, poly, clamp, spring, stepS, disposer, mk, pointer, register } = HL;
const S = 2.0, Z0 = 40, R = 11, L = 13;
const disc = (x, r, z = Z0, n = 16) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([x, r * Math.cos(t), z + r * Math.sin(t)]); } return o; };
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; [x0, x1].forEach((x) => [y0, y1].forEach((y) => [z0, z1].forEach((z) => o.push([x, y, z])))); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-60, -44, Z0 - 12], [58, 0, Z0], [-60, 44, Z0 - 12], [-58, 0, Z0 + 36], [-30, 26, Z0 + 10], [24, -26, Z0 + 10], [0, 0, Z0 + R + L]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const n = ["wing", "fin", "body", "bay", "doorF", "doorN"];
  const el = {};
  n.forEach((k) => (el[k] = mk("path", { class: k === "bay" ? "nf lo" : "sil" }, g)));
  el.doorF.classList.add("hi"); el.doorN.classList.add("hi");
  const o = spring(0);
  let last = NaN;
  const ang = (v) => 0.12 + v * 2.2;
  function draw() {
    if (o.x === last) return; last = o.x;
    const a = ang(o.x);
    const sh = (pts) => poly(hull(pts.map((p) => P(...p))));
    el.wing.setAttribute("d", sh([[-56, -44, Z0 - 6], [-56, 44, Z0 - 6], [-44, -44, Z0 - 6], [-44, 44, Z0 - 6], [10, -12, Z0 - 6], [10, 12, Z0 - 6], [34, -9, Z0 - 6], [34, 9, Z0 - 6]].concat([[-56, 0, Z0 - 8], [-56, 0, Z0 - 4]])));
    el.fin.setAttribute("d", sh(box(-56, -36, -1.5, 1.5, Z0 + 4, Z0 + 6).concat(box(-60, -52, -1.5, 1.5, Z0 + 34, Z0 + 36))));
    el.body.setAttribute("d", sh(disc(-56, 10).concat(disc(-30, R), disc(28, R), disc(42, 8, Z0 - 1), disc(52, 4, Z0 - 3), disc(56, 1.5, Z0 - 4))));
    const hz = Z0 + R * 0.72, hy = R * 0.69, x0 = -42, x1 = 30;
    el.bay.setAttribute("d", poly([[x0, -hy, hz], [x1, -hy, hz], [x1, hy, hz], [x0, hy, hz]].map((p) => P(...p))));
    const door = (s) => {
      const dy = -s * Math.cos(a), dz = Math.sin(a), pts = [];
      [x0, x1].forEach((x) => [0, L].forEach((u) => [0, 1.4].forEach((t) => pts.push([x, s * hy + u * dy + t * s * Math.sin(a) * 0, hz + u * dz + t]))));
      return sh(pts);
    };
    el.doorF.setAttribute("d", door(-1));
    el.doorN.setAttribute("d", door(1));
  }
  const B = register(stage, (dt) => { const m = stepS(o, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx]) {
    o.t = clamp(gain * (0.6 + 0.4 * clamp((sx - 80) / 240, 0, 1)), 0, 1.2);
    read.textContent = Math.round((ang(o.t) * 180) / Math.PI) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { o.t = 0; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.3, 1.2); }, destroy: bag.dispose };
}

hairline({
  name: "spaceshuttle",
  means: "A space shuttle orbiter: the pointer swings its two long payload bay doors open on their hinges, wider toward the right.",
  rules: [3, 4, 5, 8],
  range: [0.3, 0.85, 1.2],
  tour: [[233, 178], [312, 244], [151, 94], null],
  mount,
});
