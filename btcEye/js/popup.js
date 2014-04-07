function addrEnvent(evt){
	if (evt.keyCode!=13) return;
	initContent();
	var addr = $("#btcAddr").val().trim();
	var addrReg=/\b[13][1-9A-HJ-NP-Za-km-z]{26,33}\b/g;
	if (addrReg.test(addr)) {
		$("#detailTable").show();
		fetchAddrInfo(addr);
	}
	else{
		$("#warning").show();
		$("#detailTable").hide();	
	}
	return false;
}

function fetchAddrInfo(addr){
	var xhr = new XMLHttpRequest();
  	xhr.open("GET", "http://blockchain.info/address/"+addr+"?format=json", true);
  	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	      var resp = JSON.parse(xhr.responseText);
	      //var price=resp.ticker?parseFloat(resp.ticker.last):parseFloat(resp.last);
	      $("#n_tx").html(resp.n_tx);
	      $("#total_received").html(resp.total_received/100000000+" BTC");
	      $("#total_sent").html(resp.total_sent/100000000+" BTC");
	      $("#final_balance").html(resp.final_balance/100000000+" BTC");
	    }
	}
	xhr.send(); 
}

function initContent(){
	$("#detailTable").hide();
	$("#warning").hide();
	$("#n_tx").html("waiting");
	$("#total_received").html("waiting");
	$("#total_sent").html("waiting");
	$("#final_balance").html("waiting");
}

$(document).ready(function(){
	initContent();
	$("#btcAddr").on('keypress', addrEnvent);
});
