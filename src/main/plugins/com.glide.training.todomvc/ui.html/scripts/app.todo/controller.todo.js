angular.module('todo').controller('Todo', function($scope, $location, $http) {
	"use strict";

	$scope.taskList = [];
	$scope.taskInput = '';
	$scope.hasTasks = false;
	$scope.incompleteTaskCount = 0;
	$scope.completedTaskCount = 0;
	$scope.toggleAllCompleted = false;
	$scope.statusMask = {};
	$scope.location = $location;

	$scope.addTask = function() {
		var title = $scope.taskInput.trim();
		if (title !== '') {
			$scope.taskList.push(newTask(title));
			$scope.taskInput = '';
		}
	};

	$scope.deleteTask = function(task) {
		var idx = $scope.taskList.indexOf(task);
		if (idx >= 0)
			$scope.taskList.splice(idx, 1);
	};

	$scope.deleteCompleted = function() {
		for (var i = $scope.taskList.length - 1; i >= 0; i--) {
			if ($scope.taskList[i].complete)
				$scope.taskList.splice(i, 1);
		}
	};

	$scope.loadDemoData = function() {
		$http.get('http://localhost:8080/api/now/table/todo_sample').success(function(data) {
			var response = data.result;
			var todo;
			for (var i = 0; i < response.length; ++i) {
				todo = response[i];
				$scope.taskList.push(newTask(todo.title, todo.isComplete));
			}
		});
	};

	$scope.$watch('toggleAllCompleted', function(newValue) {
		$scope.taskList.forEach(function(task) {
			task.complete = newValue;
		});
	});

	$scope.$watch('taskList', function(newTasks) {
		$scope.incompleteTaskCount = $scope.taskList.filter(function(task) {
			return !task.complete;
		}).length;
		$scope.completedTaskCount = $scope.taskList.length - $scope.incompleteTaskCount;
		$scope.hasTasks = newTasks.length > 0;
	}, true);

	$scope.$watch('location.path()', function(newPath) {
		$scope.path = newPath || '/';
		if (/active/.test(newPath))
			$scope.statusMask = { complete: false };
		else if (/completed/.test(newPath))
			$scope.statusMask = { complete : true };
		else
			$scope.statusMask = {};
	});


	function newTask(title, isComplete) {
		return {
			title : title,
			complete: !!isComplete
		}
	}

});