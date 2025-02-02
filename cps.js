function BackToIndex(){
    window.location.href='index.html';
}
var clicks = 0;
var StartTime = Date.now()
var flag = false
function AddClick(){
    clicks += 1;
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
    return Math.round((Date.now() - StartTime) / 1000.0);
}
function DisplayTime(){
    document.getElementById("time").innerHTML = "Time used: " + GetNowTime() + "s";
    /*document.getElementById("time").innerHTML = flag;*/
}
function CalcCPS(){
    return Math.round(clicks / GetNowTime())
}
function DisplayCPS(){
    document.getElementById("cps").innerHTML = "CPS: " + CalcCPS();
}
function Refresh(){
    flag = false;
    clicks = 0;
}