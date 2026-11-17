"""P13补充验证：整数域、集合覆盖、真背包及投针模拟。"""
import itertools
import json
from pathlib import Path
import numpy as np
from scipy.optimize import milp,Bounds,LinearConstraint

root=Path(__file__).resolve().parent.parent
def equality_integer(rhs):
    r=milp(c=[1.,1.],integrality=[1,1],bounds=Bounds([0,0],[np.inf,np.inf]),constraints=LinearConstraint([[2.,4.]],[rhs],[rhs]))
    return {"rhs":rhs,"success":bool(r.success),"status":int(r.status),"x":None if r.x is None else r.x.tolist(),"minimum":None if r.fun is None else float(r.fun)}
parity5=equality_integer(5);parity6=equality_integer(6)
assert not parity5["success"] and parity5["status"]==2
assert parity6["success"] and abs(parity6["minimum"]-2)<1e-9
A=np.array([[-2,5,-1],[1,3,1],[1,1,1]],dtype=float)
r=milp(c=[2,3,-5],integrality=[1,0,1],bounds=Bounds([0]*3,[np.inf]*3),constraints=LinearConstraint(A,[-np.inf,-np.inf,7],[-10,12,7]))
assert r.success and np.allclose(r.x,[3,0,4]) and abs(r.fun+14)<1e-9

coverage=[{1,5,7},{1,2,5,8},{1,3,5},{2,4,8},{3,6},{4,6,8}]
cover_solutions=[]
for bits in itertools.product([0,1],repeat=6):
    covered=set().union(*(coverage[j] for j,x in enumerate(bits) if x))
    if covered==set(range(1,9)):
        cover_solutions.append((sum(bits),bits))
minimum=min(n for n,_ in cover_solutions)
best_cover=[[i+1 for i,v in enumerate(bits) if v] for n,bits in cover_solutions if n==minimum]
assert minimum==3 and best_cover==[[1,4,5]]

weights=[6,3,4,5,1,2,3,5,4,2]
profits=[540,200,180,350,60,150,280,450,320,120]
bags=[]
for bits in itertools.product([0,1],repeat=10):
    weight=sum(w*x for w,x in zip(weights,bits))
    if weight<=30:
        bags.append((sum(v*x for v,x in zip(profits,bits)),weight,bits))
profit=max(row[0] for row in bags)
best_bags=[{"items":[i+1 for i,v in enumerate(bits) if v],"weight":weight,"profit":p} for p,weight,bits in bags if p==profit]
assert profit==2410

# 补充实验参数，不是课件给出的数值：a=2,l=1,N=200000。
rng=np.random.default_rng(20261117)
N=200000;a=2.;length=1.
distance=rng.uniform(0,a/2,size=N)
angle=rng.uniform(0,np.pi,size=N)
K=int(np.count_nonzero(distance<=length/2*np.sin(angle)))
phat=K/N;pi_hat=2*length/(a*phat)
report={"execution":"补充SciPy/HiGHS、穷举和NumPy模拟，MATLAB原文件未执行","parity_examples":[parity5,parity6],"mixed_integer_example":{"intcon_matlab":[1,3],"corrected_b":[-10,12],"x":r.x.tolist(),"minimum":float(r.fun),"mip_gap":float(r.mip_gap),"inequality_slack":([-10,12]-A[:2]@r.x).tolist(),"note":"原问题已经是最小化，不能再把fval取负；课件b=10在口述中已更正为-10。"},"school_cover":{"sets_by_site":[sorted(s) for s in coverage],"minimum_schools":minimum,"optimal_sites":best_cover,"enumerated_cases":64},"knapsack_homework":{"weights":weights,"profits":profits,"capacity":30,"optimal":best_bags,"enumerated_cases":1024},"buffon_supplement":{"a":a,"needle_length":length,"N":N,"seed":20261117,"crossings":K,"p_hat":phat,"p_exact":2*length/(np.pi*a),"p_standard_error_estimate":float(np.sqrt(phat*(1-phat)/N)),"pi_hat":pi_hat,"pi_absolute_error":float(abs(pi_hat-np.pi)),"note":"独立均匀抽样的补充演示，有限样本估计不是精确π或整数规划最优性证明。"}}
(root/"原始材料/P13/补充数值核对.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False))
