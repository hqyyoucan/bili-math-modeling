"""按P05画面重建的NumPy计算，用于核对，不是教师原始源码。"""
import json
from pathlib import Path
import numpy as np

root=Path(__file__).resolve().parent.parent
folder=root/"原始材料/P05"
data=json.loads((folder/"课程矩阵_视觉转录与核对.json").read_text(encoding="utf-8"))
R=np.asarray(data["R"],dtype=float)
weights=[np.asarray(w,dtype=float) for w in data["group_weights"]]
top=np.asarray(data["top_weights"],dtype=float)
cuts=data["cuts_zero_based"]

# M03-S02-B：分组边界必须完整覆盖所有行，各组与自己的权重对应。
assert cuts[0]==0 and cuts[-1]==R.shape[0]
assert all(a<b for a,b in zip(cuts,cuts[1:]))
assert len(weights)==len(cuts)-1==top.size
assert R.shape==(18,5) and np.all((0<=R)&(R<=1))
assert np.allclose(R.sum(axis=1),1)
assert np.allclose(top.sum(),1) and np.all(top>=0)
groups=[]
for i,w in enumerate(weights):
    block=R[cuts[i]:cuts[i+1],:]
    assert w.shape==(block.shape[0],) and np.all(w>=0)
    assert np.allclose(w.sum(),1)
    # M03-S05-B-F1：每组内先合成；@是矩阵乘法。
    groups.append(w @ block)

# M03-S05-B-F2：各组结果作为行，不是作为列。
upper=np.stack(groups,axis=0)
result=top @ upper
expected=np.array([.2880,.3540,.2355,.0865,.0360])
assert np.allclose(result,expected,atol=1e-12,rtol=0)
assert np.allclose(result.sum(),1)
winner=int(np.argmax(result))
report={"implementation":"根据P05清晰画面重建的NumPy代码，非教师原文件；本次实际执行结果", "numpy_version":np.__version__, "group_results":upper.tolist(),"result":result.tolist(),"sum":float(result.sum()),"max_abs_difference_from_visible_result":float(np.max(np.abs(result-expected))),"grade":data["grade_order"][winner],"formula_ids":["M03-S05-B-F1","M03-S05-B-F2","M03-S06"]}
# 末段工具语义补充：两个二维列向量*可算，但@内维不符应报错。
col1=np.array([[1.],[2.]])
col2=np.array([[3.],[4.]])
try:
    col1 @ col2
except ValueError:
    invalid_matmul_rejected=True
else:
    invalid_matmul_rejected=False
assert invalid_matmul_rejected
report["supplemental_operator_example"]={"inputs":[col1.tolist(),col2.tolist()],"elementwise_multiply":(col1*col2).tolist(),"invalid_column_matmul_rejected":invalid_matmul_rejected,"row_times_column":(col1.T@col2).tolist(),"one_dimensional_inner_product":float(col1.ravel()@col2.ravel())}
(folder/"NumPy重建执行结果.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False))
