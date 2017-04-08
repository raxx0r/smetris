var expect = require('chai').expect;
var assert = require('assert');
var sinon = require('sinon');
var Renderer = require('../src/Renderer.js');
var fillSquare = Renderer({canvas:{getContext: function() {}}}).fillSquare;
var ImageData = require('../test_utils').ImageData;
var Canvas = require('canvas')

describe('Renderer', function(){
	describe('fillSquare', function(){
		it.only('should render a square with stroke', function() {
	  		var Image = Canvas.Image;
	  		var canvas = new Canvas(100, 100);
			var context = canvas.getContext('2d');

			var config = {
				background: '#FFD70D',
				stroke: {
					thickness: 3.5
				},
				square: {
					width: 20,
					height: 20
				}
			}

			fillSquare(context, 0, 0, config);
			const result = context.getImageData(0,0, 100, 100);
			var expectedCanvas = ImageData('test/block.png', 100, 100);
			var expectedImageData = expectedCanvas.getContext('2d').getImageData(0,0,100,100)

			expect(result).to.deep.equal(expectedImageData);
		})

	})
})
