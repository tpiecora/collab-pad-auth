/**
 * Created by michaelpiecora on 4/21/15.
 */
angular.module('app').factory('PadModals', ["ModalService", "$q", function(ModalService, $q) {
    var self = self;
    return {
        confirm: function (msg) {
            var deferred = $q.defer();
            ModalService.showModal({
                templateUrl: 'user/confirm.html',
                controller: "ConfirmModalController",
                inputs: {
                    title: 'Confirm',
                    message: msg
                }
            }).then(function (modal)
            {
                modal.element.modal();
                modal.close.then(function (result) {
                    deferred.resolve(result);
                });
            });
            return deferred.promise
        }
    }
}]);