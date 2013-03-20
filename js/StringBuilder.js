(function(box){

    var StringBuilder = function(){
        var that = this === box ? new StringBuilder() : this;

        return that;
    };

    StringBuilder.prototype = {
        buffer : [],
        myStack : [],
        myStackBackup : [],
        wrapping : false,
        cat : function(){
            var currentArgument = null;
            var prefix = null;
            var suffix = null;

            if(arguments.callee.caller !== this.cat && this.wrapping){
                this.wrapping = false;
                if(this.myStack.length > 0){
                    for(var i = 0; i < this.myStack.length; i += 1){
                        prefix = this.myStack[i].prefix;
                        if(prefix) this.cat(prefix);
                    }
                } 
                this.wrapping = true;
            }

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
                        if(myHelper.isArray(currentArgument)){
                            this.cat.apply(this, currentArgument);
                        }
                    }
                    default: break;
                }
            }

            if(arguments.callee.caller !== this.cat && this.wrapping){
                this.wrapping = false;
                if(this.myStack.length > 0){
                    for(var i = this.myStack.length - 1; i >= 0; i -= 1){
                        suffix = this.myStack[i].suffix;
                        if(suffix)this.cat(suffix);
                    }
                } 
                this.wrapping = true;
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
                if(this.myStack.length <= 0){
                    this.wrapping = false;
                } 
                else {
                    this.wrapping = true;
                }
            }

            if(this.myStackBackup.length > 0) {
                this.myStack = this.myStackBackup.slice();
                this.myStackBackup = [];
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
                callBack.call(this, args[i], i);
            }

            return this;

        },
        suspend : function(){
            this.myStackBackup = this.myStack.slice(0);
            this.myStack = [];
            return this;
        },
        content : function(){ //Deleteme
            console.log(myHelper.isArray([1, 2]));
        }
    }

    box.StringBuilder = StringBuilder;
})(this);
