"""复用D盘已有SciPy核对LP，非教师MATLAB代码。"""
import json
from pathlib import Path
import numpy as np
import scipy
from scipy.optimize import linprog

root=Path(__file__).resolve().parent.parent
def solve(c,A,b,Aeq=None,beq=None,bounds=None):
    c=np.asarray(c,dtype=float); A=np.asarray(A,dtype=float); b=np.asarray(b,dtype=float)
    result=linprog(c,A_ub=A,b_ub=b,A_eq=Aeq,b_eq=beq,bounds=bounds,method="highs")
    assert result.success, result.message
    slack=b-A@result.x
    eq_res=np.asarray(Aeq)@result.x-np.asarray(beq) if Aeq is not None else np.array([])
    assert np.min(slack)>=-1e-8
    assert eq_res.size==0 or np.max(np.abs(eq_res))<1e-8
    return {"x":result.x.tolist(),"minimized_value":float(result.fun),"original_maximum":float(-result.fun),"status":int(result.status),"message":result.message,"inequality_slack":slack.tolist(),"equality_residual":eq_res.tolist()}

people=solve([-40,-30],[[1,1],[-1,0],[0,-1],[240,120]],[6,-1,-1,1200],bounds=[(0,None),(0,None)])
assert np.allclose(people["x"],[4,2]) and abs(people["original_maximum"]-220)<1e-8
feasible=[(x,y,40*x+30*y) for x in range(1,7) for y in range(1,7) if x+y<=6 and 240*x+120*y<=1200]
integer_best=max(feasible,key=lambda row:row[2])
assert integer_best==(4,2,220)
standard=solve([-2,-3,5],[[-2,5,-1],[1,3,1]],[-10,12],Aeq=[[1,1,1]],beq=[7],bounds=[(0,None)]*3)
report={"execution":"补充SciPy/HiGHS实际求解，未运行教师MATLAB；人员分配为虚构课堂资源分配例题","scipy_version":scipy.__version__,"people_example":people,"integer_enumeration_best":integer_best,"upper_bound_certificate":"40x1+30x2 = 20(x1+x2)+10(2x1+x2) <= 20*6+10*10 = 220; x=(4,2) attains it","standard_form_conversion_example":standard,"investment_parameters_from_visible_table":{"r":[.05,.28,.21,.23,.25],"q":[0,.025,.015,.055,.026],"p":[0,.01,.02,.045,.065],"index_order":["bank","s1","s2","s3","s4"],"budget_M":"P11未指定数值","risk_cap_a":"P11未指定数值","solved":False}}
(root/"原始材料/P11/补充求解核对.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False))
