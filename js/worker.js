importScripts('config.js');
importScripts('httpUtil.js');

function show(){
	const huobiApi = {
			LTC : 'http://api.huobi.com/staticmarket/ticker_ltc_json.js',
			BTC : 'http://api.huobi.com/staticmarket/ticker_btc_json.js'
	};
	const jyApi = {
			LTC : 'http://api.btctrade.com/api/ticker?coin=ltc',
			BTC : 'http://api.btctrade.com/api/ticker?coin=btc',
			YBC : 'http://api.btctrade.com/api/ticker?coin=ybc',
			DOGC :'http://api.btctrade.com/api/ticker?coin=doge'
	};
//	let dogTotal = localStorage["DOGC"];
//	let ltcTotal = localStorage["LTC"];
	
	let data = {'HUOBI':[],'JIAOYI':[]};
	try{
		for(let key in huobiApi){
			data['HUOBI'].push(key +'='+ get(huobiApi[key]).ticker.buy +' ')
		}
	}catch (e) {
		console.log(e);
    }
	try{
		for(let key in jyApi){
			data['JIAOYI'].push(key +'='+ get(jyApi[key]).buy +' ');
		}
	}catch(e){
		console.log(e);
	}
	let array = [];
	for(let key in data){
		array.push(config[key] +'：'+data[key].join(' '));
	}
	
	let notification = new Notification('通知', {
		icon : '../image/smile.jpg', 
		renotify : true, 
		tag	: 'notification',
		body : array.join('\n')
	});
	notification.onclick = function(){
	};
	//setTimeout(notification.close.bind(notification), 15 * 1000); 
	return notification;
}

let timer = null;
/**
 * 接收主函数发送过来的消息 
 */
self.addEventListener('message', function(event){
	let data = event.data;
	if(data.action === 'start'){
		if(timer != null){
			timer.clear();
			postMessage('restart...');
		}
		show();
		timer = setInterval(() => {show();postMessage('I am ok')}, 3 * 1000);
		postMessage('working...');
	}else{
		postMessage('unknown command');
	}
},false);
