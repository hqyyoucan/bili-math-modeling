"""P21图像重建，既有SciPy/HiGHS两阶段LP验证，不是原MATLAB代码。"""
from pathlib import Path
import numpy as np,json
from scipy.optimize import linprog
E=np.array([[1,2,15,8],[1,3,10,10],[1,4,20,15],[2,5,7,9],[2,6,10,11],[3,6,8,8],[3,7,2,6],[4,7,18,14],[5,8,6,8],[6,8,16,9],[7,8,20,10]],dtype=float)
B=np.zeros((8,len(E)))
for k,(u,v,cap,cost) in enumerate(E):B[int(u)-1,k]=1;B[int(v)-1,k]=-1
bounds=[(0,float(c)) for c in E[:,2]]
rmax=linprog(-B[0],A_eq=B[1:7],b_eq=np.zeros(6),bounds=bounds,method='highs');assert rmax.success
F=-rmax.fun;assert abs(F-42)<1e-8
b=np.array([F,0,0,0,0,0,0,-F])
r=linprog(E[:,3],A_eq=B,b_eq=b,bounds=bounds,method='highs');assert r.success
assert abs(r.fun-1344)<1e-8;assert np.max(abs(B@r.x-b))<1e-8
flow=np.zeros(len(E));trace=[]
for P,delta in [([1,2,5,8],6),([1,3,7,8],2),([1,3,6,8],8),([1,2,6,8],8),([1,4,7,8],18)]:
    for u,v in zip(P,P[1:]):flow[np.where((E[:,0]==u)&(E[:,1]==v))[0][0]]+=delta
    assert np.all(flow<=E[:,2]);net=B@flow;assert np.max(abs(net[1:7]))<1e-8
    trace.append({'path':P,'delta':delta,'total_flow':float(net[0]),'total_cost':float(E[:,3]@flow)})
assert abs(E[:,3]@flow-r.fun)<1e-8
out={'label':__doc__,'edge_columns':['from','to','capacity','unit_cost'],'edges':E.tolist(),
     'maxflow':float(F),'mincost':float(r.fun),'HiGHS_status':r.message,'LP_flow':r.x.tolist(),
     'max_abs_flow_balance_residual':float(np.max(abs(B@r.x-b))),
     'classroom_augmentation_trace':trace,'classroom_final_flow':flow.tolist(),
     'sink_capacity_upper_bound':6+16+20}
root=Path(__file__).resolve().parent.parent
(root/'原始材料/P21/补充费用流核对.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
