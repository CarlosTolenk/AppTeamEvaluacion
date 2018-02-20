var app = angular.module('Teamapp');

app.controller('indexCtrl', function($rootScope, $state, $scope){
		$scope.modulo = new Modulo($state.current).getName();

		function Modulo(state){
			this.state = state.name;
			this.name = state.name.split('.')[1];
			this.getName = function(){
				return this.name && this.name[0].toUpperCase() + this.name.slice(1);
			}
		}

		$rootScope.$on("$stateChangeaStart", function(event, toState, toParams, fromtState, fromParams){
			$scope.modulo = new Modulo(toState).getName();
			console.log(toState);
		})

});
