(function(box){

    var Helper = function(){
        return this == box ? new Helper() : this;
    }

    Helper.prototype = {
        isArray : function (value) {
         return value &&
             typeof value === 'object' &&
             typeof value.length === 'number' &&
             typeof value.splice === 'function' &&
             !(value.propertyIsEnumerable('length'));
        }
    }

    box.Helper = Helper;

})(this);