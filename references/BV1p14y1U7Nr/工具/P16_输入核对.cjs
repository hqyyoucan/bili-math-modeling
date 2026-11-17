// 当前讲画面转录后的确定性检查，不执行原MATLAB函数。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const d=[5,9,4,8,14,11],capacity=[30,20];
const sum=a=>a.reduce((s,v)=>s+v,0);
assert.equal(sum(d),51);assert.equal(sum(capacity),50);assert(sum(d)>sum(capacity));
const out={label:'P16画面输入的补充核对，非MATLAB原代码执行',
 heroes:{a:[1.37,9.45,4.43,6.66,3.14,15.92],b:[10.21,9.45,8.88,5,16.44,18],d,
 capacity_in_code:capacity,capacity_in_story:[20,30],total_demand:sum(d),total_capacity:sum(capacity),
 feasibility:'所有等式相加要求总分配51，两个容量不等式相加要求总分配<=50，矛盾。整数/连续均不可行。'},
 aircraft_initial_data:[[150,140,243],[85,85,236],[150,155,220.5],[145,50,159],[130,150,230],[0,0,52]],
 aircraft_data_columns:['x','y','heading_degrees'],
 first_example_classroom_value:9.9218,first_example_global_value_from_P15_proof:9.75,
 classroom_values_are_not_feasibility_certificates:{second:17.0334,heroes:177.7685,aircraft_squared_angle_objective:.0021}};
fs.writeFileSync(path.resolve(__dirname,'../原始材料/P16/输入核对.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out));
