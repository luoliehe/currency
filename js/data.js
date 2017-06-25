const data = {
    hb: {
        btc: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
        ltc: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
        eth: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
    },
    jy: {
        btc: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
        ltc: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
        eth: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
        doge: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
    },
    jb: {
        ifc: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
        dnc: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
        bts: {
        	mark : 0,
        	warn : {
        		open: false,
        		low: 0,
        		height: 0
        	}
        },
    }
};

function saveData(ctx){
	$('input[type=number]').each(function(){
		const value = $(this).val();
		localStorage[$(this).attr('id')] = value ? parseFloat(value) : 0;
	});
	$('input[type=checkbox]').each(function(){
		localStorage[$(this).attr('id')] = $(this).is(':checked');
	});
}

function loadLocalStorageData(){
	// 自动加载数据
	for(let website in data){
		for(let coin in data[website]){
			
			for(let attr in data[website][coin]['warn']){
				const attrs = `${website}.${coin}.warn.${attr}`;
				const value = localStorage[attrs];
				if($.type(data[website][coin]['warn'][attr]) == 'number'){
					data[website][coin]['warn'][attr] = value ? parseFloat(value) : 0;
				}
				if($.type(data[website][coin]['warn'][attr]) == 'boolean'){
					data[website][coin]['warn'][attr] = 'true' == value;
				}
			}
			const val =localStorage[`${website}.${coin}.mark`]
			data[website][coin].mark = val ? parseFloat(val) : 0;
		}
	}
	console.log('load data :', data);
}

$(function(){
	loadLocalStorageData();
});