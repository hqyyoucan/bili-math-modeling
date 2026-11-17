// 依据P09 20:13/22:13画面转录的教学数据；四位小数非原Excel全精度。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const raw=[
[2.0026,.1314,8570.4215,.3873],[2.4851,.5207,10010.9500,.0646],[3.8083,1.0598,6531.4920,.3946],
[1.0567,.5465,9701.7243,.3661],[4.5720,.2489,14317.8320,.2277],[4.0028,.2801,3023.5176,.3344],
[1.0031,.4426,3945.4024,.0790],[.9568,.3233,8063.3625,.2320],[.2304,.7162,10154.8692,.2693],
[1.5076,.5642,8557.4999,.0984],[3.3766,.3954,8576.6594,.2995],[4.1820,1.2621,2356.4989,.2967],
[4.4900,.1731,6050.7218,.1070],[2.0127,.8810,1532.6395,.2592],[1.7479,1.1605,888.3450,.2874],
[.1993,.4855,7026.9662,.0479],[.6699,.0513,10860.2069,.3314],[2.8948,.9861,10513.5533,.0844],
[4.4772,1.0699,14504.0803,.1197],[4.9576,.4520,8558.8366,.2152],[.3412,1.2641,14780.3339,.0719],
[3.6927,1.2255,4262.2028,.0297],[2.6963,.8785,11171.6605,.3002],[3.3143,.6666,13895.4314,.2755],
[1.6681,.6343,6511.4414,.1330]];
const shown=[.0272,.0597,.0300,.0343,.0397,.0287,.0444,.0336,.0397,.0553,.0377,.0256,.0390,.0382,.0271,.0447,.0219,.0548,.0501,.0403,.0402,.0431,.0428,.0489,.0527];
const cols=x=>x[0].map((_,j)=>x.map(r=>r[j])),sum=a=>a.reduce((s,x)=>s+x,0),c=cols(raw);
const m1=Math.max(2-Math.min(...c[0]),Math.max(...c[0])-4),m2=Math.max(...c[1].map(x=>Math.abs(x-.7))),maxLate=Math.max(...c[3]);
const y=raw.map(([paper,ratio,money,late])=>[paper<2?1-(2-paper)/m1:paper>4?1-(paper-4)/m1:1,1-Math.abs(ratio-.7)/m2,money,maxLate-late]);
assert(y.flat().every(x=>x>=0));
const yc=cols(y),norms=yc.map(c=>Math.sqrt(sum(c.map(x=>x*x)))),z=y.map(r=>r.map((x,j)=>x/norms[j]));
const p=yc.map(c=>c.map(x=>x/sum(c))),epsilon=1e-5;
const e=p.map(c=>-sum(c.map(v=>{const t=v===0?epsilon:v;return t*Math.log(t);}))/Math.log(raw.length)),d=e.map(v=>1-v),w=d.map(v=>v/sum(d));
function evaluate(metricWeights){const zc=cols(z),best=zc.map(c=>Math.max(...c)),worst=zc.map(c=>Math.min(...c));
 const dp=z.map(r=>Math.sqrt(sum(r.map((x,j)=>metricWeights[j]*(x-best[j])**2)))),dm=z.map(r=>Math.sqrt(sum(r.map((x,j)=>metricWeights[j]*(x-worst[j])**2))));
 const closeness=dp.map((v,i)=>dm[i]/(v+dm[i])),q=closeness.map(x=>x/sum(closeness));
 return {best,worst,d_plus:dp,d_minus:dm,closeness,normalized:q,ranking:q.map((v,i)=>({school_id:i+1,score:v})).sort((a,b)=>b.score-a.score)};
}
const course=evaluate(w),coordinate=evaluate(w.map(v=>v*v));
const error=Math.max(...course.normalized.map((v,i)=>Math.abs(v-shown[i])));
assert(error<.00012,'Transcribed data and course outputs need rechecking');
const result={source:'P09 KF-P09-11-HD and KF-P09-12-HD table, metric formula KF-P09-04-HD/KF-P09-06-HD',source_type:'四位小数视觉转录教学数据，未下载原工作簿，不作真实高校统计',raw,raw_columns:['论文发表数量','师生比','科研经费','逾期毕业率'],school_ids:raw.map((_,i)=>i+1),positive:y,normalization_parameters:{paper_best:[2,4],paper_M:m1,ratio_best:.7,ratio_M:m2,late_max:maxLate},z,p_by_columns:p,entropy_zero_replacement:epsilon,entropy:e,utility:d,weights:w,course_metric_weighted:course,supplement_coordinate_weighted_comparison:coordinate,visible_scores_rounded:shown,visible_scores_sum:sum(shown),max_abs_difference_from_visible_scores:error,execution:'补充JavaScript重建执行，未运行原MATLAB；细小误差含输入和输出的显示舍入'};
fs.writeFileSync(path.join(root,'原始材料/P09/课程数据_视觉转录与数值核对.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({weights:w,maxAbsDifference:error,top5:course.ranking.slice(0,5),bottom:course.ranking.at(-1),coordinateVariantTop5:coordinate.ranking.slice(0,5),visibleScoresSum:sum(shown)}));
