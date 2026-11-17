"""补充重建与解析核对，不是执行原MATLAB代码。"""
import json
from pathlib import Path
import numpy as np
from scipy.optimize import minimize
root=Path(__file__).resolve().parent.parent
f=lambda x: float(np.dot(x,x)+8)
cons=[{'type':'ineq','fun':lambda x:x[0]-x[1]+x[2]},
      {'type':'ineq','fun':lambda x:20-x[0]-x[1]**2-x[2]**3},
      {'type':'eq','fun':lambda x:-x[0]-x[1]**2+2}]
records=[]
for start in [[0,0,0],[0,-1,0],[1,1,1]]:
    r=minimize(f,start,method='SLSQP',constraints=cons,options={'ftol':1e-11,'maxiter':1000})
    records.append({'start':start,'success':bool(r.success),'message':r.message,'x':r.x.tolist(),
                    'objective':float(r.fun),'constraint_values':[float(c['fun'](r.x)) for c in cons]})
x=np.array([.5,-np.sqrt(1.5),0.])
assert abs(f(x)-9.75)<1e-12
assert all(c['fun'](x)>=-1e-12 for c in cons[:2])
assert abs(cons[2]['fun'](x))<1e-12
out={'label':'课程画面公式的补充SciPy重建；未运行MATLAB',
     'first_example_multistart':records,
     'analytic_global_solution':{'x':x.tolist(),'f':f(x),
       'proof':'等式给x1=2-x2^2，f=9.75+(x2^2-1.5)^2+x3^2；负根候选可行，达到全局下界。'},
     'second_example':'原画面x1+x2^2=2且x1>=10，实数域不可行；换非线性算法不能消除矛盾。',
     'travel_surrogate':{'x':[0,1,2,10],'x_over_1_plus_x':[0,.5,2/3,10/11]}}
(root/'原始材料/P15/补充数值核对.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
