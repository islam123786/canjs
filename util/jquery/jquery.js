//352
steal('./jquery.1.7.1.js', function(){
	
	$.extend(Can,jQuery,{
		trigger: function(obj, event, args){
			if(obj.trigger){
				obj.trigger(event,args)
			} else {
				$.event.trigger(event, args, obj, true)
			}
			
		},
		addEvent: function(ev, cb){
			$([this]).bind(ev, cb)
			return this;
		},
		removeEvent: function(ev, cb){
			$([this]).unbind(ev, cb)
			return this;
		},
		$: jQuery
	});

	// make binding functions
	$.each(['bind','unbind','undelegate','delegate'],function(i,func){
		Can[func] = function(){
			var t = this[func] ? this : $([this])
			t[func].apply(t, arguments)
			return this;
		}
	})
	// make modifier based functions
	$.each(["append","filter","addClass","remove","data"], function(i,name){
		Can[name] = function(wrapped){
			return wrapped[name].apply(wrapped, Can.makeArray(arguments).slice(1))
		}
	})
	
})
