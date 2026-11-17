/**
 * Canteen: a round flat flask standing on its edge, a short neck on top and
 * a screw cap tethered to it. At rest the cap is on, bright. The pointer over
 * the flask tips it to pour and the cap twists off and swings out on its
 * tether after it. The slider is the cap's lag behind the tilt.
 */
const { Cam, fit, hull, open, poly, proj, tdone, tset, tval, tween, unproj, disposer, mk, pointer, register, solid } = HL;

const R = 24, T = 8, NR = 5, NH = 6, CH = 6, TILT = 38, CAP = 1;

function rotY(p, c, a) {
  const s = Math.sin(a), co = Math.cos(a), x = p[0] - c[0], z = p[2] - c[2];
  return [c[0] + x * co + z * s, p[1], c[2] - x * s + z * co];
}
function disc(r, y, cz, n) {
  const out = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push([r * Math.cos(a), y, cz + r * Math.sin(a)]); }
  return out;
}
function cyl(r, z0, z1, n) {
  const out = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push([r * Math.cos(a), r * Math.sin(a), z0], [r * Math.cos(a), r * Math.sin(a), z1]); }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 3.9);
  fit(C, [[-R, -T, 0], [R + 16, T, 0], [-R, T, 2 * R + 14], [R + 20, T, 2 * R + 8], [R + 24, 0, 30]], 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const body = solid(g), neck = solid(g), cap = solid(g);
  const tether = mk("path", { class: "nf lo" }, g);
  const tilt = tween(0), off = tween(0);
  let last = "";

  function draw(t, o) {
    const key = t + ":" + o;
    if (key === last) return;
    last = key;
    const a = (t * Math.PI) / 180, c = [R * 0.7, 0, 0], lift = t * 0.25;
    const W = (p) => { const q = rotY(p, c, a); return P(q[0], q[1], q[2] + lift); };
    const pts = [];
    [[-T / 2, R], [T / 2, R], [-T / 2 - 1.5, R - 2], [T / 2 + 1.5, R - 2]].forEach(([y, r]) => disc(r, y, R, 40).forEach((p) => pts.push(W(p))));
    body.sil.setAttribute("d", poly(hull(pts)));
    body.cr.setAttribute("d", poly(disc(R - 6, T / 2 + 1.5, R, 40).map(W)) + open([W([-R + 1, T / 2 + 1, R]), W([-R + 6, T / 2 + 1.5, R])]));
    const nz = 2 * R - 1;
    neck.sil.setAttribute("d", poly(hull(cyl(NR, nz, nz + NH, 20).map(W))));
    neck.cr.setAttribute("d", poly(disc(NR - 1.4, 0, 0, 20).map(([x, , y]) => W([x, y, nz + NH]))));
    // the cap: up the neck's axis, then out to the side on its tether
    const up = Math.min(o, 0.4) / 0.4 * 6, swing = Math.max(0, o - 0.4) / 0.6;
    const cz = nz + NH - 2 + up, cx = -swing * 16, czs = cz - swing * 14;
    const cp = cyl(NR + 1.2, czs, czs + CH, 20).map(([x, y, z]) => W([x + cx, y + swing * 6, z]));
    cap.sil.setAttribute("d", poly(hull(cp)));
    cap.cr.setAttribute("d", poly(disc(NR - 0.2, 0, 0, 20).map(([x, , y]) => W([x + cx, y + swing * 6, czs + CH]))));
    tether.setAttribute("d", open([W([-NR, 0, nz + 2]), W([-NR - 4 - swing * 4, swing * 4, nz - 4 + up * 0.3]), W([cx - NR - 1, swing * 6, czs + 1])]));
  }
  const B = register(stage, (_dt, now) => {
    draw(tval(tilt, now), tval(off, now));
    return !tdone(tilt, now) || !tdone(off, now);
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(tilt, on ? TILT : 0, now, on ? lag : 0);
    tset(off, on ? CAP : 0, now, on ? 0 : lag);
    cap.sil.classList.toggle("hi", true);
    read.textContent = on ? "pour" : "rest";
    B.wake();
  }
  setActive(false);
  function hit([sx, sy]) {
    for (const z of [10, 24, 40]) { const [x, y] = unproj(C, sx, sy, z); if (Math.abs(x) < R + 4 && Math.abs(y) < T + 4) return true; }
    return false;
  }
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "canteen",
  means: "A canteen: the pointer tips the flask to pour and the cap twists off and swings out on its tether.",
  rules: [4, 5, 6, 8],
  range: [0, 160, 400],
  tour: [[178, 164], [228, 242], [128, 85], null],
  mount,
});
