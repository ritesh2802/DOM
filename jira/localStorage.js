// set data

localStorage.setItem('name','Ritesh');
localStorage.setItem("school","barrows");
localStorage.setItem("stream","et");
localStorage.setItem("profession","software developer");
localStorage.company="google"
localStorage.hobby="reading";

// get data
let data = localStorage.getItem("name");
console.log(data);

// remove/delete data
let a= localStorage.removeItem("name")
delete localStorage.name;

// get key at index
let d= localStorage.key(1)  ; 
console.log(d);   

// length of local storage
let l = localStorage.length;
console.log(l);


