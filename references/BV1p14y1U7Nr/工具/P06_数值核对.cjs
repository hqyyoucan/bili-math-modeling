// 补充数值验证，按P06清晰表格重建；不是教师源码。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const raw=[[24,180,60,90,5000],[23,175,90,85,10000],[23,170,95,92,8000],[24,185,81,100,5500],[25,190,79,60,2000]];
const cols=a=>a[0].map((_,j)=>a.map(r=>r[j]));const sum=a=>a.reduce((s,x)=>s+x,0);
const entropy=p=>-sum(p.map(x=>x===0?0:x*Math.log(x)))/Math.log(p.length);
function route(interval){
 const y=raw.map(([age,height,appearance,education,income])=>[25-age,1-Math.abs(height-180)/10,interval?(appearance<80?1-(80-appearance)/20:appearance>90?1-(appearance-90)/20:1):appearance,education,income]);
 const c=cols(y),zcols=c.map(c=>{const d=Math.sqrt(sum(c.map(v=>v*v)));return c.map(v=>v/d);});
 const p=c.map(c=>c.map(v=>v/sum(c))),e=p.map(entropy),d=e.map(x=>1-x),w=d.map(x=>x/sum(d));
 const cv=c.map(c=>{const avg=sum(c)/c.length;return Math.sqrt(sum(c.map(x=>(x-avg)**2))/c.length)/avg;});
 for(let j=0;j<c.length;j++){
  assert(Math.abs(sum(p[j])-1)<1e-12);
  const fromz=zcols[j].map(v=>v/sum(zcols[j]));assert(fromz.every((v,i)=>Math.abs(v-p[j][i])<1e-12));
 }
 return {direction_handling:interval?'长相按[80,90]正向化的补充一致路线':'按课件08:40表的数值重建：年龄/身高正向化，长相仍用原分',y,z:y.map((_,i)=>zcols.map(c=>c[i])),p_by_columns:p,entropy:e,utility:d,weights:w,cv_weights:cv.map(x=>x/sum(cv))};
}
const slide=route(false),consistent=route(true);
const shown=[[.3162,.8165,.3277,.4654,.3346],[.6325,.4082,.4915,.4396,.6693],[.6325,0,.5188,.4758,.5354],[.3162,.4082,.4424,.5172,.3681],[0,0,.4314,.3103,.1339]];
const error=Math.max(...slide.z.flatMap((r,i)=>r.map((v,j)=>Math.abs(v-shown[i][j]))));
assert(error<.000051);
const jailCost=[1,0,0,0,0],jailPositive=jailCost.map(x=>1-x),jailP=jailPositive.map(x=>x/sum(jailPositive));
const result={source:'P06 KF-P06-05-HD raw table and KF-P06-06-HD normalized table',execution:'补充JavaScript数值核对；未运行课程MATLAB，未把重建权重当作课堂宣布结果',raw,raw_columns:['年龄','身高','长相','学历成绩','收入'],slide_table_route:slide,interval_consistent_route:consistent,max_abs_error_matching_slide_4decimals:error,jail_example:{raw_cost:jailCost,correct_positive:jailPositive,entropy:entropy(jailP),utility:1-entropy(jailP),note:'这是差异系数，不是最终权重；最终权重还需其他列的差异系数。若错误保留原负向指标，p集中于单点，e=0,d=1，结论完全不同。'},equal_positive_column:{entropy:entropy([.2,.2,.2,.2,.2]),utility:0}};
fs.writeFileSync(path.join(root,'原始材料/P06/补充数值核对.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({slideTableMaxError:error,slideRouteWeights:slide.weights,intervalRouteWeights:consistent.weights,jail:result.jail_example,cvWeights:slide.cv_weights}));
