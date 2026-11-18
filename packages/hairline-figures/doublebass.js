/**
 * Double bass: an upright bass on its endpin, sloped shoulders, a long neck
 * and a pegbox with its tuners, four strings down to the tailpiece, and a
 * bow resting across the strings below the bridge. The pointer over the bass
 * draws the bow across the strings, a long stroke from frog to tip. At rest
 * the strings are bright. The slider is how long the stroke runs.
 *
 * The pattern: one object answering as a whole; the hit is the rest pose.
 */
const {
  Cam, clamp, fit, hull, open, poly, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const S = 1.5, SQ = Math.SQRT1_2, STROKE = 66;
// h runs across the face (screen horizontal), n out of the face towards us
const H = [SQ, -SQ, 0], N = [SQ, SQ, 0];
const at = (u, z, d) => [H[0] * u + N[0] * d, H[1] * u + N[1] * d, z];
// half-width of the body at height z: lower bout, waist, sloped upper bout
function half(z) {
  const t = (z - 12) / 100;
  if (t < 0.5) return 18 + 14 * Math.sin(Math.PI * (t / 0.5) * 0.92 + 0.12) - (t > 0.38 ? (t - 0.38) * 70 : 0);
  if (t < 0.62) return 20 - (t - 0.5) * 20 + (t - 0.55) * (t - 0.55) * 400;
  return Math.max(6, 24 * Math.sin(Math.PI * (1 - (t - 0.62) / 0.38) * 0.5) * (1 - (t - 0.62) * 0.9));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S);
  fit(C, [at(-40, 0, 0), at(90, 0, 0), at(-80, 100, 0), at(0, 178, 0), at(-40, 112, 0), at(40, 0, 10)], 200, 164);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const outline = (d) => { const L = [], R = []; for (let z = 12; z <= 112; z += 2) { const w = half(z); L.push(P(...at(-w, z, d))); R.unshift(P(...at(w, z, d))); } return L.concat(R); };
  mk("path", { d: poly(outline(-4)), class: "sil" }, g);
  mk("path", { d: poly(outline(4)) }, g);
  // endpin, tailpiece, bridge, f-holes
  const seg2 = (a, b, cls, w) => mk("path", { d: poly(hull([P(...a), P(...b), P(...a.map((q, j) => q + (j === 2 ? 0 : H[j] * w))), P(...b.map((q, j) => q + (j === 2 ? 0 : H[j] * w)))])), class: cls }, g);
  seg2(at(-1, 0, 0), at(-1, 12, 0), "sil", 2);
  mk("path", { d: poly([P(...at(-5, 24, 5)), P(...at(5, 24, 5)), P(...at(3, 46, 5)), P(...at(-3, 46, 5))]), class: "sil" }, g);
  mk("path", { d: poly([P(...at(-11, 54, 6)), P(...at(11, 54, 6)), P(...at(8, 61, 9)), P(...at(-8, 61, 9))]), class: "sil" }, g);
  for (const s of [-1, 1]) mk("path", { d: open([P(...at(s * 12, 52, 4)), P(...at(s * 10, 60, 4)), P(...at(s * 11, 70, 4))]), class: "nf lo" }, g);
  // neck, pegbox and tuners
  mk("path", { d: poly([P(...at(-3, 106, 6)), P(...at(3, 106, 6)), P(...at(2.5, 162, 6)), P(...at(-2.5, 162, 6))]), class: "sil" }, g);
  mk("path", { d: poly(hull([P(...at(-4, 160, 4)), P(...at(4, 160, 4)), P(...at(3.5, 178, 2)), P(...at(-3.5, 178, 2))])), class: "sil" }, g);
  for (const z of [164, 171]) for (const s of [-1, 1]) mk("path", { d: poly(hull([P(...at(s * 4, z - 1.5, 3)), P(...at(s * 10, z - 2, 3)), P(...at(s * 10, z + 2, 3)), P(...at(s * 4, z + 1.5, 3))])), class: "sil" }, g);
  const str = [];
  for (const u of [-1.5, -0.5, 0.5, 1.5]) str.push(`M${P(...at(u * 2.4, 44, 7)).join(",")}L${P(...at(u * 1.3, 61, 9)).join(",")}L${P(...at(u * 1.4, 160, 7)).join(",")}`);
  const strings = mk("path", { d: str.join(""), class: "nf" }, g);
  // the bow: stick, hair and frog, slid along its own length
  const bow = mk("g", {}, g);
  const BL = 112, b0 = at(-14, 40, 12), b1 = at(BL - 14, 58, 12);
  const stick = mk("path", { class: "sil" }, bow), hair = mk("path", { class: "nf lo" }, bow), frog = mk("path", { class: "sil" }, bow);
  const slide = tween(0);
  let last = NaN;

  function draw(now) {
    const s = tval(slide, now) * STROKE * amp * -1;
    if (s === last) return;
    last = s;
    const f = tval(slide, now), an = Math.atan2(18, 96) - f * amp * 1.25, dir = [H[0] * Math.cos(an), H[1] * Math.cos(an), Math.sin(an)], c = at(10, 44, 12), p = (t, dz) => P(...[0, 1, 2].map((j) => c[j] + dir[j] * (t - 24 + s) + (j === 2 ? dz : 0)));
    stick.setAttribute("d", poly(hull([p(0, 9), p(BL, 3.5), p(BL, 1), p(0, 6)])));
    hair.setAttribute("d", poly([p(4, 0), p(BL, 1), p(BL, -1.5), p(4, -3)]));
    frog.setAttribute("d", poly([p(1, 8), p(11, 8), p(10, 0), p(3, 0)]));
  }
  const B = register(stage, (_dt, now) => { draw(now); return !tdone(slide, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(on) {
    const id = on ? 1 : -1;
    if (id === act) return;
    act = id;
    tset(slide, on ? 1 : 0, performance.now(), 0);
    strings.classList.toggle("hi", !on);
    stick.classList.toggle("hi", on);
    frog.classList.toggle("hi", on);
    read.textContent = on ? "bow " + Math.round(STROKE * amp) : "rest";
    B.wake();
  }
  setActive(false);
  const lo = P(...at(0, 0, 0)), top = P(...at(0, 178, 0));
  bag.add(pointer(stage, {
    move: (p) => setActive(Math.abs(p[0] - lo[0]) < 50 && p[1] < lo[1] + 8 && p[1] > top[1] - 8),
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 0.2, 1); last = NaN; if (act > 0) read.textContent = "bow " + Math.round(STROKE * amp); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "doublebass",
  means: "An upright double bass with its bow across the strings: the pointer draws the bow in a long stroke from frog to tip.",
  rules: [1, 4, 5],
  range: [0.3, 0.75, 1],
  tour: [[193, 172], [193, 250], [193, 81], null],
  mount,
});
