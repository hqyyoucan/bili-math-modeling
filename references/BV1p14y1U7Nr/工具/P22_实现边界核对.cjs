// 只重建画面相关规则，用显式补充小例验证其一般性，不是原.m运行。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
function floyd(n,edges){const D=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?0:Infinity)),K=Array.from({length:n},()=>Array(n).fill(-1));for(const[u,v,w]of edges)D[u-1][v-1]=w;for(let k=0;k<n;k++)for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(D[i][k]+D[k][j]<D[i][j]){D[i][j]=D[i][k]+D[k][j];K[i][j]=k;}return{D,K};}
function naive(K,s,t){const p=[t+1];let j=t;for(let z=0;K[s][j]!==-1&&z<K.length;z++){j=K[s][j];p.push(j+1);}return[s+1,...p.reverse()];}
const direct=floyd(2,[[1,2,5]]),pd=naive(direct.K,0,1);assert.equal(pd.length,2);assert(Number.isFinite(direct.D[0][1]));
const e=[[1,3,1],[3,2,1],[2,4,1]],nested=floyd(4,e),bad=naive(nested.K,0,3);
function expand(K,i,j){const k=K[i][j];if(k===-1)return[i+1,j+1];const a=expand(K,i,k),b=expand(K,k,j);return[...a,...b.slice(1)];}
const good=expand(nested.K,0,3);assert.deepEqual(bad,[1,3,4]);assert.deepEqual(good,[1,3,2,4]);assert.equal(nested.D[0][3],3);
const reverse={original_edge:[2,4],original_capacity:1,original_flow:1,correct_reverse_residual:1,if_only_cost_is_negated_but_c_reverse_and_x_reverse_stay_zero:0};
const out={label:'P22画面规则的补充小反例，不是课程原数据',direct_path:{path:pd,distance:5,wrong_stop_rule:'length==2 falsely signals unreachable'},intermediate_matrix_recovery:{edges:e,naive_path:bad,correct_recursive_path:good,distance:3,naive_contains_nonexistent_edge:[3,4]},reverse_capacity:reverse};
fs.writeFileSync(path.resolve(__dirname,'../原始材料/P22/补充实现边界.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));
