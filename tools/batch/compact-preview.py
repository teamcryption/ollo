# Round path coordinates to 3 decimals in a preview icon JSON (preview copy only; repo assets untouched).
import json, re, sys
p = sys.argv[1]
d = json.load(open(p))
def r(m):
    s = f"{float(m.group(0)):.3f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s
num = re.compile(r'-?\d+\.\d{4,}')
d = {k: num.sub(r, v) for k, v in d.items()}
json.dump(d, open(p, 'w'), separators=(',', ':'))
