angular.module('Teamapp').controller('loginCtrl', function($scope, $http, $state, $toastF, Session){
  $scope.master = {};
  $scope.signin = function () {
    var usuario = { username: $scope.usuario.username, password: $scope.usuario.password };
    Session.logIn(usuario)
      .then(function(response){
        if(response.data.success){
            toastF.success('Iniciaste session Correctamente');
            $state.transitionTo('app.dashboard');
        }else{
            toastF.error('Error de autentificación, verificar sus datos');
            $scope.usuario = angular.copy($scope.master);
            $scope.form.$setPristine();
        }
      });
  }

   Session.isLogged()
    .then(function(response){
      var isLogged = response.data.isLoggedl
      if(isLogged){
        $state.go('app.dashboard')
      }
    });
  });
