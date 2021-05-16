var btnYes;
var btnNo;
var btnPrv;
var btnNxt;

var txtQuesIndex;
var txtQuestions;
		
var data; 			//json data
var quesArr;		//
var currIndex;		//

var request = new XMLHttpRequest();
request.open("get", "data/data.json");
request.send(null);
request.onload = function () {
	if (request.status == 200)
	{
		data = JSON.parse(request.responseText);
		console.log(data);

	}
}

/* **题目计分方法**
定义题目数组，如下：
ques = {               //均为int
	"index"  : index   //存放data["Questions"]中的题号
	"type"   : type    //存放data["Types"]中的类型，与题对应
	"result" : result  //只有0或1或-1三个值，0和1表示回答是否计分，-1表示未回答
}
然后使用Array对象把题包裹起来
quesArr[i] = [
	{ ... },
	...
];  //注意题目要打乱顺序

最后，创建一个Array对象score[6]，分别计分
score[quesArr[i].type] += quesArr[i].result;
*/

function debug()
{
	alert("debug");
	//document.getElementById("txtQuesIndex").innerHTML = "0/0";
}

function randIntArray(length)
{
	/*
	* @function  生成0~length-1的数组，随机排序
	* @para(int) 指定数组的长度
	* @return    返回已打乱顺序的数组
	*/
	var arr = new Array; 
	//给原数组arr赋值 
	for (var i = 0; i < length; i++){ 
    	arr[i] = i; 
	} 
	arr.sort(
		function() { return 0.5 - Math.random(); }
	); 
	return arr;
} 

window.onload = function()
{
	console.log("loading");
	btnYes = document.getElementById("btnYes");
	btnNo = document.getElementById("btnNo");
	btnPrv = document.getElementById("btnPrv");
	btnNxt = document.getElementById("btnNxt");
	
	txtQuesIndex = document.getElementById("txtQuesIndex");
	txtQuestions = document.getElementById("txtQuestions");

	console.log(data);
	loadInitPage();
	init();
}

function init()
{
	quesArr = new Array;
	var indexArr = randIntArray(data.Questions.length);
	for (var i = 0; i < indexArr.length; i++)
	{
		quesArr[i] = {
			"index"  : indexArr[i],
			"type"   : data.Questions[indexArr[i]][2],
			"result" : -1
		};
		
	}
	currIndex = -1;
}

function loadInitPage()
{
	console.log(data.Description.Begin);
	txtQuestions.innerHTML = data.Description.Begin;
	txtQuesIndex.innerHTML = "0/" + data.Questions.length;
	
	btnYes.disabled = true;
	btnNo.disabled = true;
	btnPrv.disabled = true;

	document.getElementById("divResult").style.visibility = "hidden";
}

function allFinished()
{
	btnPrv.disabled = true;
	btnNxt.disabled = true;
	btnYes.disabled = true;
	btnNo.disabled  = true;
	var score = [ 0, 0, 0, 0, 0, 0 ];
	for (var i = 0; i < quesArr.length; i++) {
		score[quesArr[i].type] += quesArr[i].result;
	}
	console.log(score);
	txtQuestions.innerHTML = data.Description.Finish;
	document.getElementById("divResult").style.visibility = "visible";
}

function onClickYes()
{
	quesArr[currIndex].result = (true == data.Questions[quesArr[currIndex].index][1] ? 1 : 0);
	btnNxt.disabled = false;
	console.log("quesArr["+ currIndex + "].result = " + quesArr[currIndex].result);
}

function onClickNo()
{
	quesArr[currIndex].result = (false == data.Questions[quesArr[currIndex].index][1] ? 1 : 0);
	btnNxt.disabled = false;
	console.log("quesArr["+ currIndex + "].result = " + quesArr[currIndex].result);
}

function onClickNext()
{
	currIndex++;

	if (currIndex + 1 > quesArr.length) {
		//题目全答完以后触发结算
		allFinished();
		return;
	}

	btnNo.disabled = (currIndex < 0);
	btnYes.disabled = (currIndex < 0);
	btnPrv.disabled = (currIndex <= 0);

	//修改题号和描述
	txtQuesIndex.innerHTML = (currIndex + 1) + "/" + quesArr.length;
	txtQuestions.innerHTML = data.Questions[quesArr[currIndex].index][0];

	//当前题目未回答则禁用下一题按钮
	btnNxt.disabled = (quesArr[currIndex].result == -1 || currIndex > quesArr.length);
}

function onClickPrev()
{
	currIndex--;

	//修改题号和描述
	txtQuesIndex.innerHTML = (currIndex + 1) + "/" + quesArr.length;
	txtQuestions.innerHTML = data.Questions[quesArr[currIndex].index][0];

	//重新启用下一题按钮
	btnNxt.disabled = false;
	//如果当前是第一题，禁用上一题按钮
	btnPrv.disabled = (currIndex == 0);
}