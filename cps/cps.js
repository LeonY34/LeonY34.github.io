function BackToIndex(){
    window.location.href='../index.html';
}
var clicks = 0;
var StartTime = Date.now()
var flag = false
var CurTime = Date.now()
var st = []
function AddClick(){
    clicks += 1;
    st.push(Date.now())
    if (flag == false){
        StartCounting();
        flag = true;
    }
}
function DisplayClicks(){
    document.getElementById("clicks").innerHTML = clicks + " clicks";
}
function StartCounting(){
    StartTime = Date.now();
}
function GetNowTime(){
    if (flag == false) return 0;
    return (Date.now() - StartTime) / 1000.0;
}
function DisplayTime(){
    document.getElementById("time").innerHTML = "Time used: " + Math.round(GetNowTime()) + "s";
    /*document.getElementById("time").innerHTML = flag;*/
}
function CalcCPS(){
    return Math.round(clicks / GetNowTime())
}
function DisplayCPS(){
    document.getElementById("cps").innerHTML = "CPS: " + CalcCPS();
}
function CalcCurrentCPS(){
    while (st.length > 0 && Date.now() - st[0] > 1000){
        st.shift();
    }
    return st.length;
}
function DisplayCurrentCPS(){
    document.getElementById("curcps").innerHTML = "CurrentCPS: " + CalcCurrentCPS();
}
function Refresh(){
    flag = false;
    clicks = 0;
}