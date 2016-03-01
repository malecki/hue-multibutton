'use strict'

module.exports = HueFactory

function HueFactory($q, $log, _, machina, Huejay, $localStorage){
    var Hue = machina.Fsm.extend({
        namespace: 'hue-client',
        initialState: 'uninitialized',
        initialize: function(){
            this.username = $localStorage.username || ''
            this.host = $localStorage.host || ''
        },
        getLights: function(){
            return this.client.lights.getAll().then(lights => {
                this.lights = lights
            })
        },
        getRules: function(){
            return this.client.rules.getAll().then(rules => {
                this.rules = rules
            })
        },
        getSensors: function(){
            this.linkedSensors = []
            return this.client.sensors.getAll().then(sensors => {
                this.sensors = sensors
                this.stateSensors = this.sensors.filter(s => {
                    return s.type === 'CLIPGenericStatus' && s.name.indexOf('huelabs') === -1
                })
                this.tapSwitches = this.sensors.filter(s => {
                    return s.type === 'ZGPSwitch'
                })
                if(this.tapSwitches.length > 0){
                    this.selectedSwitch = this.tapSwitches[0]
                }
            })
        },
        fetch: function(){
            var self = this
            return $q.all([
                this.getLights(),
                this.getRules(),
                this.getSensors()
            ]).then(function() {
                self.transition('initialized')
            })
        },
        filterButtonRules: function(id){
            var r = this.rules.filter(rule => {
                return rule.conditions.some(c => {
                    return c.address.indexOf('buttonevent') > -1 && parseInt(c.value) === id
                })
            }).map(rule => {
                var conditions = rule.conditions.filter(c => {
                    return c.address.indexOf('status') > -1
                })
                var actions = rule.actions.filter(a => {
                    return a.method==='PUT' && a.address.indexOf('sensors') > -1
                })
                return {rule: rule, conditions: conditions, actions: actions}
            })
            return r
        },
        addLinkedSensor: function(){
            this.linkedSensors.push({id: null, conditionValue: null, actionValue: null})
        },
        removeLight: function(id){
            _.remove(this.lights, l => {return l.id === id})
        },
        states: {
            uninitialized: {
                initialize: function(cfg){
                    var Hue = new Huejay.Client({
                        username: this.username,
                        host: this.host
                    })
                    Hue.bridge.isAuthenticated().then(auth => {
                        if(auth){
                            this.client = Hue
                            $localStorage.username = this.username
                            $localStorage.host = this.host
                            this.fetch()
                        }
                    })
                }
            },
            initialized: {
                _onEnter: function(){
                    $log.debug('authenticated hue userid', this.username)
                }
            }
        }
    })
    return Hue
}

HueFactory.$inject = ['$q', '$log', 'lodash', 'machina', 'Huejay', '$localStorage']
