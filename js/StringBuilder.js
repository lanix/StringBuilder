(function(box){


    var isArray = Array.isArray || function (value) { return Object.prototype.toString.apply(value) === '[object Array]'; };

    var StringBuilder = function(){
        var that = this === box ? new StringBuilder() : this;
        that.buffer = [];
        that.wrappingStack = [];
        that.wrappingStackBackup = [];
        that.wrapping = false;

        return that;
    };

    StringBuilder.prototype = {
        cat : function(){
            var currentArgument = null;
            var prefix = null;
            var suffix = null;
            var index = 0;
            var argumentsLength = arguments.length;

            if(arguments.callee.caller !== this.cat && this.wrapping){
                this.wrapping = false;
                if(this.wrappingStack.length > 0){
                    for(index = 0; index < this.wrappingStack.length; index += 1){
                        prefix = this.wrappingStack[index].prefix;
                        if(prefix) this.cat(prefix);
                    }
                } 
                this.wrapping = true;
            }

            for(index = 0; index < argumentsLength; index += 1){
               currentArgument = arguments[index];
                
                switch(typeof currentArgument){
                    case 'function' : {
                        this.buffer.push(currentArgument.call(this));
                        break;
                    }
                    case 'object' : {        
                        if(box.isArray(currentArgument)){
                            this.cat.apply(this, currentArgument);
                        }
                        else{
                            this.buffer.push(currentArgument);
                        }
                        break;
                    }
                    default: 
                        this.buffer.push(currentArgument);
                        break;
                }
            }

            if(arguments.callee.caller !== this.cat && this.wrapping){
                this.wrapping = false;
                if(this.wrappingStack.length > 0){
                    for(index = this.wrappingStack.length - 1; index >= 0; index -= 1){
                        suffix = this.wrappingStack[index].suffix;
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
            var index = 0;

            if(typeof times === 'number'){
                args.splice(args.length - 1, 1);
                
                for(var index = 0; index < times; index += 1){
                    this.cat.apply(this, args);
                }
            } 
            else{
                throw 'Missing repetition argument';
            }
           
            return this;
        },
        catIf : function(){

            var args = Array.slice(arguments);
            var condition = args[args.length - 1];

            if(typeof condition === 'function'){
                condition = condition.call(this);
            } 

            if(condition){
                args.splice(args.length - 1, 1);
                this.cat.apply(this, args);
            }

            return this;
        },
        string : function(){
            return this.buffer.join('');
        },
        wrap : function(p, s){
            this.wrappingStack.push({prefix:p, suffix:s});
            this.wrapping = true;
            return this;
        },
        end: function(deep){

            if(deep && typeof(deep) === 'number'){

                this.wrappingStack.splice(this.wrappingStack.length - deep, deep);
            }
            else{
                this.wrappingStack.pop();
            }

            this.wrapping = this.wrappingStack.length > 0;

            if(this.wrappingStackBackup.length > 0) {
                this.wrappingStack = this.wrappingStackBackup;
                this.wrappingStackBackup = [];
            }

            return this;
        },
        prefix : function(p){
            this.wrappingStack.push({prefix:p});
            this.wrapping = true;
            return this;
        },
        suffix : function(s){
            this.wrappingStack.push({suffix:s});
            this.wrapping = true;
            return this;
        },
        each : function(args, callBack){
            var index = 0;
            var argsLength = args.length;

            for(var index = 0; index < argsLength; index += 1){
                callBack.call(this, args[index], index);
            }

            return this;

        },
        suspend : function(){
            this.wrappingStackBackup = this.wrappingStack;
            this.wrappingStack = [];
            return this;
        },
        when : function(condition, thenArgs, otherwiseArgs){
            var realArgs = null;

            if(typeof condition === 'function'){
                condition = condition.call(this);
            } 

            realArgs = condition ? thenArgs : otherwiseArgs;
            this.cat.call(this, realArgs);

            return this;
        },
    }

    box.StringBuilder = StringBuilder;
    box.isArray = isArray;
})(this);
