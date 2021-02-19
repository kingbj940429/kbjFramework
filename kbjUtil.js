var kbjUtil = function(){
    // if(!new.target){//new 를 사용하여 호출했는지 체크 && 안했다면 new로 생성시켜준다. => 유연한 코드 작성이 가능
    //     return new kbjFront();
    // }   

     this.init();
}

kbjUtil.prototype = {
    init : function(){
        var _this = this;
        _this.parseTagParams();
    }

    ,registEvent : function(){

    }

    /**
     * 태그에 있는 attr의 param을 딕션너리로 파싱해준다
     * ex) <div test="test">  => {test : "test"} 
     * @params 파싱할 셀렉터 
     * @params 태그 attr 이름
     * @return list
     * 
     * @author 김병준
     * @version 1.0.2
     * @since 1.0.0
     * @fix 2021-02-18
     */
    ,parseTagParams : function($selectorList, tagName, onComplete){
        var resultList = []
        var $List = $selectorList;

        if(Array.isArray($selectorList) === false){
            $List = [];
            $List.push($selectorList);
        }

        for(var index in $selectorList){
            var resultObj = {};
            var tagParams = $($selectorList[index]).attr(tagName);

            tagParams = tagParams.replace(/\}/g, "");
            tagParams = tagParams.replace(/\{/g, "");
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

    ,removeEvent : function(){

    }

    ,destroy : function(){

    }
}
