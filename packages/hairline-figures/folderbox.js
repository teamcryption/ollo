/**
 * Folder box: an open archive box with a handle hole and a card holder on its
 * end, seven hanging file folders standing in it, each with a tab at its own
 * place along the top. The pointer picks a folder by where it is along the
 * box: that folder rises out high, its neighbours rise a little, staggered
 * from it. At rest the folders sit unevenly, one pulled up, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the folders' resting tops.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 8, XS0 = 6, TOP = 26, D = 36, SW = 1.6, VIS = 9, LIFT = 24;
const X1 = XS0 + (N - 1) * STEP + 6;
const REST = [1, 0, 3, 0, 7, 1, 0], FAV = 4, TAB = [4, 14, 24, 9, 19, 4, 14];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-2, 0, 0], [X1, D, 0], [X1, 0, 0], [-2, D, 0], [XS0, 2, TOP + VIS + LIFT + 5], [X1 - 6, D, TOP + VIS + LIFT + 5]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the box: one rounded solid, open on top (its crease is the rim)
  const box = solid(g);
  put(box, prism(P, front, rrect(-2, 0, X1, D, 5, 12), rrect(-0.8, 1.2, X1 - 1.2, D - 1.2, 3.8, 12), 0, TOP));
  // the end facing us: a handle hole and a card holder
  const onEnd = (r) => poly(r.map((q) => P(X1, q.u, q.v)));
  mk("path", { class: "nf lo", d: onEnd(rrect(12, TOP - 8, 24, TOP - 4, 2, 4)) + onEnd(rrect(10, 5, 26, 13, 1, 3)) }, box.g);

  const folders = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    folders.push({ k, x: XS0 + k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }

  // a folder: a sheet in the y–z plane with a tab on its top edge, given a thickness along x
  function profile(x, k, h) {
    const zt = TOP + h, t = TAB[k];
    const pts = [[2, TOP], [D - 2, TOP], [D - 2, zt], [t + 10.5, zt], [t + 9, zt + 4], [t, zt + 4], [t - 1.5, zt], [2, zt]];
    return fillet(pts, [0, 0, 1.5, 1, 1.2, 1.2, 1, 1.5], 4).map(([y, z]) => [x, y, z]);
  }
  function draw(f, lift) {
    if (lift === f.last) return;
    f.last = lift;
    const h = VIS + lift, near = profile(f.x + SW / 2, f.k, h), far = profile(f.x - SW / 2, f.k, h);
    f.sil.setAttribute("d", poly(hull(near.concat(far).map((p) => P(...p)))));
    f.cr.setAttribute("d", open(near.filter((p) => p[2] > TOP + 0.5).map((p) => P(...p))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    folders.forEach((f) => { draw(f, tval(f.z, now)); if (!tdone(f.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on a fixed plane through the resting folders, nearest folder along x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP + VIS * 0.6);
    if (x < -4 || x > X1 + 2 || y < -4 || y > D + 2) return -1;
    return clamp(Math.round((x - XS0) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    folders.forEach((f, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, 7 - 3 * Math.abs(k - a));
      tset(f.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      f.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "folder " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "folderbox",
  means: "An archive box of hanging folders: the folder under the pointer rises out, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 120], [200, 140], [240, 160], null],
  mount,
});
