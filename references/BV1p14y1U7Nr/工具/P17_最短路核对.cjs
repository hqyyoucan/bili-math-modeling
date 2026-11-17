// 依据P17图像重建；非课程原代码。用Floyd独立核对Dijkstra距离。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const edges=[[0,1,4],[0,7,8],[1,2,8],[1,7,3],[2,3,7],[2,8,2],[2,5,4],[3,4,9],[3,5,14],[4,5,10],[5,6,2],[6,7,6],[6,8,6],[7,8,1]];
const n=9,W=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?0:Infinity));
for(const [i,j,w]of edges)W[i][j]=W[j][i]=w;
const d=Array(n).fill(Infinity),pre=Array(n).fill(-1),done=Array(n).fill(false),trace=[];d[0]=0;
for(let k=0;k<n;k++){let u=-1;for(let v=0;v<n;v++)if(!done[v]&&(u<0||d[v]<d[u]))u=v;if(u<0||!Number.isFinite(d[u]))break;done[u]=true;for(let v=0;v<n;v++)if(!done[v]&&d[u]+W[u][v]<d[v]){d[v]=d[u]+W[u][v];pre[v]=u;}trace.push({settled:u,distance:d.slice(),pre:pre.slice()});}
const F=W.map(r=>r.slice());for(let k=0;k<n;k++)for(let i=0;i<n;i++)for(let j=0;j<n;j++)F[i][j]=Math.min(F[i][j],F[i][k]+F[k][j]);
assert.deepEqual(d,F[0]);assert.deepEqual(d,[0,4,10,17,24,14,13,7,8]);
const route=[];for(let v=4;v!==-1;v=pre[v])route.push(v);route.reverse();
assert.deepEqual(route,[0,1,7,8,2,5,4]);
const out={label:'P17图像数据的补充重建',edges_undirected:edges,distance:d,pre,path_0_to_4:route,path_cost:24,trace,verified_with:'Floyd全源距离',negative_directed_counterexample:{edges:[[1,2,2],[1,3,3],[3,2,-2]],shortest_1_to_2:[1,3,2],cost:1}};
fs.writeFileSync(path.resolve(__dirname,'../原始材料/P17/补充最短路核对.json'),JSON.stringify(out,(_,v)=>v===Infinity?'Inf':v,2)+'\n');console.log(JSON.stringify({distance:d,pre,route,cost:24}));
