# Pure json api

Pure json api is module that allows you to create a single endpoint api that handles your code with dynamic handlers,
without the need of custom routing to each request.
 
## How? 

```javascript
 npm install pure-json-api --save 
```

```javascript

 var options = {
     handlersDir: "./myHandlersDir",
     validateFunc: function (data) {
         return (data["action_str"] !== undefined && typeof data["action_str"] === "string")
             && (data["data_type"] !== undefined && typeof data["data_type"] === "string")
             && (data["log_list"] !== undefined && typeof data["log_list"] === "object")
             && (data["request_map"] !== undefined && typeof data["request_map"] === "object")
             && (data["trans_map"] !== undefined && typeof data["trans_map"] === "object");
     },
     dataType: "",
     actionStr: ""
 };
 
 app.post("/myEndpoint", pureApi.endPoint(options));
```

## The flow
> All the requests will be made to the same endpoint using post request only, the custom validation function 
> will make sure that all the needed data is supplied within the json data object that was sent to the server.
> Then check for the data type handler and the data type action within the object.
> Your data type callback handler will get this function 
 ```javascript
 function (req, res, next) {
      ...
    next(null,responseObj);
    //next first param is an error object
    //and the second obj is the response that will be send to the client
 }
 ```
> and will preform the appropriate actions and return the appropriate response using res.send function.


## Options

### default options object
 
```javascript
var defaults = {
    handlersDir: "/handlers",
    validateFunc: function (data) {
        return true;
    },
    dataType: "data_type",
    actionStr: "action_str"
};
```

### handlersDir
> A path to the directory which contains the custom handlers.  

### validateFunc 
> A custom function which get a data object that return true if valid and false otherwise. 
   
### dataType
> Supple here the name of the field in the data object which corresponds to the handler file name.

### actionStr
> Supple here the name of the field in the data object which corresponds to the specific function within the handler. 

## Handler example
> This handler file is located in my handlers dir under the name person.js.
```javascript
exports.retrieve = function (req, res, next) {
    ...
    next(null, new pureApi.ApiResponse("RETRIEVED", "person"));
};
```
> In order to execute this action I am sending to the endpoint this object:

```javascript
 { action_str    : "retrieve",  
     data_type     : "person",
     log_list      : [ /* application messages   */ ],
     request_map   : { /* request parameters     */ },
     trans_map     : { /* transaction meta-data  */ }
 }
 ```


