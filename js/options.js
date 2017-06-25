$(()=>{
	$('#save').click(()=>{
		saveData();
	});
	
	for(let website in data){
		for(let coin in data[website]){
			const idOpen = `${website}.${coin}.warn.open`;
			const idLow = `${website}.${coin}.warn.low`;
			const idHeight = `${website}.${coin}.warn.height`;
			const html =  
			`<li>`+
				`<label>${website}</label>`+
				`<label>${coin}</label>`+
				`<input id="${idLow}" placeholder="低 ${coin}" value="${data[website][coin].warn.low}" type="number"/>`+
				`<input id="${idHeight}" placeholder="高 ${coin}" value="${data[website][coin].warn.height}" type="number"/>`+
				`<input id="${idOpen}" value="true" type="checkbox" ${data[website][coin].warn.open ?'checked':''} />`+
			`</li>`;
			$('#setting').append(html);
		}
	}
});
