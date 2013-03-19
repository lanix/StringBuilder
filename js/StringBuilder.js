(function(box){

    var StringBuilder = function(){
        return (this === box ? new StringBuilder() : this);
    };

    StringBuilder.prototype = {
        buffer : [],
        prefix : null,
        suffix : null,
        cat : function(){
            var currentArgument = null;
            for(var i = 0; i < arguments.length; i += 1){
               currentArgument = arguments[i];

                switch(typeof currentArgument){
                    case 'function' : {
                        this.buffer.push(currentArgument.call(this));
                        break;
                    }
                    case 'string' : {
                        this.buffer.push(currentArgument);
                        break;
                    }
                    case 'number' : {
                        this.buffer.push(currentArgument.toString());
                        break;
                    }
                    case 'object' :{
                        if(currentArgument instanceof Array){
                            for(var arrayIndex = 0; arrayIndex < currentArgument.length; arrayIndex += 1){
                                this.cat(currentArgument[arrayIndex]);
                            }
                        }
                    }
                    default: break;
                }
            }

            return this;
        },
        rep : function(){
            var args = Array.slice(arguments);
            var times = args[args.length - 1];

            if(typeof times === 'number'){
                args.splice(args.length - 1, 1);
                
                for(var i = 0; i < times; i += 1){
                    this.cat(args);
                }
            } 
            else{
                throw "Missing repetition argument";
            }
           
            return this;
        },
        catIf : function(){

            var args = Array.slice(arguments);
            var condition = args[args.length - 1];

            if(typeof condition === 'function') condition = condition.call(this);

            if(typeof condition === 'boolean' && condition === true){
                args.splice(args.length - 1, 1);
                this.cat(args);
            }

            return this;
        },
        string : function(){
            return this.buffer.join("");
        },
        wrap : function(p, s){
            this.prefix = p;
            this.suffix = s;

            return this;
        },
        content : function(){
            for(var i = 0; i < this.buffer.length; i += 1){
                console.log(this.buffer[i]); 
            }
        }
    }

    box.StringBuilder = StringBuilder;
})(this);