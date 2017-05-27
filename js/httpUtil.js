/**
 * get请求
 * @param url
 * @returns
 */
function get(url){
	let HTTP_STATUS_OK = 4;
	let responseText;
	let xhr = new XMLHttpRequest();
	xhr.open('GET',url,false);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == HTTP_STATUS_OK){
			responseText = JSON.parse(xhr.responseText);
		}
	};
	xhr.send();
	return responseText;
}

/**
 * get请求获取JSON
 * @param url
 * @returns
 */
function getJson(url){
	return JSON.parse(get(url));
}
