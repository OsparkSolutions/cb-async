# CB Async: Callback Async
A compact function for handling callbacks as Promises. Just create the cb-async handler, pass it as your callback, and await the results. 

**No Nesting!, No Wrapping!, Just a handle to the callback!**

Includes multiple builds, Typescript files is included for custom builds (see builds below). Examples are in ES2017. Module requires at least ES6 to run. If you need to stay backwards compatible use TypeScript or Babel.  No excuses anymore!

## Installation

```npm
npm -i cb-async
```

## Basic Usage
```javascript
//ES6 Module:
import CBAsync from './cb-async/index.js'
//Node/CommonJS: let CBAsync = require('cb-async')

//Function that does something and tells you when its done
async function doSomething(onCompleted){
	//something happens here
	onCompleted(response);
}

//Create an async callback handler 
let completed = CBAsync();

doSomething(completed);

//Wait on the handler to finish 
let myResponse = await completed; 
```
	

## Real Example: (ES 2017) 
```javascript
//Example using the facebook javascript sdk
import CBAsync from './cb-async/index.js'
//cb-async : Simple 16 Lines, 1 Try/Catch Clear Resolution Path
async function checkFBLogin() {
    let loggedIn = false;
    try {
        let loginCallback = CBAsync();
        FB.getLoginStatus(loginCallback);
        let response = await loginCallback;
        if (response.status === 'connected') {
            let meCallback = CBAsync();
            FB.api("/me?fields=email",meCallback);
            let responseMe = await meCallback;
            loggedIn = true;
        }
    }
    catch (err) {
        console.error(err.message);
    }
    return loggedIn;
}
//No cb-async: Callback hell. 26 lines, 3 Try/Catch , Multiple Resolution paths 
function checkFBLogin() {
    return new Promise(function(resolve,reject){
		try{
			FB.getLoginStatus(function(response){
				try{
					if (response.status === 'connected') {
			            FB.api("/me?fields=email",function(responseMe){
							try{				            
								//Do something
							    resolve(true);
							}
							catch(err){
								reject(err);
								console.log(err);
							}
			            });   
			        }
			        resolve(false)
				} catch(err){
					reject(err);
					console.error(err.message)
				}
			});
		} catch(err){
			reject(err);
			console.error(err.message)
		}
	});
```

## Documentation 

### function CBAsync(handler)
Parameters: 

**handler** (optional)

When provided, this function is executed prior to resolving awaiter/promise. This can be an async function/promise. In which case it will be awaited. The 'this' value is set according the the callback, and all of the callback parameters can be accessed in this function. This is primarily for readability or to potentially branch to a set of different tasks independent of the result thread. See example below.  

Returns: **Proxy**

The function returns a 'PromiseLike' proxy that can be provided as a callback function and can be awaited. The result of the promise is either an value ( 1 callback parameter),  array (multiple callback parameters).

### Multiple Callback Parameters & Pre-Resolution Handler
When there is only 1 parameter then it is passed back from the await/promise. If there are multiple parameters then an array is passed back. The contents of the array are the parameters in the order they would have been passed to a standard call back.

Internal:
 ```javascript
/** 
*** This is an example of using cb-async as a callback with tedious.
*** Note how the pre-resolution handler is used to close the connection. (Primarily for readability)
**/


	let connection: any
	connection = await this.connect(config);
	
	//Create the callback and immediately code that I want to close the connection when it is done.
	//Also set my variables using the typical callback style;
	let err, rows
	let sqlCB = CBAsync((_err, _count, _rows) =>{
			connection.close();
			
			//Its typically better to just use the results of the cb-async promise. (See below)
			err = _err;
			rows = _rows;
			
	});
	
	//Create the request and pass the asynchronous callback
	let sqlReq = new Request(proc, sqlCB);
	sqlReq.addParameter(input.name, TYPES.NVarChar, JSON.stringify(input.value));
	
	//Call the proc
	connection.callProcedure(sqlReq);
	
	//Get the results 
	//Note: When there is only 1 paramter it is returned, not an array
	let sqlResults = await sqlCB;

	console.log(results[0] === err) //true
	console.log(results[2] === row) //true		


	err = sqlResults[0];
	if (err) throw err;
	rows = sqlResults[2];



		
  
 ```


## Builds
Below are the current builds. The TypeScript file used is included. So feel free to make any custom build that you need. Just note that Proxy is required.

| (index.js)  | Module |  Target| Notes
| ------------- | :-------------: |:--------:|-----
| ./  | CommonJS  | ES6| Node 8+ 
| ./src/ES2017  |ES6  | ES2017 | async/await (native promises)
| ./src/ES6| ES6| ES6 | Web Legacy

