/**
 * @author 김병준
 * @version 1.0.2
 */

var kbj = function(){ 
    if(!new.target){//new 를 사용하여 호출했는지 체크 && 안했다면 new로 생성시켜준다. => 유연한 코드 작성이 가능
        return new kbj();
    }   
    this.init();
}

kbj.prototype = {
    init : function(){
        var _this = this;

       _this.changeNullTableData(); //ECMA5 콜백 버전
       //_this.changeAsyncNullTableData(); //ECMA6 Promise 버전
    }

    ,registEvent : function(){
        var _this = this;
    }
    
    /**
     * bj-nullHandler 속성을 가진 테이블의 모든 td(리스트) 가져온다
     * @author 김병준
     * @version 1.0.0
     * @fix 2021-02-18
     */
    ,getNullTableData : function(onComplete){
        var _this = this;
        var $nullToBlanc;
        var $nullToBlancList = [];
        var $nullHandler = $("table[bj-nullHandler]");
        var nullHandlerLen = $nullHandler.length;
        
        for(var i=0;i<nullHandlerLen;i++){
            $nullToBlancList.push($nullHandler[i]);
        }

        _this.parseTagParams($nullToBlancList, "bj-nullHandler",function(results){
            for(var index in results){
                $nullToBlanc = $($("table[bj-nullHandler]")[results[index].tableIndex]);
                var $td = $nullToBlanc.find("td");
                
                if(onComplete){
                    onComplete($td, $nullToBlanc, results[index].replaceChar);
                }
            }
        });
    
        return false;
    }

    /**
     * bj-nullHandler 속성의 td 태그들은 가공한다.
     * @author 김병준
     * @version 1.0.0
     * @fix 2021-02-18
     */
    ,changeNullTableData : function(){
        var _this = this;

        _this.getNullTableData(function($td , $nullToBlanc, replaceChar){
            var len = $td.length;
            
            for(var i=0; i<len ;i++){
                if($($td[i]).text() === null || $($td[i]).text() == "null" || $($td[i]).text().indexOf("null") > -1){
                    var terminatedNullString = _this.sliceOnlyNull($($td[i]).text());
                    if(replaceChar.length > 0){
                        if(terminatedNullString.length > 0){
                            $($td[i]).text(replaceChar + terminatedNullString);
                        }else{
                            $($td[i]).text(replaceChar);
                        }   
                    }else{
                        $($td[i]).text("" + terminatedNullString);
                    }
                }
            }

        });

        console.log("ES5 _this.changeNullTableData 메서드 종료");
    }

    /**
     * "null 시간" 같이 null이 포함된 문자열일때 null만 삭제시켜줌 
     * null 여러개일 경우 정규식표현으로 수정해줄 것
     * @author 김병준
     * @version 1.0.0
     * @fix 2021-02-18
     */
    ,sliceOnlyNull : function(nullString){
        nullString = nullString.trim();
        return nullString.replace("null","");
    }

    /**
     * promise 버전
     * bj-nullToBlanc 속성을 가진 테이블의 모든 td(리스트) 가져온다
     * @author 김병준
     * @version 1.0.0
     * @fix 2021-02-18
     */
    ,getAsyncNullTableData : function(){
        var $nullToBlanc = $("table[bj-nullHandler]");
        var $td = $nullToBlanc.find("td");
        
        return new Promise(function(resolve, reject){
            resolve($td);
        });

        // 아래와 같이 사용해도 작동함 
        //=> new Promise를 했을때와 아닐때 차이를 알아봐야겠다.

        // var $nullToBlanc = $("table[bj-nullToBlanc]");
        // var $td = $nullToBlanc.find("td");
        
        // return $td;
    }

    /**
     * promise 버전
     * bj-nullToBlanc 속성의 td 태그들은 가공한다.
     * @author 김병준
     * @version 1.0.0
     * @fix 2021-02-18
     */
    ,changeAsyncNullTableData : async function(){
        try {
            var _this = this;
            var $td;
    
            $td = await _this.getAsyncNullTableData();
            var len = $td.length;
            var nullHandler_props =  $("table[bj-nullHandler]").attr("bj-nullHandler");
            for(var i=0; i<len ;i++){
                if($($td[i]).text() === null || $($td[i]).text() == "null" || $($td[i]).text().indexOf("null") > -1){
                    var terminatedNullString = _this.sliceOnlyNull($($td[i]).text());
                    if(nullHandler_props){
                        if(terminatedNullString.length > 0){
                    		$($td[i]).text(nullHandler_props + terminatedNullString);
                    	}else{
                    		$($td[i]).text(terminatedNullString);
                    	}   
                    }else{
                        $($td[i]).text("" + terminatedNullString);
                    }
                }
            }   
        } catch (error) {
            console.log(error);
        }
        console.log("ES6 _this.changeAsyncNullTableData 메서드 종료");
    }

    /**
     * 태그에 있는 attr의 param을 딕션너리로 파싱해준다
     * ex) <div test="test">  => {test : "test"} 
     * @params 셀렉터 
     * @params 태그 attr 이름
     * @return list
     * 
     * @author 김병준
     * @version 1.0.2
     * @since 1.0.0
     * @fix 2021-02-18
     */
    ,parseTagParams : function($selectorList, tagName,onComplete){
        var resultList = []
        var $List = $selectorList;

        if(Array.isArray($selectorList) === false){
            $List = [];
            $List.push($selectorList);
        }

        for(var index in $selectorList){
            var resultObj = {};
            var tagParams = $($selectorList[index]).attr(tagName);

            tagParams = tagParams.replace("{","");
            tagParams = tagParams.replace("}","");
            var paramList = tagParams.split(",");
            var paramListLen = paramList.length;

            for(var m = 0; m<paramListLen; m++){
                tempList = paramList[m].split(":");
                resultObj[tempList[0].trim()] = tempList[1].trim();
            }
            resultList.push(resultObj);
        }
        if(onComplete){
            onComplete(resultList);
        }

        return resultList;
    }

    ,removeEvnet : function(){
        var _this = this;
    }

    , destroy : function(){
        var _this = this;
    }
}


$(function(){
    // var onKbj = {}
    // onKbj.table = new kbj();
    new kbj();
});


/*
new 를 호출했을때 발생하는 상황은 아래와 같다.

function User(name) {
  // this = {};  (빈 객체가 암시적으로 만들어짐)

  // 새로운 프로퍼티를 this에 추가함
  this.name = name;
  this.isAdmin = false;

  // return this;  (this가 암시적으로 반환됨)
}


*/