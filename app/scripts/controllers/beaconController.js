'use strict';

/**
 * @ngdoc function
 * @name yeomanTestApp.controller:BeaconCtrl
 * @description
 * # BeaconCtrl
 * Controller of the yeomanTestApp
 */
 
/*
 // Test that controller syntax works
 function BeaconCtrl($scope) {
	
	var displayBeacon = {
		major: 'TestMajor',
		minor: 'TestMinor',
		proximity: 'TestProximity',
		distance: 'TestDistance',	
		rssi: 'TestRSSI'
	};
	
	var displayBeacons = [];
	displayBeacons.push(displayBeacon);
	
	$scope.beacons = displayBeacons;
}
*/  

/*
// Test that controller to factory syntax works
 function BeaconCtrl($scope, BeaconList) {

	var displayBeacons = [];	
	
	displayBeacons.push(BeaconList.get());
	
	$scope.beacons = displayBeacons;
}
*/
 function BeaconCtrl($scope, BeaconList) {

	//var displayBeacons = [];
	//var _beaconList = new BeaconList();
	
	//displayBeacons.push(BeaconList.get());

	function alertDismissed () {

	}

	$scope.buttonClick = function() {
		//console.log('Getting in buttonClick');
		//hyper.log('Getting in buttonClick');
		alert('Alerts are working');
		//navigator.notification.alert('Navigator test', alertDismissed);
	};

	
	//alert('Getting in BeaconCtrl');
	//navigator.notigication.alert('Navigator test', alertDismissed);
	//console.log('Entered BeaconCtrl');
	//hyper.log('Entered BeaconCtrl');
	/*
	BeaconList.getBeaconsList(function(something) { 
		alert(something);
		$scope.beacons = something.displayBeacons;
	});
	*/
	
	//$scope.beacons = displayBeacons;
	//$('#found-beacons').empty();
	
	var intervalId = setInterval(function () {
		$scope.$apply( function () {
			var tempBeacons = BeaconList.getBeaconsList();

			
			$scope.beacons = tempBeacons;
			for (var k in $scope.beacons) {
				//hyper.log('In scope apply: ' + k.major + $scope.beacons[k].major);	
			}
		});
	}, 2000);
	
	$scope.$on('$destroy', function () {
		clearInterval(intervalId);
	});
	
	
	
	/*
	displayBeacons.major = 'TestMajor';
	displayBeacons.minor = 'TestMinor';
	displayBeacons.proximity = 'TestProximity';
	displayBeacons.distance = 'TestDistance';	
	displayBeacons.rssi = 'TestRSSI';*/
	//$scope.beacons = BeaconList.displayBeacons;
	
	/*
	$scope.major = 'TestMajor';
	$scope.minor = 'TestMinor';
	$scope.proximity = 'TestProximity';
	$scope.distance = 'TestDistance';	
	$scope.rssi = 'TestRSSI';
	*/
 }

 
 var BeaconController = angular.module('yeomanTestApp')
  //.controller('BeaconCtrl', ['$scope', BeaconCtrl]);
  .controller('BeaconCtrl', ['$scope', 'BeaconList', BeaconCtrl]);  
/*
  var app = (function()
{
	// Application object.
	var app = {}; //DIDN'T ADD THIS

	// Dictionary of beacons.
	var beacons = {};

	// Timer that displays list of beacons.
	var updateTimer = null;

	app.initialize = function()
	{
		document.addEventListener('deviceready', onDeviceReady, false);
	};

	function onDeviceReady()
	{
		// Specify a shortcut for the location manager holding the iBeacon functions.
		window.estimote = EstimoteBeacons;

		// Start tracking beacons!
		startScan();

		// Display refresh timer.
		updateTimer = setInterval(displayBeaconList, 500);
	}

	function startScan()
	{
		function onBeaconsRanged(beaconInfo)
		{
			//console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
			for (var i in beaconInfo.beacons)
			{
				// Insert beacon into table of found beacons.
				var beacon = beaconInfo.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
				beacons[key] = beacon;
			}
		}

		function onError(errorMessage)
		{
			console.log('Ranging beacons did fail: ' + errorMessage);
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
	}

	function displayBeaconList()
	{
		// Clear beacon list.
		$('#found-beacons').empty();

		var timeNow = Date.now();

		// Update beacon list.
		$.each(beacons, function(key, beacon)
		{
			// Only show beacons that are updated during the last 60 seconds.
			if (beacon.timeStamp + 60000 > timeNow)
			{
				// Create tag to display beacon data.
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

		return 'Proximity: ' + proximityNames[proximity] + '<br />';
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

		return 'Distance: ' + distance + '<br />'
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
			'RSSI: ' + beacon.rssi + '<br />'
			+ '<div style="background:' + rgb + ';height:20px;width:'
			+ 		rssiWidth + '%;"></div>'

		return html;
	}

	return app;
})();

app.initialize();
*/