/**
 * Cradle: a basket on two curved rockers. The pointer's place across the
 * floor tips the cradle toward it, rolling on its rockers; leaving lets it
 * settle back to a slight rest lean. The basket's rim is the bright mark.
 * The slider is how far it may rock.
 *
 * The pattern: one object answering where (a spring).
 */
const {
  Cam, fit, hull, open, poly, proj, rrect, clamp, rad, spring, stepS, unproj,
  disposer, mk, pointer, register,
} = HL;

const L = 84, W = 40, Z0 = 16, Z1 = 40, R = 62, REST = 5;
const base = rrect(0, -W / 2, L, W / 2, 7, 4), inner = rrect(2.5, -W / 2 + 2.5, L - 2.5, W / 2 - 2.5, 5, 4);
const arc = [];
for (let i = 0; i <= 16; i++) { const a = rad(-36 + (72 * i) / 16); arc.push([R * Math.sin(a), R - R * Math.cos(a)]); }
arc.push([arc[16][0] - 4, Z0], [arc[0][0] + 4, Z0]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  const mx = Math.max(...arc.map((q) => Math.abs(q[0]))) + 16;
  fit(C, [[0, -mx, 0], [L, mx, 0], [0, -mx, Z1 + 6], [L, mx, Z1 + 6], [L, -mx, Z1], [0, mx, 0]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const tilt = spring(REST);
  const xf = (x, y, z, th) => {
    const c = Math.cos(th), s = Math.sin(th), dz = z - R;
    return P(x, y * c - dz * s - R * th, y * s + dz * c + R);
  };
  const rockers = [6, L - 10].map(() => mk("path", { class: "sil" }, g));
  const body = mk("path", { class: "sil hi" }, g);
  const rim = mk("path", { class: "nf lo" }, g);
  const bed = mk("path", { class: "nf lo" }, g);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg);
    [6, L - 10].forEach((x, i) => {
      const pts = [];
      for (const [y, z] of arc) pts.push(xf(x, y, z, th), xf(x + 4, y, z, th));
      rockers[i].setAttribute("d", poly(hull(pts)));
    });
    const ring = (rg, z) => rg.map((q) => xf(q.u, q.v, z, th));
    body.setAttribute("d", poly(hull(ring(base, Z0).concat(ring(base, Z1)))));
    rim.setAttribute("d", poly(ring(inner, Z1)));
    bed.setAttribute("d", open(ring(rrect(6, -W / 2 + 6, L - 6, W / 2 - 6, 4, 4), Z1 - 9)));
  }

  const B = register(stage, (dt) => {
    const m = stepS(tilt, dt);
    draw(Math.round(tilt.x * 100) / 100);
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { tilt.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [, y] = unproj(C, p[0], p[1], 0);
    const d = clamp(y / 70, -1, 1) * reach;
    tilt.t = d;
    read.textContent = (d >= 0 ? "+" : "") + Math.round(d) + "°";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "cradle",
  means: "A cradle on two curved rockers: it rolls toward the pointer's side of the floor and settles back to a slight lean.",
  rules: [3, 5, 8, 9],
  range: [6, 14, 20],
  tour: [[149, 160], [237, 237], [200, 141], null],
  mount,
});
