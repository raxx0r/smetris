$('#drop').on('click', function() { emit('drop'); });
$('#hold').on('click', function() { emit('hold'); });
$('#left').on('click', function() { emit('left'); });
$('#right').on('click', function() { emit('right'); });
$('#down').on('click', function() { emit('down'); });
$('#rotate').on('click', function() { emit('rotate'); });


var client = new WebSocket(`ws://${window.location.hostname}:8080/controller`, 'echo-protocol');
 
client.onerror = function() { console.log('Connection Error'); };
client.onclose = function() { console.log('echo-protocol Client Closed'); };
client.onmessage = function(e) { if (typeof e.data === 'string') { } };
client.onopen = function() { console.log('WebSocket Client Connected'); };
 
 
function emit(type) {
	client.send(type)
}