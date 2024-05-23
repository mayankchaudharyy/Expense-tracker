const ctx = document.getElementById("myChart").getContext('2d');
let delayed;
let gradeint = ctx.createLinearGradient(0,0,0,400);
gradeint.addColorStop(0, 'rgba(58,123,213,1)');
gradeint.addColorStop(1, 'rgba(0,210,255,0.3)');
// Chart.defaults.global.defaultFontColor = "#fff";
Chart.defaults.color = "#fff";

const labels = [
];
// const labels = [
//     'Income',
//     'Expense',
//     'Income',
//     'Expense',
//     'Income',
//     'Expense',
//     'Income',
//     'Expense',
//     'Income',
//     'Expense',
// ]; [500,250,400,200,500,450,800,400,600,415]

const data = {
    labels,
    datasets:[{
        data:[],
        label: "Wallet Balance",
        fill:true,
        backgroundColor: gradeint,
        borderColor: "#3775C1",
        pointBackgroundColor: "#fff",
        tension:0.2,
    },
],
};


const config = {
    type: 'line',
    data:data,
    options: {
        radius:5,
        hitRadius:30,
        hoverRadius: 12,
        animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales:{
            y:{
                ticks: {
                    callback: function(value){
                        return value + " ₹";
                    },
                },
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    fontFamily: "Josefin Sans",
                }
            },
        }
    },
};

const myChart = new Chart(ctx, config);

// --------------------------------------------------------

// 1:['i',head,price,time]

let trans_btn = document.querySelector(".add-transaction");
let no_of_transaction = 0;
let my_price = 0;
let del_btn = document.querySelector(".del-btn");


del_btn.addEventListener("click", ()=>{
    localStorage.clear();
    window.location.reload();
})


trans_btn.addEventListener('click',()=>{
    let type_trans = document.querySelector("#type-of").value;
    let reason = document.querySelector(".reason").value;
    let price = document.querySelector("#real-money").value;
    console.log(type_trans);
    if(type_trans === "none"){
        alert("Please Select Expense or Income");
        return;
    }
    if(reason === "" || price === ""){
        return;
    }
    if (reason.trim() === "") {
        alert("Enter Valid Reason");
        return;
    }
    make_transaction_history(type_trans, reason, price, true, "no time");
    update_transaction(type_trans, price);
})


function make_transaction_history(tt,r,p,btn_pressed,my_time) {
    // let date = document.querySelector(".date").value;
    // let time = document.querySelector(".time").value;
    if(tt === 'Income'){
        let main = document.querySelector("#history-id");
        let ele = document.querySelector(".history-trans-plus");
        let clone = ele.cloneNode(true);
        clone.querySelector(".added-transaction").innerText = p;
        clone.querySelector(".specific").innerText = r;
        if(btn_pressed === false){
            clone.querySelector(".time").innerText = my_time;
        }else{
            let date = make_date();
            clone.querySelector(".time").innerText = date;
            let val = ['Income',r,p,date];
            no_of_transaction += 1;
            localStorage.setItem(`${no_of_transaction}`,val);
        }
        clone.classList.remove("hidden");
        main.prepend(clone);
    }else{
        let main = document.querySelector("#history-id");
        let ele = document.querySelector(".history-trans-neg");
        let clone = ele.cloneNode(true);
        clone.querySelector(".added-transaction").innerText = p;
        clone.querySelector(".specific").innerText = r;
        if(btn_pressed === false){
            clone.querySelector(".time").innerText = my_time;
        }else{
            let date = make_date();
            clone.querySelector(".time").innerText = date;
            let val = ['Expense',r,p,date];
            no_of_transaction += 1;
            localStorage.setItem(`${no_of_transaction}`,val);
        }
        clone.classList.remove("hidden");
        main.prepend(clone);
    }
}



function make_date(){
    let tm = new Date();
    console.log(tm.getDate());
    tm = tm.toString();
    tm = tm.split(" ");
    let date = tm[2] + "." + tm[1] + "." + tm[3];
    let time = tm[4];
    tm = date + " | " + time;
    return tm;
}

function make_history(){
    let k = localStorage.length;
    for(i = 1; i <= k; i++){
        let val = breakThem(localStorage.getItem(i));
        console.log(val);
        no_of_transaction += 1;
        let type_trans = val[0];
        let reason = val[1];
        let price = val[2];
        let time = val[3];
        make_transaction_history(type_trans, reason, price, false, time);
        update_transaction(type_trans, price);
    }
}

function breakThem(val) {
    val = val.split(",");
    return val;
}


function update_transaction(type_trans, price) {
    let wallet = document.querySelector(".wallet-balance");
    let tt = type_trans;
    let ww = Number(wallet.innerText);
    let income_ = document.querySelector(".total-green-money");
    let expense_ =document.querySelector(".total-red-money");
    price = Number(price);
    if(tt === "Income"){
        ww += price;
        let income_no = Number(income_.innerText);
        income_no += price;
        wallet.innerText = ww;
        income_.innerText = income_no;
        addData(myChart, "Income", ww);
    }else{
        ww -= price;
        let expense_no = Number(expense_.innerText);
        expense_no += price;
        wallet.innerText = ww;
        expense_.innerText = expense_no;
        addData(myChart, "Expense", ww);
    }
    if(ww < 0){
        let debt = document.querySelector(".debt");
        debt.innerText = " and You Are In Debt."
    }else{
        let debt = document.querySelector(".debt");
        debt.innerText = "";
    }
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

make_history();