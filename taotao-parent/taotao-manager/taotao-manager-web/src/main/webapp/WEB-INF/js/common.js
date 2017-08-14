Date.prototype.format = function(format){ 
    var o =  { 
    "M+" : this.getMonth()+1, //month 
    "d+" : this.getDate(), //day 
    "h+" : this.getHours(), //hour 
    "m+" : this.getMinutes(), //minute 
    "s+" : this.getSeconds(), //second 
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
    "S" : this.getMilliseconds() //millisecond 
    };
    if(/(y+)/.test(format)){ 
    	format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o)  { 
	    if(new RegExp("("+ k +")").test(format)){ 
	    	format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
	    } 
    } 
    return format; 
};

var TT = TAOTAO = {
	// 缂栬緫鍣ㄥ弬鏁�
	kingEditorParams : {
		filePostName  : "uploadFile", //琛ㄥ崟鎻愪氦涓璮ile缁勪欢鐨勫悕绉�
		uploadJson : '/rest/pic/upload', //涓婁紶鍦板潃
		dir : "image" //绫诲瀷
	},
	// 鏍煎紡鍖栨椂闂�
	formatDateTime : function(val,row){
		var now = new Date(val);
    	return now.format("yyyy-MM-dd hh:mm:ss");
	},
	// 鏍煎紡鍖栬繛鎺�
	formatUrl : function(val,row){
		if(val){
			return "<a href='"+val+"' target='_blank'>鏌ョ湅</a>";			
		}
		return "";
	},
	// 鏍煎紡鍖栦环鏍�
	formatPrice : function(val,row){
		return (val/100).toFixed(2);
	},
	// 鏍煎紡鍖栧晢鍝佺殑鐘舵�
	formatItemStatus : function formatStatus(val,row){
        if (val == 1){
            return '姝ｅ父';
        } else if(val == 2){
        	return '<span style="color:red;">涓嬫灦</span>';
        } else {
        	return '鏈煡';
        }
    },
    
    init : function(data){
    	this.initPicUpload(data);
    	this.initItemCat(data);
    },
    // 鍒濆鍖栧浘鐗囦笂浼犵粍浠�
    initPicUpload : function(data){
    	$(".picFileUpload").each(function(i,e){
    		var _ele = $(e);
    		_ele.siblings("div.pics").remove();
    		_ele.after('\
    			<div class="pics">\
        			<ul></ul>\
        		</div>');
    		// 鍥炴樉鍥剧墖
        	if(data && data.pics){
        		var imgs = data.pics.split(",");
        		for(var i in imgs){
        			if($.trim(imgs[i]).length > 0){
        				_ele.siblings(".pics").find("ul").append("<li><a href='"+imgs[i]+"' target='_blank'><img src='"+imgs[i]+"' width='80' height='50' /></a></li>");
        			}
        		}
        	}
        	$(e).unbind('click').click(function(){
        		//浠庢寜閽紑濮嬪悜涓婃煡鎵緁orm锛屾煡鎵炬渶杩戠殑涓�釜form瀵硅薄
        		var form = $(this).parentsUntil("form").parent("form");
        		//鍥剧墖涓婁紶鍙傛暟
        		KindEditor.editor(TT.kingEditorParams).loadPlugin('multiimage',function(){
        			var editor = this;
        			editor.plugin.multiImageDialog({
        				//鐐瑰嚮鈥滃叏閮ㄦ彃鍏モ�鏃舵墽琛�
						clickFn : function(urlList) {
							var imgArray = [];
							KindEditor.each(urlList, function(i, data) {
								imgArray.push(data.url);
								//灏忓浘鐗囬瑙�
								form.find(".pics ul").append("<li><a href='"+data.url+"' target='_blank'><img src='"+data.url+"' width='80' height='50' /></a></li>");
							});
							//灏唘rl鐢ㄩ�鍙峰垎闅斿啓鍏ュ埌闅愯棌鍩熶腑
							form.find("[name=image]").val(imgArray.join(","));
							editor.hideDialog();
						}
					});
        		});
        	});
    	});
    },
    
    // 初始化选择类目组件
    initItemCat : function(data){
    	//i : index
    	//e : ele
    	$(".selectItemCat").each(function(i,e){
    		var _ele = $(e);
    		if(data && data.cid){
    			_ele.after("<span style='margin-left:10px;'>"+data.cid+"</span>");
    		}else{
    			_ele.after("<span style='margin-left:10px;'></span>");
    		}
    		_ele.unbind('click').click(function(){
    			$("<div>").css({padding:"5px"}).html("<ul>")
    			.window({
    				width:'500',
    			    height:"450",
    			    //不关闭不能点击下边的内容
    			    modal:true,
    			    closed:true,
    			    iconCls:'icon-save',
    			    title:'选择类目',
    			    onOpen : function(){//easyUI的异步tree控件
    			    	var _win = this;
    			    	$("ul",_win).tree({
    			    		url:'/item/cat/list',//根据请求的url的响应结果进行初始化
    			    		method : "GET",
    			    		animate:true,
    			    		onClick : function(node){
    			    			if($(this).tree("isLeaf",node.target)){
    			    				_ele.parent().find("[name=cid]").val(node.id);
    			    				_ele.next().text(node.text).attr("cid",node.id);
    			    				$(_win).window('close');
    			    				if(data && data.fun){
    			    					data.fun.call(this,node);
    			    				}
    			    			}
    			    		}
    			    	});
    			    },
    			    onClose : function(){
    			    	$(this).window("destroy");
    			    }
    			}).window('open');
    		});
    	});
    },
    
    createEditor : function(select){
    	return KindEditor.create(select, TT.kingEditorParams);
    },
    
    /**
     * 鍒涘缓涓�釜绐楀彛锛屽叧闂獥鍙ｅ悗閿�瘉璇ョ獥鍙ｅ璞°�<br/>
     * 
     * 榛樿锛�br/>
     * width : 80% <br/>
     * height : 80% <br/>
     * title : (绌哄瓧绗︿覆) <br/>
     * 
     * 鍙傛暟锛�br/>
     * width : <br/>
     * height : <br/>
     * title : <br/>
     * url : 蹇呭～鍙傛暟 <br/>
     * onLoad : function 鍔犺浇瀹岀獥鍙ｅ唴瀹瑰悗鎵ц<br/>
     * 
     * 
     */
    createWindow : function(params){
    	$("<div>").css({padding:"5px"}).window({
    		width : params.width?params.width:"80%",
    		height : params.height?params.height:"80%",
    		modal:true,
    		title : params.title?params.title:" ",
    		href : params.url,
		    onClose : function(){
		    	$(this).window("destroy");
		    },
		    onLoad : function(){
		    	if(params.onLoad){
		    		params.onLoad.call(this);
		    	}
		    }
    	}).window("open");
    },
    
    closeCurrentWindow : function(){
    	$(".panel-tool-close").click();
    },
    
    changeItemParam : function(node,formId){
    	
    	 $.ajax({
			   type: "GET",
			   url: "/rest/item/param/" + node.id,
			   dataType:"json",
			   statusCode : {
				   200 : function(data){
					   //妯℃澘宸茬粡瀛樺湪
					   $("#"+formId+" .params").show();
						 var paramData = JSON.parse(data.paramData);
						 var html = "<ul>";
						 for(var i in paramData){
							 var pd = paramData[i];
							 html+="<li><table>";
							 html+="<tr><td colspan=\"2\" class=\"group\">"+pd.group+"</td></tr>";
							 
							 for(var j in pd.params){
								 var ps = pd.params[j];
								 html+="<tr><td class=\"param\"><span>"+ps+"</span>: </td><td><input autocomplete=\"off\" type=\"text\"/></td></tr>";
							 }
							 
							 html+="</li></table>";
						 }
						 html+= "</ul>";
						 $("#"+formId+" .params td").eq(1).html(html);
				   },
				   404 : function(){
					   //妯℃澘涓嶅瓨鍦�
					   $("#"+formId+" .params").hide();
						$("#"+formId+" .params td").eq(1).empty();
				   },
				   500 : function(){
					   //鍑洪敊
					   alert("error");
				   }

			   }
			});
    },
    getSelectionsIds : function (select){
    	var list = $(select);
    	var sels = list.datagrid("getSelections");
    	var ids = [];
    	for(var i in sels){
    		ids.push(sels[i].id);
    	}
    	ids = ids.join(",");
    	return ids;
    },
    
    /**
     * 鍒濆鍖栧崟鍥剧墖涓婁紶缁勪欢 <br/>
     * 閫夋嫨鍣ㄤ负锛�onePicUpload <br/>
     * 涓婁紶瀹屾垚鍚庝細璁剧疆input鍐呭浠ュ強鍦╥nput鍚庨潰杩藉姞<img> 
     */
    initOnePicUpload : function(){
    	$(".onePicUpload").click(function(){
			var _self = $(this);
			KindEditor.editor(TT.kingEditorParams).loadPlugin('image', function() {
				this.plugin.imageDialog({
					showRemote : false,
					clickFn : function(url, title, width, height, border, align) {
						var input = _self.siblings("input");
						input.parent().find("img").remove();
						input.val(url);
						input.after("<a href='"+url+"' target='_blank'><img src='"+url+"' width='80' height='50'/></a>");
						this.hideDialog();
					}
				});
			});
		});
    }
};
