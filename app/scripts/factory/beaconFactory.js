'use strict';

/**
 * @ngdoc function
 * @name yeomanTestApp.controller:BeaconCtrl
 * @description
 * # BeaconCtrl
 * Controller of the yeomanTestApp
 */

 function CordovaReadyFactory() {
  return function (fn) {
  	//console.log('Entered CordovaReadyFactory')
  	//hyper.log('Entered CordovaReadyFactory');
    var queue = [];

    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };

    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);

    return function () {
    	//console.log('Exited CordovaReadyFactory');	
    	//hyper.log('Exited CordovaReadyFactory');
      return impl.apply(this, arguments);
    };
  };
}

/*
// Test that controller to factory syntax works
function BeaconListFactory() {
	//var app = {};
	
	//var beacons = {};
	var displayBeacon = {};
	
	displayBeacon = {
		major: 'TestMajor',
		minor: 'TestMinor',
		proximity: 'TestProximity',
		distance: 'TestDistance',	
		rssi: 'TestRSSI'
	};
	
	return {
		get: function() {
			return displayBeacon;
		}
	};
}
*/	
 
function BeaconListFactory($sce, CordovaReady) {

	var app = {};
	var displayBeacons = [];
	var beacons = {};
	//console.log('Entered BeaconsListFactory');
	//hyper.log('Entered BeaconsListFactory');
	
	
	//var updateTimer = null;
	/*
	app.initialize = function()
	{
		document.addEventListener('deviceready', onDeviceReady, false); // wait for Cordova to be ready
	};
	*/
	
	
	
	function startScan()
	{
		//hyper.log('Entered startScan');
		function onBeaconsRanged(beaconInfo)
		{
			//console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
			for (var i in beaconInfo.beacons)
			{
				// Insert beacon into table of found beacons.
				var beacon = beaconInfo.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.proximityUUID + ':' + beacon.major + ':' + beacon.minor;
				beacons[key] = beacon;
				//hyper.log('checking inside beacons: ' + beacons[key].proximity);
			}

			/* Debugging */
			for (var key in beacons) {
   				if (beacons.hasOwnProperty(key)) {
      				//hyper.log('checking beacons[key] in onBeaconsRanged: ' + key + beacons[key]);
   				}
			}
			/* End of debugging */
		}

		function onError(errorMessage)
		{
			//console.log('Ranging beacons did fail: ' + errorMessage);
		}

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		estimote.requestAlwaysAuthorization();

		// Start ranging beacons.
		estimote.startRangingBeaconsInRegion(
			{}, // Empty region matches all beacons
			    // with the Estimote factory set UUID.
			onBeaconsRanged,
			onError);

		/* Debugging */
		for (var key in beacons) {
				if (beacons.hasOwnProperty(key)) {
  				//hyper.log('checking beacons[key] at end of startScan: ', key, beacons[key]);
				}
		}
		/* End of debugging */
	}
	
	function displayBeaconList()
	{
		// Clear beacon list.
		//$('#found-beacons').empty();

		var timeNow = Date.now();
		
		// Update beacon list.
		//$.each(beacons, function(key, beacon)
		//{
		//var temp = angular.toJson(beacons);
		//var temp = JSON.stringify(beacons, null, 2);
		//hyper.log('got in displayBeaconList');
		/* Debugging */
		for (var key in beacons) {
				if (beacons.hasOwnProperty(key)) {
  				//hyper.log('checking beacons[key] in displayBeaconList: ', key, beacons[key]);
				}
		}
		/* End of debugging */
		

		angular.forEach(beacons, function(value, key)
		{		
			//hyper.log('Entered displayBeaconList, key, beacon:' + value.proximity + value.distance);

			// Only show beacons that are updated during the last 60 seconds.

			if (value.timeStamp + 60000 > timeNow)
			{
				// Create tag to display beacon data.
				/*
				var element = $(
					'<li>'
					+	'Major: ' + beacon.major + '<br />'
					+	'Minor: ' + beacon.minor + '<br />'
					+	proximityHTML(beacon)
					+	distanceHTML(beacon)
					+	rssiHTML(beacon)
					+ '</li>'
				);

				$('#found-beacons').append(element);
				*/
				displayBeacons.push(value);
				//hyper.log('Count of displayBeacons: ' + displayBeacons.length);
				displayBeacons[displayBeacons.length - 1].proximity = proximityHTML(value);
				displayBeacons[displayBeacons.length - 1].distance = distanceHTML(value);
				displayBeacons[displayBeacons.length - 1].rssi = $sce.trustAsHtml(rssiHTML(value));
				//displayBeacons[key] = value;
				//displayBeacons[key].proximity = proximityHTML(value);
				//hyper.log('In displayBeaconList' + displayBeacons[key]);
				//displayBeacons[key].distance = distanceHTML(beacon);
				//displayBeacons[key].rssi = rssiHTML(beacon);
			}
		});
	}
	
	function proximityHTML(beacon)
	{
		var proximity = beacon.proximity;
		if (!proximity) { return ''; }

		var proximityNames = [
			'Unknown',
			'Immediate',
			'Near',
			'Far'];

		return proximityNames[proximity];
	}

	function distanceHTML(beacon)
	{
		var meters = beacon.distance;
		if (!meters) { return ''; }

		var distance =
			(meters > 1) ?
				meters.toFixed(3) + ' m' :
				(meters * 100).toFixed(3) + ' cm';

		if (meters < 0) { distance = '?'; }

		return distance;
	}

	function rssiHTML(beacon)
	{
		var beaconColors = [
			'rgb(214,212,34)', // unknown
			'rgb(215,228,177)', // mint
			'rgb(165,213,209)', // ice
			'rgb(45,39,86)', // blueberry
			'rgb(200,200,200)', // white
			'rgb(200,200,200)', // transparent
		];

		// Get color value.
		var color = beacon.color || 0;
		// Eliminate bad values (just in case).
		color = Math.max(0, color);
		color = Math.min(5, color);
		var rgb = beaconColors[color];

		// Map the RSSI value to a width in percent for the indicator.
		var rssiWidth = 1; // Used when RSSI is zero or greater.
		if (beacon.rssi < -100) { rssiWidth = 100; }
		else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }
		// Scale values since they tend to be a bit low.
		rssiWidth *= 1.5;

		var html =
			beacon.rssi + '<br />'
			+ '<div style="background:' + rgb + ';height:20px;width:'
			+ 		rssiWidth + '%;"></div>'

		return html;
	}
	
	
	return {
		//getBeaconsList: CordovaReady( function(onSuccess, onError, options) {
		getBeaconsList: CordovaReady( function() {	
	//function onDeviceReady()
	//{
			// Specify a shortcut for the location manager holding the iBeacon functions.
			/* Didn't work
			if (onSuccess) {
				console.log('Entered onSuccess');	
			}
			else if (onError) {
				console.log('Entered onError');
			}
			*/
			//console.log('Entered getBeaconsList');
			//hyper.log('Entered getBeaconsList');
			window.estimote = EstimoteBeacons;
			
			startScan();
			displayBeacons.length = 0; //clear displayBeacons array
			displayBeaconList();
			//hyper.log('Just before return, displayBeacons:' + Object.keys(displayBeacons).length);
			return displayBeacons;


			// Start tracking beacons!
			/*
			startScan(function() {
				hyper.log('Got into return startScan')
				var that = this,
				args = arguments;

				if (onSuccess) {
					displayBeaconList();
					$rootScope.$apply(function () {
						onSuccess.apply(that, args);
					});					
				}
			}, function () {
				var that = this,
				args = arguments;

				if (onError) {
					$rootScope.$apply(function () {
						onError.apply(that, args);
					});
				}
			},
			options);
			*/
			/* TRYING short form
			startScan();
			var that = this;
			args = arguments;
			 if (onSuccess) {
			 	displayBeaconList();
			 	$rootScope.$apply(function () {
			 		onSuccess.apply(that, args);
			 	});
			 }
			*/

			// Display refresh timer.
			//updateTimer = setInterval(displayBeaconList, 500);
			
			//return displayBeacons;
	//}
		})
	};
	
	//return displayBeacons;
	//return displayBeacon;
}

angular
	.module('yeomanTestApp')
	.factory('CordovaReady', [CordovaReadyFactory])
	.factory('BeaconList', ['$sce', 'CordovaReady', BeaconListFactory]);
