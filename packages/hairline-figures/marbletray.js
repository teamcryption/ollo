/**
 * Marbling tray: a shallow tray of size with combed colour floating on it,
 * and a sheet of paper hinged on its far edge. The pointer over the tray
 * lays the sheet down onto the bath; leaving tilts it back up. At rest the
 * sheet stands tilted, bright, over the swirls. The slider is how high the
 * sheet stands at rest.
 *
 * The pattern: a tilt about one hinge; the hit is on the tray's top plane,
 * which never moves.
 */
const {
  Cam, fit, facing, fillet, open, poly, prism, proj, rings, unproj, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X = 96, Y = 66, H = 9, HY = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let up = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [X, 0, 0], [0, Y, 0], [X, Y, 0], [4, HY, H + 58], [X - 4, HY, H + 58]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, X, Y, 6, 2.2);
  put(solid(g), prism(P, front, tr, ti, 0, H));
  // combed colour on the bath
  let sw = "";
  for (let j = 0; j < 4; j++) {
    const pts = [];
    for (let i = 0; i <= 24; i++) { const x = 8 + (i / 24) * (X - 16); pts.push(P(x, 14 + j * 13 + 4 * Math.sin(i * 0.8 + j * 1.3), H - 1)); }
    sw += open(pts);
  }
  mk("path", { class: "nf lo", d: sw }, g);
  const sheet = solid(g);
  sheet.sil.classList.add("hi");
  const tilt = tween(rad(up));
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), z = H + 0.6, D = Y - 12;
    const at = (x, d, t) => P(x, HY + d * c - t * s, z + d * s + t * c);
    const face = fillet([at(5, 0, 0), at(X - 5, 0, 0), at(X - 5, D, 0), at(5, D, 0)], [1.5, 1.5, 3, 3]);
    sheet.sil.setAttribute("d", poly(face));
    sheet.cr.setAttribute("class", "nf lo");
    sheet.cr.setAttribute("d", open([at(7, D, 1.2), at(X - 7, D, 1.2)]));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tilt, now)); return !tdone(tilt, now); });
  bag.add(B.unregister);

  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(tilt, o ? rad(2) : rad(up), performance.now(), 0);
    read.textContent = o ? "laid" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], H); set(x > -6 && x < X + 6 && y > -6 && y < Y + 6); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { up = v; on = null; set(false); }, destroy: bag.dispose };
}

hairline({
  name: "marbletray",
  means: "A paper marbling tray with combed colour on the bath: the pointer over it lays the hinged sheet down onto the swirls.",
  rules: [1, 5, 6, 8],
  range: [40, 62, 80],
  tour: [[177, 216], [240, 200], [130, 190], null],
  mount,
});
