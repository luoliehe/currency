//http://open.chrome.360.cn/extension_dev/overview.html

const cacheData = {
	hb : {b : 0, l : 0, e : 0},
	jy : {b : 0, l : 0, e : 0,d : 0},
	jb : {i : 0, d : 0,b:0},
};

const list = [
	{coin : 'ethcny', api : 'wss://be.huobi.com/ws'},
	{coin : 'btccny', api : 'wss://api.huobi.com/ws'},
	{coin : 'ltccny', api : 'wss://api.huobi.com/ws'},
];
const map = new Map();


list.forEach((config) => {
	const socket = new WebSocket(config.api);
	
	socket.binaryType = 'arraybuffer';
	
	socket.onopen = function(event) {
		const subscibes = [
			`market.${config.coin}.detail`,
			`market.${config.coin}.kline.1min`,
			`market.${config.coin}.kline.5min`,
			`market.${config.coin}.kline.10min`,
			`market.${config.coin}.kline.15min`,
			`market.${config.coin}.kline.30min`,
			`market.${config.coin}.kline.1day`,
			`market.${config.coin}.trade.detail`,
			`market.${config.coin}.depth.percent10`,
		];
		subscibes.forEach((subscibe) => {
			socket.send(JSON.stringify({'sub' : subscibe ,'id' : new Date()}))
		});
	};
	socket.onmessage = function(event) {
		let data = null;
		try {
			data = JSON.parse(pako.inflate(new Uint8Array(event.data), {to : 'string'}));
		} catch (e) {
			console.error(event.data);
			return;
		}
		const {ch, tick, ping} = data;
		//心跳
		if (ping) {
			socket.send(JSON.stringify({'pong' : ping}));
			return;
		}
		console.debug(data);
		if (`market.${config.coin}.detail` === ch) {
			cacheData.hb[config.coin.substring(0, 1)] = tick.close;
			localStorage[`hb.${config.coin.substring(0,3)}.mark`] = tick.close;
		}
		
		if(ch && ch.indexOf('.kline.') != -1){
			//解构用法
			const {low, high,open, close, amount, count} = tick;
			const percent = (Math.floor((close-open)/open*100*100)/100)+"%"
			const row = {'coin':config.coin, 'low':low, 'high':high, 'open':open, 'close':close, 'amount': amount,'count':count,'percent': percent};
			
			map.set(ch, row);
		}
	};
	socket.onclose = function(event) {
		console.log('WebSocket close at time: ' + new Date());
	};
});

function acquirement(){
	// 交易网
	[ 'ltc', 'btc', 'doge','eth','ybc'].forEach((coin) => {
		$.getJSON(`https://api.btctrade.com/api/ticker?coin=${coin}`, (data) => {
			cacheData.jy[coin.substring(0, 1)] = data.buy;
			localStorage[`jy.${coin}.mark`] = data.buy;
		});
	});
	// 聚币网
	[ 'dnc', 'ifc', 'bts' ].forEach((coin) => {
		$.getJSON(`https://www.jubi.com/api/v1/ticker?coin=${coin}`, (data) => {
			cacheData.jb[coin.substring(0, 1)] = data.buy
			localStorage[`jb.${coin}.mark`] = data.buy;
		});
	});
}

function showNotification() {
	const content = [];
	for (let website in cacheData) {
		const array = [], coins = cacheData[website];
		for (let coin in coins) {
			array.push(coin + '=' + coins[coin]);
		}
		content.push(status.innerText = chrome.i18n.getMessage(website.toUpperCase()) + ':' + array.join(';'));
//		content.push(status.innerText = website + ':' + array.join(';'));
	}
	const notification = new Notification('通知', {
		//icon : '../image/smile.jpg',
		body : content.join('\n')
	});
	
	notification.onclick = function() {
	};
	
	//
	const table = [];
	map.forEach((obj)=>{table.push(obj)});
	//console.table(table);
}

const notificationMap = new Map();
function checkMark(){
	loadLocalStorageData();
	const message = [];
	for(let website in data){
		for(let coin in data[website]){
			const config = data[website][coin];
			if(!config.warn.open){
				continue;
			}
			console.log(config.mark , config.warn.height, config.warn.low);
			let key = '';
			let txt = '';
			if(config.mark >= config.warn.height){
				key = `${website}-${coin}-height`;
				txt = `${website}-${coin}为“${config.mark}”高于设置“${config.warn.height}”`;
			}
			if(config.mark <= config.warn.low){
				key = `${website}-${coin}-low`;
				txt = `${website}-${coin}为“${config.mark}”低于设置“${config.warn.low}”`;
			}
			if(notificationMap.get(key)){
				//5分钟不提示
				let time = notificationMap.get(key);
				const delay = 60 * 1000;
				if(new Date().getTime() - time < delay){
					continue;
				}
			}
			if(txt){
				message.push(txt);
			}
			notificationMap.set(key, new Date().getTime());
		}
		
	}
	if(message.length == 0){
		return;
	}
	new Notification('通知', {
		icon : '../image/smile.jpg',
		body : message.join('\n')
	});
}

//主动获取
(()=>{
	acquirement();
	setInterval(acquirement, 2 * 1000);
//	setInterval(showNotification, 1000);
	setInterval(checkMark, 1000);
	
})();

console.log('%c background runing...','color: blue; font-size: 1.5em;');


