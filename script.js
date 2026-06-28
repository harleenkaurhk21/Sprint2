let salary =
Number(localStorage.getItem("salary")) || 0;
let expenses =
JSON.parse(localStorage.getItem("expenses")) || [];
let chart;
const form =
document.getElementById("expenseForm");
form.addEventListener("submit",function(e){
e.preventDefault();
let salaryValue =
Number(document.getElementById("salary").value);
let name =
document.getElementById("expenseName").value.trim();
let amount =
Number(document.getElementById("expenseAmount").value);
if(
name === "" ||
salaryValue < 0 ||
amount <= 0
){
showAlert("Please enter valid data");
return;
}
if(salaryValue){
salary = salaryValue;
}
let expense = {
id:Date.now(),
name:name,
amount:amount
};
expenses.push(expense);
saveData();
displayData();
form.reset();
});
function saveData(){
localStorage.setItem(
"salary",
salary
);
localStorage.setItem(
"expenses",
JSON.stringify(expenses)
);
}
function displayData(){
document.getElementById(
"totalSalary"
).innerHTML = salary;
let list =
document.getElementById("expenseList");
list.innerHTML="";
let totalExpense=0;
expenses.forEach(item=>{
totalExpense += item.amount;
let li =
document.createElement("li");
li.innerHTML = `
<span>
${item.name}
-
₹${item.amount}

</span>
<button 
class="delete"
onclick="deleteExpense(${item.id})">

Delete

</button>

`;
list.appendChild(li);
});
let balance =
salary-totalExpense;
document.getElementById(
"balance"
).innerHTML = balance;
updateChart(
totalExpense,
balance
);
checkBalance(balance);
}
function deleteExpense(id){
expenses =
expenses.filter(
item=>item.id !== id
);
saveData();
displayData();
}
function updateChart(expense,balance){
let ctx =
document.getElementById("chart");
if(chart){
chart.destroy();
}
chart =
new Chart(ctx,{

type:"pie",
data:{
labels:[

"Expenses",

"Remaining Balance"

],
datasets:[{
data:[
expense,
balance
]
}]
}
});
}
function checkBalance(balance){
let alert =
document.getElementById("alert");
if(
salary > 0 &&
balance < salary*0.10
){
alert.innerHTML =
"⚠ Warning: Balance is below 10% of salary";
document.getElementById(
"balance"
).style.color="red";
}
else{
alert.innerHTML="";
document.getElementById(
"balance"
).style.color="white";
}
}
function downloadPDF(){
const {jsPDF}=window.jspdf;
let pdf =
new jsPDF();
pdf.text(
"Cash Flow Report",
20,
20
);
let y=40;
expenses.forEach(item=>{
pdf.text(
`${item.name} : ₹${item.amount}`,

20,

y

);
y+=10;
});
pdf.text(
`Remaining Balance : ₹${document.getElementById("balance").innerHTML}`,
20,
y+10

);
pdf.save(
"CashFlow_Report.pdf"
);
}
window.onload=function(){

displayData();

}
