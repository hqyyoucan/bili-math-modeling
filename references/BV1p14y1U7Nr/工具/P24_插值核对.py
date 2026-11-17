"""P24一维示例的补充SciPy重建；不是原MATLAB执行。"""
import json
from pathlib import Path
import numpy as np
from scipy.interpolate import PchipInterpolator,CubicSpline
x=np.arange(1.,11.);y=np.log(x);q=.01+.1*np.arange(100)
p=PchipInterpolator(x,y,extrapolate=True);s=CubicSpline(x,y,bc_type='not-a-knot',extrapolate=True)
assert np.max(abs(p(x)-y))<1e-12 and np.max(abs(s(x)-y))<1e-12
inside=(q>=x[0])&(q<=x[-1]);outside=~inside
out={'label':__doc__,'nodes_x':x.tolist(),'query_count':len(q),'query_first':float(q[0]),'query_last':float(q[-1]),
 'outside_sample_interval_count':int(outside.sum()),'sample_interval':[1,10],
 'node_max_abs_error':{'pchip':float(np.max(abs(p(x)-y))),'spline':float(np.max(abs(s(x)-y)))},
 'at_001':{'true_log':float(np.log(.01)),'pchip':float(p(.01)),'spline_not_a_knot':float(s(.01))},
 'inside_grid_max_abs_error':{'pchip':float(np.max(abs(p(q[inside])-np.log(q[inside])))),'spline_not_a_knot':float(np.max(abs(s(q[inside])-np.log(q[inside]))))},
 'at_zero_extrapolated_finite':{'pchip':float(p(0)),'spline':float(s(0))},
 'interpretation':'0.01到1之前是外推；有限三次段不能复现ln(x)在0+的负无穷奇点。'}
root=Path(__file__).resolve().parent.parent
(root/'原始材料/P24/补充插值核对.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
