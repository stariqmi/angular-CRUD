// npm modules
var Initiator = require('angular-api');
var pluralize = require('pluralize');


/**
 * Constructor function
 * @param {string}  api  Base api url
 */
function AngularCRUD(api) {
    var self = this;
    self.api = api;
    self.models = [];

    // Create an Initiator instance
    self.init = new Initiator(api);
}


/**
 * Function to add a model to the service
 * @param {string}  modelName  name of model
 */
AngularCRUD.prototype.addModel = function(model) {
    var self = this;
    self.models.push(model);

    var routes = {
        CR: ':reqType//' + pluralize(model),
        UD: ':reqType//' + pluralize(model) + '/:id'
    };
    
    // Add route to Initiator instance
    self.init.addRoute(routes.CR);   // POST
    self.init.addRoute(routes.UD); // GET,PUT,DELETE
};


AngularCRUD.prototype.serve = function() {
    var self = this;

    // Return API class
    var AngularAPI = self.init.serve();
    
    AngularAPI.prototype.exists = function(model) {
        return (self.models.indexOf(model) !== -1) ? true : false;
    };

    AngularAPI.prototype.create = function(model, data) {
        if (this.exists(model)) {
            return this.request('POST//' + pluralize(model), data);
        } else {
            throw new Error('Model ' + model + ' does not exist in API');
        }
    };

    AngularAPI.prototype.update = function(model, id, data) {
        if (this.exists(model)) {
            return this.request('PUT//' + pluralize(model) + '/' + id, data);
        } else {
            throw new Error('Model ' + model + ' does not exist in API');
        }
    };

    AngularAPI.prototype.delete = function(model, id) {
        if (this.exists(model)) {
            return this.request('DELETE//' + pluralize(model) + '/' + id);
        } else {
            throw new Error('Model ' + model + ' does not exist in API');
        }
    };
    
    return AngularAPI;
};