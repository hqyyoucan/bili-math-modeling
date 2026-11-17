"""P26已读公式的补充数值重建，未执行MATLAB。"""
import json
from pathlib import Path
import numpy as np
from scipy.integrate import solve_ivp
t=np.linspace(np.pi,2*np.pi,201)
res=solve_ivp(lambda x,z:[z[1],-z[0]-np.sin(2*x)],[np.pi,2*np.pi],[1,1],t_eval=t,rtol=1e-10,atol=1e-12)
exact=-np.cos(t)-np.sin(t)/3+np.sin(2*t)/3
err=float(np.max(abs(res.y[0]-exact)));assert res.success and err<1e-8
r=.02735;K=342.4;x0=3.9
lp=solve_ivp(lambda t,z:r*z*(1-z/K),[0,200],[x0],t_eval=np.linspace(0,200,201),rtol=1e-10,atol=1e-12)
lex=K/(1+(K/x0-1)*np.exp(-r*lp.t));le=float(np.max(abs(lp.y[0]-lex)));assert le<1e-6
# r,d来自口述；a,b由画面中心(25,10)与r=1,d=.5推回，标记为重建参数。
rr=1.;dd=.5;aa=.1;bb=.02
def lv(t,z):
    x,y=z[:2];return [(rr-aa*y)*x,(-dd+bb*x)*y,x,y]
def event(t,z):return z[1]-rr/aa
event.direction=1;event.terminal=False
sol=solve_ivp(lv,[0,45],[10,2,0,0],rtol=1e-10,atol=1e-12,events=event)
assert sol.success and np.min(sol.y[:2])>0 and len(sol.t_events[0])>=2
H=bb*sol.y[0]-dd*np.log(sol.y[0])+aa*sol.y[1]-rr*np.log(sol.y[1])
z1,z2=sol.y_events[0][-2:];t1,t2=sol.t_events[0][-2:]
means=(z2[2:]-z1[2:])/(t2-t1)
assert np.max(abs(means-[25,10]))<1e-6
out={'label':__doc__,'forced_oscillator':{'equation':'y2prime+y+sin(2x)=0','interval':[float(np.pi),float(2*np.pi)],'initial':[1,1],'analytic':'-cos(x)-sin(x)/3+sin(2x)/3','max_abs_error':err,'endpoint_y':float(res.y[0,-1])},
 'logistic':{'r':r,'K':K,'x0':x0,'time':'补充相对时间0..200，未假定历年基准，不是2010人口预测','max_abs_error':le},
 'predator_prey':{'parameter_origin':'r=1,d=.5口述；a=.1,b=.02由画面平衡点(25,10)重建','initial':[10,2],'equilibrium':[25,10],'H_max_drift':float(np.max(abs(H-H[0]))),'last_full_period':float(t2-t1),'time_means':means.tolist()},
 'symbolic_initial_variants':{'equation':'y2prime+4*yprime+29*y=0,y(0)=0','header_yprime0_15':'3*exp(-2*x)*sin(5*x)','code_yprime0_1':'exp(-2*x)*sin(5*x)/5'}}
root=Path(__file__).resolve().parent.parent
(root/'原始材料/P26/补充微分方程核对.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
