(function () {
    'use strict';

    angular.module('BlurAdmin.pages.utils')
        .factory('UtilsService', UtilsService);

    /** @ngInject */
    function UtilsService() {
        var service = {}

        var _roles = [
            { value: "100", name: "Administración" },
            { value: "40", name: "Medicina" },
            { value: "30", name: "Psicología" },
            { value: "20", name: "Secretaría" },
            //{ value: 100, name: "Invitado" },
        ]

        var _departamentos = [
            { id: 1, name: "Alta Verapaz" },
            { id: 2, name: "Baja Verapaz" },
            { id: 3, name: "Chimaltenango" },
            { id: 4, name: "Chiquimula" },
            { id: 5, name: "Petén" },
            { id: 6, name: "El Progreso" },
            { id: 7, name: "Quiché" },
            { id: 8, name: "Escuintla" },
            { id: 9, name: "Guatemala" },
            { id: 10, name: "Huehuetenango" },
            { id: 11, name: "Izabal" },
            { id: 12, name: "Jalapa" },
            { id: 13, name: "Jutiapa" },
            { id: 14, name: "Quetzaltenango" },
            { id: 15, name: "Retalhuleu" },
            { id: 16, name: "Sacatepéquez" },
            { id: 17, name: "San Marcos" },
            { id: 18, name: "Santa Rosa" },
            { id: 19, name: "Sololá" },
            { id: 20, name: "Suchitepéquez" },
            { id: 21, name: "Totonicapán" },
            { id: 22, name: "Zacapa" },
        ]

        var _religiones = [
            'Católico',
            'Evangélico',
            'Testigo de Jehová',
            'Mormón',
            'Adventista'
        ]

        var _years = []
        var _months = [
            { id: 0, value: "Enero" },
            { id: 1, value: "Febrero" },
            { id: 2, value: "Marzo" },
            { id: 3, value: "Abril" },
            { id: 4, value: "Mayo" },
            { id: 5, value: "Junio" },
            { id: 6, value: "Julio" },
            { id: 7, value: "Agosto" },
            { id: 8, value: "Septiembre" },
            { id: 9, value: "Octubre" },
            { id: 10, value: "Noviembre" },
            { id: 11, value: "Diciembre" },
        ]
        var _days = []

        var _blood_types = [
            { id: 0, value: "---" },
            { id: 1, value: "AB+" },
            { id: 2, value: "AB-" },
            { id: 3, value: "A+" },
            { id: 4, value: "A-" },
            { id: 5, value: "B+" },
            { id: 6, value: "B-" },
            { id: 7, value: "O+" },
            { id: 8, value: "O-" },
        ]

        var _grados = [
            { id: 0, value: 'Sin Educación' },
            { id: 1, value: 'Educación Primaria' },
            { id: 2, value: 'Educación  Secundaria' },
            { id: 3, value: 'Educación Media Superior' },
            { id: 4, value: 'Educación Universitaria' },
            { id: 5, value: 'Maestría' },
            { id: 6, value: 'Doctorado' }
        ]

        var _estados_caja = [
            { id: 10, value: "APERTURADA" },
            { id: 20, value: "CERRADA" },
        ]

        var _hours = []
        var _minutes = []

        service.getEstadosCaja = function() {
            return _estados_caja
        }

        service.getMinutes = function(range) {
            _minutes = []
            if (!range)
                range = 15

            for(var x = 0; x < 60; )  {
                _minutes.push({ id: x, value: (x < 10 ? "0" : "") + x.toString() })
                x += range
            }
            return _minutes
        }

        service.getHours = function() {
            _hours = []
            for(var x = 0; x < 24; x++)
                _hours.push({ id: x, value: (x < 10 ? "0" : "") + x.toString() })
            return _hours
        }

        service.getGrados = function() {
            return _grados
        }

        service.getBloodTypes = function() {
            return _blood_types
        }

        service.getYears = function() {
            var actualYear = (new Date()).getFullYear()
            _years = []
            for(var x = (actualYear - 99); x <= actualYear; x++) {
                _years.push({ id: x, value: x })
            }
            return _years.reverse()
        }
        service.getMonths = function() {
            return _months
        }
        service.getDays = function() {
            _days = []
            for(var x = 1; x <= 31; x++) {
                _days.push({ id: x, value: x })
            }
            return _days
        }

        service.getReligiones = function() {
            return _religiones
        }

        service.getRoles = function() {
            return _roles
        }
        service.getDepartamentos = function() {
            return _departamentos
        }

        return service
    }

}());
