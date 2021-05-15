var btnYes;
var btnNo;
var btnPrv;
var btnNxt;

var txtQuesIndex;
var txtQuestions;
		
var data; 			//json data
var quesArr;		//
var currIndex;		//

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
	txtQuestions.innerHTML = data.Description;
	txtQuesIndex = "0/" + data.Questions.length;
	
	btnYes.disabled = true;
	btnNo.disabled = true;
	btnPrv.disabled = true;
}

window.onload = function()
{
	console.log("loading");
	btnYes = document.getElementById("btnYes");
	btnNo = document.getElementById("btnNo");
	btnPrv = document.getElementById("btnPrv");
	btnNxt = document.getElementById("btnNxt");
		
	var url = "data/data.json"  //json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径
	var request = new XMLHttpRequest();
	request.overrideMimeType("application/json");
	request.open("get", url);   //设置请求方法与路径
	request.send(null);         //不发送数据到服务器
	request.onload = function () {  //XHR对象获取到返回信息后执行
		console.log(request.status);
		if (request.status == 200) //返回状态为200，即为数据获取成功
		{
			data = JSON.parse(request.responseText);
        	console.log(data);
		}
	}
	loadInitPage();
	init();
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
}

function onClickYes()
{
	quesArr[currIndex].result = (true == data.Questions[quesArr[currIndex].index][1] ? 1 : 0);
	
}

function onClickNo()
{
	quesArr[currIndex].result = (false == data.Questions[quesArr[currIndex].index][1] ? 1 : 0);
}

function onClickNext()
{
	currIndex++;
	if (currIndex > quesArr.length) {
		allFinished();
		return;
	}
	txtQuesIndex.innerHTML = currIndex + "/" + quesArr.length;
	txtQuestions.innerHTML = data.Questions[quesArr[currIndex].index][0];
	btnNxt.disabled = (quesArr[currIndex].result == -1 || currIndex > quesArr.length)
}

function onClickPrev()
{
	currIndex--;
	txtQuesIndex.innerHTML = (currIndex + 1) + "/" + quesArr.length;
	txtQuestions.innerHTML = data.Questions[quesArr[currIndex].index][0];
	btnPrv.disabled = (currIndex == 0);
}