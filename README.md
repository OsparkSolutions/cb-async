# Callback Async (CB Async) 
A compact function fo handling callbacks as Promises. Multiple builds, and Typescript files is included for custom builds (see builds below).

Examples are in ES2017. Module requires at least ES6 to run. If you need to stay backwards compatible use TypeScript or Babel.  No excuses anymore!

## Basic Usage
```javascript
//ES6
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
**handler** (optional) - When provided, this function is executed prior to resolving awaiter/promise. This can be an async function/promise. In which case it will be awaited. The 'this' value is set according the the callback, and all of the callback parameters can be accessed in this function. This is primarily for readability or to potentially branch to a set of different tasks independent of the result thread.  

Returns: **Proxy**
The function returns a 'PromiseLike' proxy that can be provided as a callback function and can be awaited.

### Multiple Callback Parameters
When there is only 1 parameter then it is passed back from the await/promise. If there are multiple parameters then an array is passed back. The contents of the array are the parameters in the order they would have been passed to a standard call back.

If you prefer the readability of parameterized results you can do the following:
 ```javascript
async function doSomething(onCompleted){
	//something happens here
	onCompleted(response,data,statusCode);
}

//Create an async callback handler with an internal handler
let response, data, statusCode; 
let completed = CBAsync((_res, _data, _status)=>
	{ response= _res; data= _data; status =_status;});

doSomething(completed);

//Wait on the handler to finish 
let results = await completed;

console.log(results[0] === response) //true
console.log(results[1] === data) //true
console.log(results[2] === status) //true  
 ```


## Builds
Below are the current builds. The TypeScript file used is included. So feel free to make any custom build that you need. Just note that Proxy is required.

| (index.js)  | Module |  Target| Notes
| ------------- | :-------------: |:--------:|-----
| ./  | CommonJS  | ES6| Node 8+ 
| ./src/ES2017  |ES6  | ES2017 | async/await (native promises)
| ./src/ES6| ES6| ES6 | Web Legacy

