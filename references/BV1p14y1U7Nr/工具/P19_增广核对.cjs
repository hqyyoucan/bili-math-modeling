const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const E=[[0,1,4,3],[0,3,3,2],[0,4,10,4],[1,2,1,1],[1,3,3,2],[3,2,4,3],[3,5,5,3],[4,3,3,2],[4,5,4,2],[5,2,2,2],[2,6,7,6],[5,6,8,3]];
const initial=E.map(e=>e.slice());
function check(){const net=Array(7).fill(0);for(const[u,v,c,f]of E){assert(f>=0&&f<=c);net[u]+=f;net[v]-=f;}for(let v=1;v<=5;v++)assert.equal(net[v],0);assert.equal(net[0],-net[6]);return net[0];}
const trace=[{value:check(),label:'初始可行流'}];
for(const[P,delta]of [[[0,1,3,2,6],1],[[0,3,5,6],1],[[0,4,3,5,6],1],[[0,4,5,6],2]]){for(let k=1;k<P.length;k++){const e=E.find(e=>e[0]===P[k-1]&&e[1]===P[k]);assert(e&&e[2]-e[3]>=delta);e[3]+=delta;}trace.push({path:P,delta,value:check()});}
assert.equal(check(),14);const S=new Set([0,4]);const cut=E.filter(e=>S.has(e[0])&&!S.has(e[1]));assert.equal(cut.reduce((s,e)=>s+e[2],0),14);
const out={label:'P19画面重建增广序列，补充执行非MATLAB原程序',node_map:{0:'Vs',1:'V1',2:'V2',3:'V3',4:'V4',5:'V5',6:'Vt'},edge_columns:['from','to','capacity','flow'],initial,trace,final:E,cut_source_side:[0,4],cut_edges:cut,cut_capacity:14};
fs.writeFileSync(path.resolve(__dirname,'../原始材料/P19/补充增广核对.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({trace,cut:14}));
