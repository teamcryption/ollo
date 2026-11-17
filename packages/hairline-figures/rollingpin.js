/**
 * Rolling pin: one wooden pin with a handle at each end, lying across a
 * sheet of dough. At rest it sits off-centre, bright. The pointer's place
 * along the dough sets where the pin rolls to, on a spring. The slider is
 * how far it may roll.
 *
 * The pattern: one part follows the pointer (slide).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, clamp,
} = HL;

const R = 7, HL0 = 30, HL1 = 46, HR = 2.8, Z = 3 + R, REST = -14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-44, -HL1, 0], [44, HL1, 0], [44, -HL1, 0], [-44, HL1, 0], [0, 0, Z + R + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-42, -30, 42, 30, 10, 2);
  put(solid(g), prism(P, front, dr, di, 0, 3));
  const pin = mk("g", {}, g);
  const nearPos = P(0, HL1, Z)[1] > P(0, -HL1, Z)[1];
  const far = mk("path", { class: "nf" }, pin), body = mk("path", { class: "sil hi" }, pin), end = mk("path", { class: "nf lo" }, pin), near = mk("path", { class: "nf" }, pin);
  const sp = spring(REST);
  let last = NaN;

  const ring = (x, y, r, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push(P(x + r * Math.cos(t), y, Z + r * Math.sin(t))); } return o; };
  function draw(x) {
    if (x === last) return;
    last = x;
    const s = nearPos ? 1 : -1;
    body.setAttribute("d", poly(hull(ring(x, -HL0, R, 32).concat(ring(x, HL0, R, 32)))));
    end.setAttribute("d", poly(ring(x, s * HL0, R - 1.5, 32)));
    far.setAttribute("d", poly(hull(ring(x, -s * HL0, HR).concat(ring(x, -s * (HL1 - 2), HR + 0.6), ring(x, -s * HL1, HR)))));
    near.setAttribute("d", poly(hull(ring(x, s * HL0, HR).concat(ring(x, s * (HL1 - 2), HR + 0.6), ring(x, s * HL1, HR)))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);


  function aim(t, a) {
    sp.t = t;
    read.textContent = a ? (t >= 0 ? "+" : "") + Math.round(t) : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (Math.abs(wy) > HL1 + 10 || Math.abs(wx) > 60) return aim(REST, false);
    aim(clamp(wx, -reach, reach), true);
  }
  aim(REST, false);
  bag.add(pointer(stage, { move, leave: () => aim(REST, false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "rollingpin",
  means: "A rolling pin across a sheet of dough: it rolls along the dough to wherever the pointer is.",
  rules: [1, 3, 5, 8],
  range: [16, 28, 32],
  tour: [[248, 192], [126, 131], [274, 205], null],
  mount,
});
