//http://open.chrome.360.cn/extension_dev/overview.html

// 创建一个单独的线程
let worker = new Worker('js/worker.js');
// 通信
worker.addEventListener('message', function(event){
	console.log('主线程打印：'+ event.data);
}, false);

worker.postMessage({'action':'start'});

console.log('main...');