// 依据P07画面核对MATLAB算法的数值含义，不执行或冒充原.m文件。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),p06=JSON.parse(fs.readFileSync(path.join(root,'原始材料/P06/补充数值核对.json')));
const sum=a=>a.reduce((s,x)=>s+x,0),route=p06.interval_consistent_route;
const original=route.p_by_columns,epsilon=1e-5;
const replaced=original.map(c=>c.map(p=>p===0?epsilon:p));
const entropy=replaced.map(c=>-sum(c.map(p=>p*Math.log(p)))/Math.log(5));
const d=entropy.map(e=>1-e),w=d.map(v=>v/sum(d));
const shown=[.2329,.4742,.1911,.0113,.0906];
const max=Math.max(...w.map((v,i)=>Math.abs(v-shown[i])));assert(max<.000051);
const badInput=[-1,1],low=-1,high=1;
const bad=badInput.map(x=>x-low/(high-low));
const corrected=badInput.map(x=>(x-low)/(high-low));
assert(bad[0]<0&&corrected[0]===0&&corrected[1]===1);
const report={execution:'按P07清晰代码重建的补充JavaScript验证，MATLAB未执行',epsilon_in_visible_code:epsilon,epsilon_note:'字幕口述识别为0.0001，以14:13代码可读值0.00001为准',p_column_sums_after_replacement:replaced.map(sum),entropy,utility:d,weights_with_course_zero_replacement:w,visible_4decimal_weights:shown,max_abs_difference_from_visible_rounding:max,exact_limit_weights:route.weights,max_abs_weight_change_due_to_epsilon:Math.max(...w.map((v,i)=>Math.abs(v-route.weights[i]))),negative_branch:{visible_expression:'X - repmat(min_X,n,1) ./ (repmat(max_X,n,1)-repmat(min_X,n,1))',intended_correct_expression:'(X - repmat(min_X,n,1)) ./ (repmat(max_X,n,1)-repmat(min_X,n,1))',input:badInput,visible_expression_output:bad,corrected_output:corrected}};
fs.writeFileSync(path.join(root,'原始材料/P07/补充数值核对.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
