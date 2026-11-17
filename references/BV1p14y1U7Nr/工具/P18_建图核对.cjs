const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const C=[[0,15,10,20,0,0,0,0],[0,0,0,0,7,10,0,0],[0,0,0,0,0,8,2,0],[0,0,0,0,0,0,18,0],[0,0,0,0,0,0,0,6],[0,0,0,0,0,0,0,16],[0,0,0,0,0,0,0,20],[0,0,0,0,0,0,0,0]];
const D=C.map((r,i)=>r.map((v,j)=>i===j?0:v===0?Infinity:v));for(let k=0;k<8;k++)for(let i=0;i<8;i++)for(let j=0;j<8;j++)D[i][j]=Math.min(D[i][j],D[i][k]+D[k][j]);assert.equal(D[0][4],22);
const A=[[0,4,Infinity,Infinity],[0,2,8,Infinity],[0,0,3,7],[0,0,0,0]];
const B=A.map((r,i)=>r.map((v,j)=>i===j?v:v+A[j][i]));
assert.deepEqual(B.map((r,i)=>r[i]),[0,2,3,0]);assert.equal(4+8+7,19);
const out={label:'P18画面重建的补充运算，未执行MATLAB',directed_adjacency_zero_means_no_edge:C,path_1_to_5:[1,2,5],distance_1_to_5:22,upper_triangle:A,symmetrized_preserving_diagonal:B,path_first_four_nodes:[1,2,3,4],distance_first_four_nodes:19,original_nine_node_path_mapped_to_MATLAB:[1,2,8,9,3,6,5]};
fs.writeFileSync(path.resolve(__dirname,'../原始材料/P18/补充建图核对.json'),JSON.stringify(out,(_,v)=>v===Infinity?'Inf':v,2)+'\n');console.log(JSON.stringify({directedCost:22,subgraphCost:19,diagonal:B.map((r,i)=>r[i])}));
