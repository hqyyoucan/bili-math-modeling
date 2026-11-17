// P10两种用途的画面数据重建；不是教师工作簿或MATLAB源文件。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),sum=a=>a.reduce((s,x)=>s+x,0),avg=a=>sum(a)/a.length;
const raw=[[3806,398,850,1352],[3356,455,846,1268],[2750,482,960,1010],[2335,422,900,953],[2061,561,1024,808],[1988,511,1100,763]];
const means=raw[0].map((_,j)=>avg(raw.map(r=>r[j]))),normalized=raw.map(r=>r.map((x,j)=>x/means[j]));
function grade(reference,comparisons,rho=.5){const delta=comparisons.map(c=>c.map((v,t)=>Math.abs(v-reference[t]))),a=Math.min(...delta.flat()),b=Math.max(...delta.flat());
 assert(b>0&&rho>0);
 const coefficients=delta.map(c=>c.map(v=>(a+rho*b)/(v+rho*b))),degrees=coefficients.map(avg);
 assert(coefficients.flat().every(v=>v>0&&v<=1+1e-12));
 return {rho,delta_by_comparison:delta,global_min:a,global_max:b,coefficients_by_comparison:coefficients,degrees};}
const temporal=grade(normalized.map(r=>r[0]),[1,2,3].map(j=>normalized.map(r=>r[j])));
assert(Math.abs(temporal.global_max-.5572)<.00005);
const vendors=[
[.3718,.4031,.4434,.4121,.3897,.4255],[.1639,.5267,0,.6204,.3511,.4331],
[.4094,0,.3131,.4576,.2649,.6744],[0,.2455,.3069,.3682,.7058,.4603],
[.3822,.4777,.2293,.6305,.3822,.1720],[.3986,.5315,.3720,.2392,.3986,.4518],
[.4741,.3414,.5690,.3793,.2845,.3319],[.3954,.2579,.4642,.5158,.3095,.4470],
[.3896,.4254,.4433,.3985,.3672,.4209]];
const reference=vendors.map(r=>Math.max(...r)),comparison=vendors[0].map((_,j)=>vendors.map(r=>r[j])),vendorResult=grade(reference,comparison);
const rank=vendorResult.degrees.map((v,i)=>({vendor:i+1,degree:v})).sort((a,b)=>b.degree-a.degree);
const result={execution:'补充JavaScript数值验证；MATLAB未运行，教学案例不作现实因果或供应商推荐',temporal_source:'KF-P10-06-HD原始Excel表，KF-P10-02-HD差值表',years:[2017,2018,2019,2020,2021,2022],raw,columns:['结婚对数','房价','人均收入','女性失业数'],means,normalized,temporal,temporal_ranking:['房价','人均收入','女性失业数'].map((name,i)=>({name,degree:temporal.degrees[i]})).sort((a,b)=>b.degree-a.degree),vendor_source:'KF-P10-04-HD中的已预处理9×6课件表，非原始供应商数据',vendor_indicator_names:['产品质量','产品价格','地理位置','售后服务','技术水平','经济效益','供应能力','市场影响度','交货情况'],vendor_preprocessed:vendors,vendor_virtual_best:reference,vendor_result:vendorResult,vendor_ranking:rank,limitations:'未取得供应商原始矩阵，不能完整复算末段改换预处理后的.8640等输出；32分钟代码按列标准化9×6矩阵的轴与课件逐指标口径不同，应先核对，不把所有差异归因于GRA本身。'};
fs.writeFileSync(path.join(root,'原始材料/P10/课程数据_视觉转录与数值核对.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({means,a:temporal.global_min,b:temporal.global_max,temporalRanking:result.temporal_ranking,vendorRanking:rank}));
