var ModularStack = function() {

    var last = null;

    return {
        push : function(Content){
            last = {content: Content, previous:last };
            return last.content;
        },
        pop : function(){
            var val = last;
            if(last == null){
                throw "Stack is empty";
            }
            else {
                last = last.previous;
            }

            return val.content;
        },
        content : function(){
            var result = [];
            var currentElement = last;
         
            while(currentElement){
                result.push(currentElement.content);
                currentElement = currentElement.previous;
            }

            return result;
        },
        each : function(callBack){

            var currentElement = last;
            
            if(currentElement != null){

                if(typeof callBack === "function"){
      
                    while(currentElement){
                        callBack.call(this, currentElement.content);
                        currentElement = currentElement.previous;
                    }
                }
                else{
                    throw "Missing CallBack Function";
                }                
            }
            else{
                throw "Stack is empty";
            }
        },
        peek : function(){
            return last == null ? null : last.content;
        },
        isEmpty : function(){
            return last == null ? true : false;
        }
    };
};