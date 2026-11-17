// P08画面例题的补充数值验证，不是教师程序或真实高校统计。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),names=['北大','清华','上交','浙大'];
const raw=[[99,.010],[100,.012],[98,.040],[97,.033]],y=raw.map(([a,b])=>[a,.04-b]);
const sum=a=>a.reduce((s,x)=>s+x,0),cols=x=>x[0].map((_,j)=>x.map(r=>r[j]));
const norms=cols(y).map(c=>Math.sqrt(sum(c.map(x=>x*x)))),z=y.map(r=>r.map((x,j)=>x/norms[j]));
function topsis(v){const c=cols(v),best=c.map(c=>Math.max(...c)),worst=c.map(c=>Math.min(...c));
 const dp=v.map(r=>Math.sqrt(sum(r.map((x,j)=>(x-best[j])**2)))),dm=v.map(r=>Math.sqrt(sum(r.map((x,j)=>(x-worst[j])**2))));
 const s=dp.map((d,i)=>dm[i]/(d+dm[i])),normalized=s.map(x=>x/sum(s));
 assert(s.every(x=>x>=0&&x<=1));assert(Math.abs(sum(normalized)-1)<1e-12);
 return {best,worst,d_plus:dp,d_minus:dm,closeness:s,sum:sum(s),normalized,ranking:names.toSorted((a,b)=>s[names.indexOf(b)]-s[names.indexOf(a)])};}
const unweighted=topsis(z),scaled=topsis(z.map(r=>r.map(x=>x/2)));
assert(unweighted.closeness.every((x,i)=>Math.abs(x-scaled.closeness[i])<1e-12));
const result={source:'P08 KF-P08-03-HD and 04-HD, illustrative course data only',execution:'Supplemental JavaScript reconstruction, not original MATLAB execution',names,raw,positive:y,z,unweighted,single_funding_minmax:raw.map(r=>(r[0]-97)/3),slide_funding_scores:[.6667,1,0,.3333],table_note:'表中上交与浙大经费单列打分疑似互换；正确值应1/3与0，标准化值本身与原数据一致。',same_scale_equal_weight_equivalence_verified:true,weight_placement_example:{weights:[.2,.8],coordinate_scaled_effective_squared_weights:[.04,.64],metric_weighted_effective_weights:[.2,.8],note:'两个公式一般不同，除非将坐标乘sqrt(w)才与根号内乘w等价；此为补充代数说明。'}};
fs.writeFileSync(path.join(root,'原始材料/P08/补充数值核对.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({scores:unweighted.closeness,normalized:unweighted.normalized,ranking:unweighted.ranking,fundingScores:result.single_funding_minmax}));
