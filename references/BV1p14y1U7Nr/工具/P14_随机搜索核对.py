"""P14画面重建：随机可行搜索与小域全枚举的区别。"""
import itertools,json
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parent.parent
previous=json.loads((root/"原始材料/P13/补充数值核对.json").read_text(encoding="utf-8"))
N=10000;seed=20261117
cover=np.zeros((8,6),dtype=int)
for j,items in enumerate(previous["school_cover"]["sets_by_site"]):
    for i in items:cover[i-1,j]=1
rng=np.random.default_rng(seed)
school=rng.integers(0,2,size=(N,6))
valid=np.all(school@cover.T>=1,axis=1)
cost=school.sum(axis=1)
best=int(np.min(cost[valid]))
states=np.unique(school[valid&(cost==best)],axis=0)
assert best==3 and states.tolist()==[[1,0,0,1,1,0]]

C=np.array([[4,2,3,4],[6,4,5,5],[7,6,7,6],[7,8,8,6],[7,9,8,6],[7,10,8,6]])
complete=[]
for assignment in itertools.product(range(1,5),repeat=6):
    if len(set(assignment))!=4:continue
    profit=int(sum(C[i,j-1] for i,j in enumerate(assignment)))
    complete.append((profit,assignment))
optimum=max(row[0] for row in complete)
optimal=[list(row[1]) for row in complete if row[0]==optimum]
assert optimum==44 and len(optimal)==3
rng=np.random.default_rng(seed+1)
assign=rng.integers(1,5,size=(N,6))
valid_assign=np.all(np.column_stack([np.any(assign==j,axis=1) for j in range(1,5)]),axis=1)
profits=C[np.arange(6)[None,:],assign-1].sum(axis=1)
sample_best=int(np.max(profits[valid_assign]))
sample_states=np.unique(assign[valid_assign&(profits==sample_best)],axis=0)

rng=np.random.default_rng(seed+2)
a=10.;length=5.
phi=rng.uniform(0,np.pi,size=N);distance=rng.uniform(0,a/2,size=N)
hits=int(np.count_nonzero(distance<=length/2*np.sin(phi)))
phat=hits/N;pi_estimate=2*length/(a*phat)

rng=np.random.default_rng(seed+3)
people=rng.integers(1,7,size=(N,2))
valid_people=(people.sum(axis=1)<=6)&(people@np.array([240,120])<=1200)
score=people@np.array([40,30]);max_people=int(np.max(score[valid_people]))
best_people=np.unique(people[valid_people&(score==max_people)],axis=0)
assert max_people==220 and best_people.tolist()==[[4,2]]
report={"execution":"补充NumPy随机搜索，原MATLAB未执行；每项记录独立种子，结果不冒充课堂相同随机序列","school":{"N":N,"seed":seed,"constraints":"按P13完整8小区覆盖表构造","feasible_samples":int(np.count_nonzero(valid)),"sample_best":best,"sample_best_states":states.tolist(),"exact_reference":previous["school_cover"],"course_discrepancy":"完整模型最优唯一；P14口述学校例多解与其不一致，条件行右端未完整可读，未定位具体遗漏。"},"assignment":{"C_source":"P14 KF-P14-03-HD command window / code","C":C.tolist(),"encoding":"长度6的企业编号，值1..4，每个企业至少出现一次","enumerated_total":4096,"feasible_total":len(complete),"exact_maximum":optimum,"all_optimal_assignments":optimal,"N":N,"seed":seed+1,"feasible_samples":int(np.count_nonzero(valid_assign)),"sample_maximum":sample_best,"sample_best_assignments":sample_states.tolist()},"buffon":{"a":a,"length":length,"N":N,"seed":seed+2,"hits":hits,"p_hat":phat,"pi_hat":pi_estimate,"course_reported_pi":3.2154,"note":"a/l/N来自P14；种子是补充指定，课堂种子未知，因此不要求数值逐次一致。"},"people":{"N":N,"seed":seed+3,"sample_domain":"[1,6]^2，依据课堂约束作补充编码；未从抽样帧确认原代码采样范围","feasible_samples":int(np.count_nonzero(valid_people)),"sample_best":max_people,"sample_best_states":best_people.tolist(),"exact_reference":"P11已用求解器、整数枚举及上界证明220最优"}}
(root/"原始材料/P14/补充随机与穷举核对.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False))
