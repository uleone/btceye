$(function(){
	$("body").on('mouseup', infoPopup);
	$("body").on('mousedown', function(e){
		$("#btceye-pop").remove();
	});
});

function infoPopup(e){
    var selection = window.getSelection();
    var addr = selection && (selection.toString() || '').trim();
    var addrReg=/\b[13][1-9A-HJ-NP-Za-km-z]{26,33}\b/g;
	if (addrReg.test(addr)) {
		var _width = 250;
		$("body").after('<div id="btceye-pop" style="position:absolute;width:'+_width+'px; line-height:1.5em;z-index:100; color:black; font-size:12px;">'+
							'<div id="btceye-pop-texture" style="height:15px;background-color:#a1a1a1;border:1px solid #a1a1a1;  border-radius:2px 2px 0 0;box-shadow: 0 1px 2px rgba(0, 0, 0, .4);">'+
								'<span id="btceye-pop-title" style="float:left; color:white; margin:0 0 0 10px;">Btc Eye</span>'+
								'<div id="btceye-pop-close" style="float:right; margin:1px 1px 0 0; width:15px; height:15px; background:url('+chrome.extension.getURL("img/close.png")+');background-position:-5px -3px; cursor:pointer;"></div>'+
							'</div>'+
							'<div id="btceye-pop-content" style="padding:5px 10px 10px 10px; border-radius:0 0 3px 3px; border:1px solid #ddd; border-top:none; background:white; box-shadow: 0 1px 2px rgba(0, 0, 0, .3); color:black;">Searching...</div>'+
							'</div>');
		var tableStr='<table id="detailTable" style="width:100%; border:0px; color:black; font-size:12px; text-align:left; font-weight:normal;">'+
		    '<tr><td style="border:0px; border-top: 1px solid #ddd;">总交易数</td><td id="n_tx" style="border:0px; border-top: 1px solid #ddd;">waiting</td></tr>'+
		    '<tr><td style="border:0px; border-top: 1px solid #ddd;">收款总额</td><td id="total_received" style="border:0px; border-top: 1px solid #ddd;">waiting</td></tr>'+
		    '<tr><td style="border:0px; border-top: 1px solid #ddd;">发款总额</td><td id="total_sent" style="border:0px; border-top: 1px solid #ddd;">waiting</td></tr>'+
		    '<tr><td style="border:0px; border-top: 1px solid #ddd;">余额</td><td id="final_balance" style="border:0px; border-top: 1px solid #ddd;">waiting</td></tr>'+
		    '<tr><td></td><td><a id="moreLink" style="float:right" href="https://blockchain.info/address/'+addr+'" target="_blank">详细..</a></td></tr>'+
		  '</table>';
		$("#btceye-pop-content").html(tableStr);
	  	$("#btceye-pop-close").click(function(){
			$("#btceye-pop").remove();
		}).hover(function(){
			$(this).css({"background-position":"-5px -19px"});
		},function(){
			$(this).css({"background-position":"-5px -3px"});
		});
		//Set position
		var _popHeight = $("#btceye-pop").height(); 
		var _popWidth = $("#btceye-pop").width(); 
		if(e.clientY<_popHeight+10){
			$("#btceye-pop").css({"left":e.pageX-_popWidth/2+"px","top":e.pageY+13+"px"});
			$("#btceye-pop").prepend('<div id="btceye-poparrow-w" style="margin:0 0 -1px 0; position:relative; height:7px;"><div id="btceye-poparrow" style="width:14px; height:7px; background:url('+chrome.extension.getURL("img/uparrow.png")+'); left:50%; margin-left:-7px; position:absolute; z-index:100"></div></div>');
		}
		else{
			$("#btceye-pop").css({"left":e.pageX-_popWidth/2+"px","top":e.pageY-_popHeight-17+"px"});
			$("#btceye-pop").append('<div id="btceye-poparrow-w" style="margin:-2px 0 0 0; position:relative; height:7px;"><div id="btceye-poparrow" style="width:14px; height:7px; background:url('+chrome.extension.getURL("img/downarrow.png")+'); left:50%; margin-left:-7px; position:absolute; z-index:100"></div></div>');
		}
		if(e.clientX<_popWidth/2){
			$("#btceye-pop").css({"left":"5px"});
			$("#btceye-poparrow").css({"left":e.pageX+'px'});
		}
		else if(($(window).width()-e.clientX)<_popWidth/2){
			$("#btceye-pop").css({"left":$(window).width()-_popWidth-5+"px"});
			$("#btceye-poparrow").css({"left":_popWidth+5-$(window).width()+e.pageX+'px'});
		}
		fetchAddrInfo(addr);
	}
}

function fetchAddrInfo(addr){
	var xhr = new XMLHttpRequest();
  	xhr.open("GET", "http://blockchain.info/address/"+addr+"?format=json", true);
  	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	      var resp = JSON.parse(xhr.responseText);
	      $("#n_tx").html(resp.n_tx);
	      $("#total_received").html(resp.total_received/100000000+" BTC");
	      $("#total_sent").html(resp.total_sent/100000000+" BTC");
	      $("#final_balance").html(resp.final_balance/100000000+" BTC");
	    }
	}
	xhr.send(); 
}