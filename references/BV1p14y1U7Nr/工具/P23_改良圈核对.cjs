const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const A=[[0,56,21,35],[56,0,49,39],[21,49,0,77],[35,39,77,0]],cost=p=>p.slice(1).reduce((s,v,i)=>s+A[p[i]-1][v-1],0);
function perm(a){if(!a.length)return[[]];return a.flatMap((v,i)=>perm(a.filter((_,j)=>i!==j)).map(t=>[v,...t]));}
const all=perm([2,3,4]).map(p=>({route:[1,...p,1],cost:cost([1,...p,1])}));assert.equal(Math.min(...all.map(r=>r.cost)),144);
let route=[1,2,3,4,1];const trace=[{route:route.slice(),cost:cost(route)}];
for(let k=0;k<4;k++){let flag=0;for(let i=0;i<=1;i++)for(let j=i+2;j<=3;j++)if(A[route[i]-1][route[j]-1]+A[route[i+1]-1][route[j+1]-1]<A[route[i]-1][route[i+1]-1]+A[route[j]-1][route[j+1]-1]){route.splice(i+1,j-i,...route.slice(i+1,j+1).reverse());flag++;trace.push({route:route.slice(),cost:cost(route)});}if(!flag)break;}
assert.equal(cost(route),144);
const subtours=[[1,3,1],[2,4,2]],assignmentCost=subtours.reduce((s,p)=>s+cost(p),0);assert.equal(assignmentCost,120);
const out={label:'P23画面数据补充重建，非原MATLAB执行',A,fixed_start_enumeration:all,two_opt_trace:trace,global_optimum:144,best_routes:all.filter(r=>r.cost===144),degree_only_bad_solution:{subtours,cost:assignmentCost,violated_SEC_subset:[1,3],internal_edges:2,allowed_at_most:1}};
fs.writeFileSync(path.resolve(__dirname,'../原始材料/P23/补充改良圈核对.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({trace,best:144,degreeOnlyCost:120}));
