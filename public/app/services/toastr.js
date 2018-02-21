angular.module('Teamapp').service('toastF', function (toastr){
	
	this.success = function(msg){
		toastr.success(msg);
	},
	this.error = function(msg){
		toastr.error(msg);
	}
});