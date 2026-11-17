// 明确标记为补充小例，不是课程Excel/MAT数据。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ys=[0,0,10],mean=ys.reduce((a,b)=>a+b,0)/3,median=0;
const l1=a=>ys.reduce((s,y)=>s+Math.abs(a-y),0),l2=a=>ys.reduce((s,y)=>s+(a-y)**2,0);
assert(l1(median)<l1(mean));assert(l2(mean)<l2(median));
const y=[0,1,2],pred=[10,10,10],ybar=1,sst=y.reduce((s,v)=>s+(v-ybar)**2,0),sse=y.reduce((s,v,i)=>s+(v-pred[i])**2,0),r2=1-sse/sst;assert(r2<0);
const t=Array.from({length:24},(_,i)=>3600*(12*(i+1)-4));assert.equal(t[0],28800);assert.equal(t[23],1022400);
const out={label:'P25补充反例/单位与时间检查，未取得原Excel和MAT数据',loss_non_equivalence:{data:ys,L1_best:median,L2_best:mean,L1_at_median:l1(median),L1_at_mean:l1(mean),L2_at_median:l2(median),L2_at_mean:l2(mean)},rank_counterexample:{independent_functions:['1','x^2'],sample_x:[-1,1],sample_design:[[1,1],[1,1]],rank:1,required_columns:2},negative_R2:{y,pred,SST:sst,SSE:sse,R2:r2},sand_time:{seconds:t,first:t[0],last:t[23],duration:t[23]-t[0]},classroom_q_from_frame_28m10:'约1.8440e11；原始water/sand缺失，未复算、单位须依原表核实'};
fs.writeFileSync(path.resolve(__dirname,'../原始材料/P25/补充拟合条件核对.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({lossL1:median,lossL2:mean,negativeR2:r2,timeRange:[t[0],t[23]]}));
