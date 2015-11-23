var $ = require('jquery');
var assert = require('assert');
var keys = require('../src/keys.js');
var sinon = require('sinon');
var Controls = require('../src/Controls.js');

describe('when pressing a key', function(){
	it('should emit a corresponding event', function() {
		var controls = Controls();
		controls.init();
		var handleDrop = sinon.stub();
		controls.on('drop', handleDrop);

		var e = $.Event("keydown", { keyCode: keys.SPACE } );
		e.which = keys.SPACE;
		e.keyCode = keys.SPACE;
		$(document).trigger(e);

		assert(handleDrop.calledOnce);
	})
	it('should not recive event when listener turned off', function() {
		var controls = Controls();
		controls.init();
		var handleDrop = sinon.stub();
		controls.on('drop', handleDrop);

		var e = $.Event("keydown", { keyCode: keys.SPACE } );
		e.which = keys.SPACE;
		e.keyCode = keys.SPACE;
		$(document).trigger(e);
		controls.off('drop', handleDrop);
		$(document).trigger(e);

		assert(handleDrop.calledOnce);
	})

})
