(function(box){

    var StringBuilder = function(){
        var that = this === box ? new StringBuilder() : this;

        return that;
    };

    StringBuilder.prototype = {
        buffer : [],
        myStack : function(){
            return ModularStack();
        }(),
        wrapping : false,
        cat : function(){
            var currentArgument = null;
            for(var i = 0; i < arguments.length; i += 1){
               currentArgument = arguments[i];

                switch(typeof currentArgument){
                    case 'function' : {
                        if(this.wrapping){
                            this.wrapping = false;
                            this.cat(this.myStack.peek().prefix);
                            this.wrapping = true;
                        }
                        this.buffer.push(currentArgument.call(this));
                        if(this.wrapping){
                            this.wrapping = false;
                            this.cat(this.myStack.peek().suffix);
                            this.wrapping = true;
                        }
                        break;
                    }
                    case 'string' : {
                        if(this.wrapping){
                            this.wrapping = false;
                            this.cat(this.myStack.peek().prefix);
                            this.wrapping = true;
                        }
                        this.buffer.push(currentArgument);
                        if(this.wrapping){
                            this.wrapping = false;
                            this.cat(this.myStack.peek().suffix);
                            this.wrapping = true;
                        }
                        break;
                    }
                    case 'number' : {
                        if(this.wrapping){
                            this.wrapping = false;
                            this.cat(this.myStack.peek().prefix);
                            this.wrapping = true;
                        }
                        this.buffer.push(currentArgument.toString());
                        if(this.wrapping){
                            this.wrapping = false;
                            this.cat(this.myStack.peek().suffix);
                            this.wrapping = true;
                        }
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
            this.myStack.push({prefix:p, suffix:s});
            this.wrapping = true;
            return this;
        },
        end: function(deep){
            if(deep && typeof(deep) === 'number'){
                for(var i = 0; i < deep; i += 1){
                    try{
                         this.myStack.pop();
                    }
                    catch(err){
                        this.wrapping = false;
                        break;
                    }    
                }
            }
            else{
                this.myStack.pop();
                if(this.myStack.isEmpty()) this.wrapping = false;
            }
            return this;
        },
        prefix : function(p){
            this.myStack.push({prefix:p});
            this.wrapping = true;
            return this;
        },
        suffix : function(s){
            this.myStack.push({suffix:s});
            this.wrapping = true;
            return this;
        },
        each : function(args, callBack){

            for(var i = 0; i < args.length; i += 1){
                callBack.call(this, value=args[i]);
            }

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